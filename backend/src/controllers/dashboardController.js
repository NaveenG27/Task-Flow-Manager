import { supabase } from "../config/supabase.js";

export const getDashboardSummary = async (req, res) => {
  try {

    // Total tasks
    const { count: totalTasks } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true });

    // Total users
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    // Task status analytics
    const statuses = ["todo", "in_progress", "review", "done"];

    const statusResults = await Promise.all(
      statuses.map(status =>
        supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("status", status)
      )
    );

    const tasksByStatus = {};
    statuses.forEach((status, index) => {
      tasksByStatus[status] = statusResults[index].count;
    });

    // Task priority analytics
    const priorities = ["low", "mid", "high"];

    const priorityResults = await Promise.all(
      priorities.map(priority =>
        supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("priority", priority)
      )
    );

    const tasksByPriority = {};
    priorities.forEach((priority, index) => {
      tasksByPriority[priority] = priorityResults[index].count;
    });

    // Tasks due in next 7 days
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const { data: dueSoon } = await supabase
      .from("tasks")
      .select("*")
      .gte("due_date", today.toISOString().split("T")[0])
      .lte("due_date", nextWeek.toISOString().split("T")[0]);

    return res.json({
      totalTasks,
      totalUsers,
      tasksByStatus,
      tasksByPriority,
      tasksDueSoon: dueSoon?.length || 0
    });

  } catch (error) {

    console.error("Dashboard Error:", error.message);

    return res.status(500).json({
      error: error.message
    });

  }
};