import saldoController from "../controller/saldoController.js";
import express from "express";

const router = express.Router();

router.get("/saldo", saldoController.getSaldo);
router.post("/saldo", saldoController.updateSaldo);

export default router;
