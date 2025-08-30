import { supabase } from "../supabase/supabase.js";

const saldoController = {
    // Ambil saldo dari Supabase
    getSaldo: async (req, res) => {
        try {
            const { data, error } = await supabase
                .from("saldo")
                .select("saldo")
                .eq("id", 1)
                .maybeSingle();
            if (error) throw error;
            res.json({ saldo: data?.saldo ?? 0 });
        } catch (err) {
            console.error("Error reading saldo from Supabase:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    // Update saldo di Supabase (tambah saldo)
    updateSaldo: async (req, res) => {
        const recharge = Number(req.body.saldo);
        if (isNaN(recharge) || recharge <= 0) {
            return res.status(400).json({ error: "Invalid saldo value" });
        }
        try {
            // Ambil saldo lama
            const { data, error } = await supabase
                .from("saldo")
                .select("saldo")
                .eq("id", 1)
                .maybeSingle();
            if (error) throw error;
            const currentSaldo = data?.saldo ?? 0;
            const newSaldo = currentSaldo + recharge;

            // Update saldo di Supabase
            const { error: updateError } = await supabase
                .from("saldo")
                .update({ saldo: newSaldo })
                .eq("id", 1);
            if (updateError) throw updateError;

            res.json({ message: "Saldo updated successfully", saldo: newSaldo });
        } catch (err) {
            console.error("Error updating saldo in Supabase:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    },
};

export default saldoController;