import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateQuestionData } from "../middlewares/question.validation.mjs";
import { validateCreateAnswerData } from "../middlewares/answer.validation.mjs";

// ใช้ express.json() เพื่อให้สามารถอ่าน body ที่เป็น JSON ได้

const questionsRouter = Router();

questionsRouter.post("/", [validateCreateQuestionData], async (req, res) => {
  const newQuestions = req.body;
  console.log(newQuestions);

  try {
    await connectionPool.query(
      `INSERT INTO questions (title, description, category)
         VALUES ($1, $2, $3) RETURNING id`,
      [newQuestions.title, newQuestions.description, newQuestions.category]
    );

    return res.status(200).json({
      message: `Question created successfully`,
    });
  } catch (error) {
    if (
      !newAssignments.title ||
      !newAssignments.description ||
      !newAssignments.category
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    return res.status(500).json({
      message: "Unable to create question.",
    });
  }
});

questionsRouter.post(
  "/:questionId/answers",
  [validateCreateAnswerData],
  async (req, res) => {
    const newAnswer = req.body;
    try {
      const questionId = parseInt(req.params.questionId, 10);
      if (isNaN(questionId)) {
        return res.status(400).json({
          message: "Invalid request data.",
        });
      }

      const result = await connectionPool.query(
        `SELECT id FROM questions WHERE id = $1`,
        [questionId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Question not found.",
        });
      }
      await connectionPool.query(
        `INSERT INTO answers (question_id, content)
             VALUES ($1, $2)`,
        [questionId, newAnswer.content]
      );
      return res.status(201).json({
        message: "Answer created successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Unable to create answers.",
      });
    }
  }
);

questionsRouter.post("/:questionId/vote", async (req, res) => {
  const newVote = req.body;
  try {
    const questionId = parseInt(req.params.questionId, 10);
    if (isNaN(questionId)) {
      return res.status(400).json({
        message: "Invalid request data.",
      });
    }
    const result = await connectionPool.query(
      `SELECT * FROM questions WHERE id = $1`,
      [questionId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }
    await connectionPool.query(
      `INSERT INTO question_votes (question_id, vote) VALUES ($1, $2)`,
      [questionId, newVote.vote]
    );

    return res.status(200).json({
      message: "Vote on the question has been recorded successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to vote question.",
    });
  }
});

questionsRouter.get("/", async (req, res) => {
  try {
    const result = await connectionPool.query(
      `SELECT id, title, category, description FROM questions`
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No questions found" });
    }
    return res.json({
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Unable to fetch questions.`,
    });
  }
});

questionsRouter.get("/search", async (req, res) => {
  try {
    const title = req.query.title || "";
    const category = req.query.category || "";

    if (!title && !category) {
      return res.status(400).json({
        message: "Invalid request data.",
      });
    }
    let query = `SELECT id, title, description, category FROM questions`;
    let values = [];

    if (title && category) {
      query += ` WHERE category ILIKE $1 AND (title ILIKE $2 OR description ILIKE $2)`;
      values = [`%${category}%`, `%${title}%`];
    } else if (title) {
      query += ` WHERE title ILIKE $1 OR description ILIKE $1`;
      values = [`%${title}%`];
    } else if (category) {
      query += ` WHERE category ILIKE $1`;
      values = [`%${category}%`];
    }
    const results = await connectionPool.query(query, values);
    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }
    return res.status(200).json({
      message: "Answer created successfully.",
      data: results.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to create answers.",
    });
  }
});

questionsRouter.get("/:Id", async (req, res) => {
  try {
    const questionsIdFromClient = req.params.Id;
    const results = await connectionPool.query(
      `
          SELECT * FROM questions WHERE id = $1
          `,
      [questionsIdFromClient]
    );
    if (!results.rows[0]) {
      return res.status(404).json({
        message: `Question not found.`,
      });
    }
    return res.status(200).json({
      data: results.rows[0],
    });
  } catch (e) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
      error: e.message,
    });
  }
});

questionsRouter.get("/:questionId/answers", async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const results = await connectionPool.query(
      `
            SELECT * FROM answers WHERE question_id = $1
            `,
      [questionId]
    );
    if (!results.rows[0]) {
      return res.status(404).json({
        message: `Question not found.`,
      });
    }
    return res.status(200).json({
      data: results.rows[0],
    });
  } catch (e) {
    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }
});

questionsRouter.put("/:Id", [validateCreateQuestionData], async (req, res) => {
  const questionsIdFromClient = req.params.Id;
  const updatedQuestions = req.body;
  try {
    const result = await connectionPool.query(
      `
          update questions
          set title =$2,
          description = $3,
          category = $4
          where id =$1
          `,
      [
        questionsIdFromClient,
        updatedQuestions.title,
        updatedQuestions.description,
        updatedQuestions.category,
      ]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      message: "Update post successfully",
    });
  } catch (error) {
    if (
      !updatedQuestions.title ||
      !updatedQuestions.description ||
      !updatedQuestions.category
    ) {
      return res.status(400).json({
        message: "Invalid request data.",
      });
    }
    console.error(error);
    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }
});

questionsRouter.delete("/:Id", async (req, res) => {
  const questionsIdFromClient = req.params.Id;
  try {
    const result = await connectionPool.query(
      `delete from questions
          where id = $1`,
      [questionsIdFromClient]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      message: "Question post has been deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete question.",
    });
  }
});

questionsRouter.delete("/:questionId/answers", async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const result = await connectionPool.query(
      `delete from answers
            where question_id = $1`,
      [questionId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      message: "All answers deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete question.",
    });
  }
});

export default questionsRouter;
