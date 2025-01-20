import { Router } from "express";
import { getChatsStatus } from "./chatstatus.controller";

const router=Router();

router.get('/chatStatus/:id',getChatsStatus);

export default router;