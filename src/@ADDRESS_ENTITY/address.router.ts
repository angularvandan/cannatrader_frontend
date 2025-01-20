import { Router } from "express";
import { getAddressById } from "./address.controller";

const router=Router();

router.get('/address/:id',getAddressById);

export default router;