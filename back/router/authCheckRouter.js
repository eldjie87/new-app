import authCheck from "../middleware/authCheck.js";
import express from "express";

const router = express.Router();

router.get("/check", authCheck);

export default router;
