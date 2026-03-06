import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const logActivity = async (user_id, task_id, action) => {
  try {
    await prisma.log.create({
      data: {
        action: action,
        taskId: task_id
      }
    });
  } catch (err) {
    console.error("Activity Log Error:", err.message);
  }
};