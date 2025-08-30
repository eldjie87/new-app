import { supabase } from "../supabase/supabase.js";

// Simpan semua item ke tabel 'files' di Supabase
const saveToSupabase = async (req, res) => {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "No items to save" });
    }
    try {
        const { error } = await supabase
            .from("files")
            .insert(items);

        if (error) throw error;
        res.json({ message: "Items saved to Supabase", count: items.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Tampilkan semua item dari tabel 'files'
const showFiles= async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("files")
            .select("filename")
            .neq("filename", null);
        if (error) throw error;
        // Ambil nama file unik
        const uniqueFiles = [...new Set(data.map(item => item.filename))];
        res.json(uniqueFiles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Hapus item dari tabel 'files' berdasarkan id
const deleteFile = async (req, res) => {
    const { filename } = req.params;
    try {
        const { error } = await supabase
            .from("files")
            .delete()
            .eq("filename", filename);
        if (error) throw error;
        res.json({ message: "File deleted from Supabase" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default { 
    saveToSupabase,
    showFiles,
    deleteFile
};