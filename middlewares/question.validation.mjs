export const validateCreateQuestionData = (req, res, next) => {
  const { title, description, category} = req.body;


  if (!title) {
    return res.status(400).json({
      message:
        "กรุณาส่งข้อมูล title ของโพสต์เข้ามาด้วย Title is required หรือ Title must be a string",
    });
  }

  if (!description) {
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล description ของโพสต์เข้ามาด้วย",
    });
  }

  if (!category) {
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล category ของโพสต์เข้ามาด้วย",
    });
  }

  if (typeof title !== "string") {
    return res.status(400).json({ message: "Title must be a string" });
  }

  if (typeof description !== "string") {
    return res.status(400).json({ message: "Description is must be a string" });
  }
  if (typeof category !== "string") {
    return res.status(400).json({ message: "category is must be a string" });
  }

  next();
};
