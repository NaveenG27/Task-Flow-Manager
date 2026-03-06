import prisma from "../config/prisma.js";

export const getLogs = async (req, res) => {
  try {

    const logs = await prisma.log.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(logs);

  } catch (err) {

    console.error("Logs Error:", err);

    return res.status(500).json({
      error: err.message
    });

  }
};