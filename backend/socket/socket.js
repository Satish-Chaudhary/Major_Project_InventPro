import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.use(async (socket, next) => {
    // Check both auth and handshake queries for token flexibility
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    
    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user to get current role (not stored in token payload)
        const user = await User.findById(decoded.userId).select('role fullName');
        
        if (!user) {
            return next(new Error("Authentication error: User not found"));
        }

        socket.user = { userId: decoded.userId, role: user.role, fullName: user.fullName };
        next();
    } catch (err) {
        console.error("Socket Auth Error:", err.message);
        return next(new Error("Authentication error: Invalid token"));
    }
});

io.on("connection", (socket) => {
	const userId = socket.user?.userId;
    const role = socket.user?.role;

	if (userId) {
        userSocketMap[userId] = socket.id;
        
        // Join rooms based on role
        if (role) {
            socket.join(`role:${role}`);
            console.log(`✅ Socket connected: ${userId} (${role})`);
        }
    }

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		if (userId) {
            delete userSocketMap[userId];
        }
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
        console.log(`❌ Socket disconnected: ${userId}`);
	});
});

export { app, io, server };
