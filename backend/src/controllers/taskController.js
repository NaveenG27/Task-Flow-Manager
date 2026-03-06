import { logActivity } from "../utils/logActivity.js";


// Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, assigned_to, due_date } = req.body;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          description,
          priority,
          status: "todo",
          assigned_to,
          created_by: req.user.id,
          due_date,
        }
      ])
      .select("id")
      .single();

    if (error) return res.status(400).json({ error });

    // Log activity
    await logActivity(req.user.id, data.id, "Task Created");

    return res.json({ message: "Task created successfully" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Get All Tasks
export const getAllTasks = async (req, res) => {
  try {

   const { data, error } = await supabase
  .from("tasks")
  .select(`
    id,
    title,
    description,
    priority,
    status,
    due_date,
    assigned_to,
    users:assigned_to (
      id,
      name,
      email
    )
  `);

    if (error) return res.status(400).json({ error });

    return res.json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Get Task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(400).json({ error });

    return res.json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Update Task Status
 export const updateTaskStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    await logActivity(req.user.id, id, `Status changed to ${status}`);

    return res.json({
      message: "Task status updated",
      task: data
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }
};


// Update Task Priority
export const updateTaskPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const validPriorities = ["low", "mid", "high"];

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: "Invalid priority" });
    }

    const { error } = await supabase
      .from("tasks")
      .update({ priority })
      .eq("id", id);

    if (error) return res.status(400).json({ error });

    // Correct log msg
    await logActivity(req.user.id, id, `Priority changed to ${priority}`);

    return res.json({ message: "Priority updated successfully" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) return res.status(400).json({ error });

    // Log BEFORE return
    await logActivity(req.user.id, id, "Task Deleted");

    return res.json({ message: "Task deleted successfully" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};