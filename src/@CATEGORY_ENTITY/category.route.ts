import { Router } from "express";
import { getCategories, getDryMethod, getGrowMedia, getGrowthMethod, getStrainTypes, getSubCategories, getTHCrange, getTrimMethod } from "./category.controller";

const router = Router();

router.get("/getCategories", getCategories)
router.get("/getTHCrange", getTHCrange)
router.get("/getStrainTypes", getStrainTypes)
router.get("/getGrowMedia", getGrowMedia)
router.get("/getGrowthMethod", getGrowthMethod)
router.get("/getTrimMethod", getTrimMethod)
router.get("/getDryMethod", getDryMethod)
router.get("/getSubCategories/:categoryId", getSubCategories)

export default router