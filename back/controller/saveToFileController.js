import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saveToFile = (req, res) => {
    const { items, filename } = req.body;
    if (typeof filename !== "string" || !filename) {
        return res.status(400).json({ error: "Filename must be a valid string" });
    }
    if (!items) {
        return res.status(400).json({ error: "No items to save" });
    }
    try {
        const json = JSON.stringify(items, null, 2);
        fs.writeFileSync(path.join(__dirname, '../file', filename), json);
        res.json({ message: "File saved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const showFile = (req, res) => {
    try {
        const files = fs.readdirSync(path.join(__dirname, '../file'));
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteFile = (req, res) => {
   try {
       const { filename } = req.params;
       fs.unlinkSync(path.join(__dirname, '../file', filename));
       res.json({ message: "File deleted successfully" });
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};

export default { 
    saveToFile,
    showFile,
    deleteFile
};