import express from "express";
import * as UserController from "../controllers/users.ts";
import { requiresAuth } from "../middleware/auth.ts";

const router = express.Router();

router.get("/", requiresAuth, UserController.getAuthenticatedUser);

router.post("/logout", UserController.logout);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);


export default router;