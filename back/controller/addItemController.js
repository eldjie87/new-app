import db from "../db/db.js"
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsPath = path.join(__dirname, '../data/items.json');
const saldoPath = path.join(__dirname, '../data/saldo.json');

const dbItems = {
    items: [],

    addItem: (req, res) => {
        const { item, price, date } = req.body;
        fs.readFile(saldoPath, 'utf-8', (err, data) => {
            if (err) {
                console.error("Error reading saldo file:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            let currentSaldo = JSON.parse(data).saldo || 0;
            if (Number(price) > currentSaldo) {
                return res.status(400).json({ error: "Insufficient saldo" });
            }
            const newSaldo = currentSaldo - Number(price);
            fs.writeFile(saldoPath, JSON.stringify({ saldo: newSaldo }), (err) => {
                if (err) {
                    console.error("Error writing saldo file:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }
                // Tambah item ke daftar dengan id unik
                const itemList = fs.readFileSync(itemsPath, 'utf-8');
                dbItems.items = JSON.parse(itemList);
                const newItem = {
                    id: Date.now().toString(), // id unik
                    item,
                    price,
                    date
                };
                dbItems.items.push(newItem);
                dbItems.saveToFile((err) => {
                    if (err) {
                        console.error("Error saving item:", err);
                        return res.status(500).json({ error: "Error saving item" });
                    }
                    res.json({ message: "Item added and saldo deducted", saldo: newSaldo, newItem });
                });
            });
        });
    },

    getItems: () => {
        try {
            // Cek dulu apakah file ada
            if (!fs.existsSync(itemsPath)) {
                fs.writeFileSync(itemsPath, JSON.stringify([]));
                return [];
            }
            // Baca file setelah dipastikan ada
            const itemList = fs.readFileSync(itemsPath, 'utf-8');
            // Jika file kosong, kembalikan array kosong
            if (!itemList.trim()) return [];
            dbItems.items = JSON.parse(itemList);
            return dbItems.items;
        } catch (error) {
            console.error("Error reading items:", error);
            return [];
        }
    },

    saveToFile: (callback) => {
        fs.writeFile(itemsPath, JSON.stringify(dbItems.items), (err) => {
            if (err) {
                console.error("Error saving to file:", err);
                callback(err);
            } else {
                callback(null);
            }
        });
    },

    deleteItem: (id, res) => {
        // Baca file dulu agar data selalu update
        let itemList = "[]";
        if (fs.existsSync(itemsPath)) {
            itemList = fs.readFileSync(itemsPath, 'utf-8').trim() || "[]";
        }
        try {
            dbItems.items = JSON.parse(itemList);
        } catch (e) {
            dbItems.items = [];
        }
        dbItems.items = dbItems.items.filter(i => i.id !== id);
        dbItems.saveToFile((err) => {
            if (err) {
                console.error("Error deleting item:", err);
                return res.status(500).json({ error: "Error deleting item" });
            }
            res.json({ message: "Item deleted" });
        });
    }

};

export default dbItems;