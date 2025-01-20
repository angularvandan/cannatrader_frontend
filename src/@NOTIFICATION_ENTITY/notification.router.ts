import express from 'express';
import { auth } from '../../middleware/auth';
import { deleteNotification, getNotifications, markAllRead, markSingleNotificationRead } from './notification.controller';

const router = express.Router();

router.get('/', auth, getNotifications)
router.patch('/mark-all-read', auth, markAllRead)
router.patch('/mark-read', auth, markSingleNotificationRead)
router.delete('/:id', auth, deleteNotification)

export default router