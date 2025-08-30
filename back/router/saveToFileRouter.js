import saveToFile from "../controller/saveToFileController.js";

import express from "express";

const router = express.Router();

router.post("/save-to-file", saveToFile.saveToSupabase);
router.get("/show-file", saveToFile.showFiles);
router.delete("/delete-file/:filename", saveToFile.deleteFile);

export default router;
