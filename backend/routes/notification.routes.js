import express from 'express'
import { authMiddleware } from '../middleware/isAuth.middleware.js'
import { getMyNotifications, markRead, markAllRead } from '../controllers/notification.controllers.js'

const router = express.Router();

router.get('/all', authMiddleware, getMyNotifications);
router.put('/read/:id', authMiddleware, markRead);
router.put('/read-all', authMiddleware, markAllRead);

export default router;
