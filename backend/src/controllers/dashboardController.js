import prisma from "../config/prisma.js";

export const getDashboardSummary = async (req, res) => {
  try {

    // Total tasks
    const totalTasks = await prisma.task.count();

    // Total users
    const totalUsers = await prisma.user.count();

    // Task status analytics
    const statuses = ["todo", "in_progress", "review", "done"];

    const statusResults = await Promise.all(
      statuses.map(status =>
        prisma.task.count({
          where: { status }
        })
      )
    );

    const tasksByStatus = {};
    statuses.forEach((status, index) => {
      tasksByStatus[status] = statusResults[index];
    });

    // Task priority analytics
    const priorities = ["low", "mid", "high"];

    const priorityResults = await Promise.all(
      priorities.map(priority =>
        prisma.task.count({
          where: { priority }
        })
      )
    );

    const tasksByPriority = {};
    priorities.forEach((priority, index) => {
      tasksByPriority[priority] = priorityResults[index];
    });

    // Tasks due in next 7 days
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const dueSoon = await prisma.task.findMany({
      where: {
        due_date: {
          gte: today,
          lte: nextWeek
        }
      }
    });

    return res.json({
      totalTasks,
      totalUsers,
      tasksByStatus,
      tasksByPriority,
      tasksDueSoon: dueSoon.length
    });

  } catch (error) {

    console.error("Dashboard Error:", error);

    return res.status(500).json({
      error: error.message
    });

  }
};