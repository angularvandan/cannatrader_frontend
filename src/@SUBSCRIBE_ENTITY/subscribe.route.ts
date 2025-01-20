import { Router } from 'express'
import { getAllSubscribtions, subscribe, unsubscribe } from './subscribe.controller'
import { auth } from '../../middleware/auth'

const router = Router()

router.post('/subscribe', auth, subscribe)
router.delete('/unsubscribe', auth, unsubscribe)
router.get('/subscriptions', auth, getAllSubscribtions)
export default router