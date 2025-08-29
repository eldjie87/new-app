import saveToFile from "../controller/saveToFileController.js";

import express from "express";

const router = express.Router();

router.post("/save-to-file", saveToFile.saveToFile);
router.get("/show-file", saveToFile.showFile);
router.delete("/delete-file/:filename", saveToFile.deleteFile);

export default router;
