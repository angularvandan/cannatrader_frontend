import { Router } from "express"
import { auth } from "../../middleware/auth"
import { rateProduct } from "./rating.controller"

const router = Router()

router.post('/rate-product/:productId', auth, rateProduct)

export default router