import { createContext, useState, useEffect, useContext } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectUser, selectToken } from "../redux/slices/authSlice";
import io from "socket.io-client";
import { serverUrl } from "../config/api";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const authUser = useAppSelector(selectUser);
    const token = useAppSelector(selectToken);

	useEffect(() => {
		if (authUser && token) {
			const socket = io(serverUrl, {
				auth: {
					token: token,
				},
			});

			setSocket(socket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

            socket.on("connect_error", (err) => {
                console.error("Socket Connection Error:", err.message);
            });

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser, token]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
