import { Router } from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "./wishlist.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.route('/:id')
    .post(auth, addToWishlist)
    .delete(auth, removeFromWishlist)

router.get('/getAllWishlist', auth, getWishlist)
export default router;