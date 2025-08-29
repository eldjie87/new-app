import dbItems from "../controller/addItemController.js";
import express from "express";

const router = express.Router();
    
router.post("/add-items", (dbItems.addItem));

    
router.get("/get-items", (req, res) => {
    try {
        const items = dbItems.getItems();
        res.status(200).json(items);
    } catch (error) {
        console.error("Error in /get-items:", error);
        res.status(500).json([]);
    }
});

router.delete("/delete-item/:id", (req, res) => {
    const id = req.params.id;
    dbItems.deleteItem(id, res); // <-- Kirim res ke controller
});

export default router;
