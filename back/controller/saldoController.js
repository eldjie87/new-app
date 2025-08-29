import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const saldoPath = path.join(__dirname, '../data/saldo.json');

const saldoController = {
    getSaldo: (req, res) => {
        fs.readFile(saldoPath, 'utf-8', (err, data) => {
            if (err) {
                console.error("Error reading saldo file:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            saldoController.amount = JSON.parse(data).saldo;
            res.json({ saldo: saldoController.amount });
        });
    },

    updateSaldo: (req, res) => {
        const recharge = Number(req.body.saldo);
        if (isNaN(recharge) || recharge <= 0) {
            return res.status(400).json({ error: "Invalid saldo value" });
        }
        fs.readFile(saldoPath, 'utf-8', (err, data) => {
            if (err) {
                console.error("Error reading saldo file:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            let currentSaldo = JSON.parse(data).saldo || 0;
            try {
                const json = currentSaldo + recharge;
            } catch (error) {
                currentSaldo = 0;
            }
            const newSaldo = currentSaldo + recharge;
            fs.writeFile(saldoPath, JSON.stringify({ saldo: newSaldo }), (err) => {
                if (err) {
                    console.error("Error writing saldo file:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }
                saldoController.amount = newSaldo;
                res.json({ message: "Saldo updated successfully" });
            });
        });
    }
};

export default saldoController;