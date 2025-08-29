import login from "../controller/loginController.js";
import express from "express";

const router = express.Router();

router.post("/login", login.login);
router.post("/register", login.register);

export default router;
