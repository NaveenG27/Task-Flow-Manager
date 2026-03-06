import express from "express";

const router = express.Router();

router.post("/generate-description", (req, res) => {

  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const description = `Task: ${title}. Implement this feature with proper validation, error handling, and documentation.`;

  res.json({ description });

});

export default router;