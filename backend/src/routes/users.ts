import express from "express";
import * as UserController from "../controllers/users.ts";

const router = express.Router();

router.post("/signup",  UserController.singUp);

export default router;