import { Router } from "express";
import { getCompanyDetails, registerCompany, updateBusiness } from "./company.controller";
import { upload } from "../../utils/s3";
import { auth } from "../../middleware/auth";

const router = Router();
router.post('/register', auth, upload.fields([{ name: 'pdf', maxCount: 1 }]), registerCompany);
router.get('/getCompanyInfo', auth, getCompanyDetails);
router.put('/update-company-info', auth, updateBusiness)
export default router;