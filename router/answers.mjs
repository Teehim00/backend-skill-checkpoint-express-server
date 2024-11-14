import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const answersRouter = Router();

answersRouter.post("/:answerId/vote", async (req, res) => {
  const newVote = req.body;
  try {
    const answerId = parseInt(req.params.answerId, 10);
    if (isNaN(answerId)) {
      return res.status(400).json({
        message: "Invalid request data. Answer ID must be a valid number.",
      });
    }

    if (![1, -1].includes(newVote.vote)) {
      return res.status(400).json({
        message: "Invalid vote value.",
      });
    }

    const result = await connectionPool.query(
      `SELECT * FROM answers WHERE id = $1`,
      [answerId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Answer not found.",
      });
    }

    await connectionPool.query(
      `INSERT INTO answer_votes (answer_id, vote) VALUES ($1, $2)`,
      [answerId, newVote.vote]
    );

    return res.status(200).json({
      message: "Vote on the answer has been recorded successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to vote on the answer.",
    });
  }
});

export default answersRouter;
