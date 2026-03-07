import prisma from "../config/prisma.js";
import { logActivity } from "../utils/logActivity.js";


// Create Task
export const createTask = async (req, res) => {
  try {

    const { title, description, priority, dueDate, assignedToId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status: "todo",
        dueDate: dueDate ? new Date(dueDate) : null,

        createdById: req.user.id,   
        assignedToId                
      }
    });

    await logActivity(req.user.id, task.id, "Task Created");

    return res.json({
      message: "Task created successfully",
      task
    });

  } catch (err) {

    console.error("Create Task Error:", err);

    return res.status(500).json({
      error: err.message
    });

  }
};


// Get All Tasks
export const getAllTasks = async (req, res) => {
  try {

    const tasks = await prisma.task.findMany({
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return res.json(tasks);

  } catch (err) {

    console.error("Get Tasks Error:", err);

    return res.status(500).json({
      error: err.message
    });

  }
};


// Get Task by ID
export const getTaskById = async (req, res) => {
  try {

    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        createdBy: true
      }
    });

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    return res.json(task);

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }
};


// Update Task Status
export const updateTaskStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { status }
    });

    await logActivity(req.user.id, id, `Status changed to ${status}`);

    return res.json({
      message: "Task status updated",
      task
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
      return res.status(400).json({
        error: "Invalid priority"
      });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { priority }
    });

    await logActivity(req.user.id, id, `Priority changed to ${priority}`);

    return res.json({
      message: "Priority updated successfully",
      task
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }
};


// Delete Task
export const deleteTask = async (req, res) => {
  try {

    const { id } = req.params;

    await prisma.task.delete({
      where: { id }
    });

    await logActivity(req.user.id, id, "Task Deleted");

    return res.json({
      message: "Task deleted successfully"
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }
};