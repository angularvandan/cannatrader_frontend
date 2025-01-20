import { Router } from "express";
import { addProduct, deleteProduct, editProduct, getMyProducts, getProducts, getSingleProduct } from "./product.controller";
import { auth, authRole } from "../../middleware/auth";
import { upload } from "../../utils/s3";

const router = Router();

// router.get('/get-products', auth, getProducts);
router.get('/get-products', getProducts);
router.get('/get-recent-listing', auth, authRole, getMyProducts);
router.post('/add-product', auth, authRole, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'images', maxCount: 5 }]), addProduct)
router.route('/:id')
    .post(getSingleProduct)
    .delete(auth, deleteProduct)
    .put(auth, editProduct)
export default router;