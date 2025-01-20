import { Router } from "express";
import { getContent, submitQuery } from "./content.controller";

const router = Router()

router.get('/', getContent)
router.post('/query', submitQuery)
export default router