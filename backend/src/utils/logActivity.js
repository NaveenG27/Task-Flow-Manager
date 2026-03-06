import prisma from "../config/prisma.js";

export const logActivity = async (user_id, task_id, action) => {
  try {
    await prisma.log.create({
      data: {
        action,
        taskId: task_id
      }
    });
  } catch (err) {
    console.error("Activity Log Error:", err.message);
  }
};