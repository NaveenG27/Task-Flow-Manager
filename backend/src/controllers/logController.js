

export const getLogs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) return res.status(400).json({ error });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};