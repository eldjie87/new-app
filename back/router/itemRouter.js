import express from "express";
import itemController from "../controller/addItemController.js";

const router = express.Router();

// =====================
// Items
// =====================

// Tambah item (otomatis potong saldo)
router.post("/add-items", itemController.addItem);

// Ambil semua item / transaksi
router.get("/get-items", itemController.getItems);

// Hapus item berdasarkan id
router.delete("/delete-item/:id", itemController.deleteItem);

// =====================
// Saldo
// =====================

// Ambil saldo saat ini
router.get("/saldo", itemController.getSaldo);

// Reset / update saldo manual
router.put("/saldo", itemController.updateSaldo);

export default router;
