import saldoController from "../controller/saldoController.js";
import express from "express";

const router = express.Router();

router.get("/get-saldo", saldoController.getSaldo);
router.post("/add-saldo", saldoController.updateSaldo);

export default router;
