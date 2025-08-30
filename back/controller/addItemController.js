import { supabase } from "../supabase/supabase.js";

const itemController = {
  // ➕ Tambah item & update saldo
  addItem: async (req, res) => {
    const { item, price, date } = req.body;

    try {
      // 1. Ambil saldo sekarang
      const { data: saldoData, error: saldoError } = await supabase
        .from("saldo")
        .select("saldo")
        .eq("id", 1)
        .single();

      if (saldoError) throw saldoError;
      let currentSaldo = saldoData?.saldo || 0;

      // 2. Cek saldo cukup atau tidak
      if (Number(price) > currentSaldo) {
        return res.status(400).json({ error: "Insufficient saldo" });
      }

      const newSaldo = currentSaldo - Number(price);

      // 3. Update saldo
      const { error: updateError } = await supabase
        .from("saldo")
        .update({ saldo: newSaldo })
        .eq("id", 1);

      if (updateError) throw updateError;

      // 4. Tambah item baru ke table transactions (tanpa field saldo)
      const newItem = { item, price, date };
      const { data: insertedItem, error: insertError } = await supabase
        .from("transactions")
        .insert([newItem])
        .select()
        .single();

      if (insertError) throw insertError;

      res.json({
        message: "Item added and saldo deducted",
        saldo: newSaldo,
        newItem: insertedItem,
      });
    } catch (err) {
      console.error("Error addItem:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // 📖 Ambil semua item
  getItems: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (err) {
      console.error("Error getItems:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // ❌ Hapus item berdasarkan id
  deleteItem: async (req, res) => {
    const { id } = req.params;

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      res.json({ message: "Item deleted" });
    } catch (err) {
      console.error("Error deleteItem:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // 💰 Ambil saldo saat ini
  getSaldo: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("saldo")
        .select("saldo")
        .eq("id", 1)
        .single();

      if (error) throw error;
      res.json({ saldo: data?.saldo ?? 0 });
    } catch (err) {
      console.error("Error getSaldo:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // 🔄 Reset saldo manual
  updateSaldo: async (req, res) => {
    const { saldo } = req.body;

    try {
      const { data, error } = await supabase
        .from("saldo")
        .update({ saldo })
        .eq("id", 1)
        .select()
        .single();

      if (error) throw error;
      res.json({ saldo: data?.saldo ?? saldo });
    } catch (err) {
      console.error("Error updateSaldo:", err);
      res.status(500).json({ error: err.message });
    }
  },
};

export default itemController;