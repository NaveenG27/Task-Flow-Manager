import { supabase } from "../config/supabase.js";

export const logActivity = async (user_id, task_id, action) => {
  try {
    await supabase.from("activity_logs").insert([
      {
        user_id,
        task_id,
        action
      }
    ]);
  } catch (err) {
    console.error("Activity Log Error:", err.message);
  }
};