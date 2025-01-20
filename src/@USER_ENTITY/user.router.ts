import { Router } from "express";
import { forgotPassword, getUsers, loginUser, register, changePassword, verifyOTP, resetPassword, getProfile, deleteUser, updateProfile, verifyRegOtp, resendOTP } from "./user.controller";
import { upload } from "../../utils/s3"
import { auth } from '../../middleware/auth'
import { uploadImages, uploadPDF } from "../@ADMIN_ENTITY/admin.controller";
const router = Router();

router
    .route('/profile')
    .get(auth, getProfile)
    .put(auth, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), updateProfile)
router.delete('/delete', auth, deleteUser);
router.post('/register', upload.fields([{ name: 'pdf', maxCount: 1 }]), register);
router.post("/verify-registerOtp", verifyRegOtp);
router.post("/resentOTP", resendOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/forgotPassword', forgotPassword);
router.post('/login', loginUser)
router.put('/changePassword', auth, changePassword)
router.put('/resetPassword', resetPassword)
//Upload Images
router.post('/uploadImages', auth, upload.fields([{ name: 'images', maxCount: 5 }]), uploadImages)
router.post('/uploadPDF', auth, upload.fields([{ name: 'pdf', maxCount: 1 }]), uploadPDF)

export default router;