const express = require("express");
const Blog = require("../models/blog");

const router = express.Router();

router.post("/blogs", async (req, res) => {
  try {
      const { title, body, author } = req.body;
      if (!title || !body || !author) return res.status(400).json({ error: "All fields are required" });

      const newBlog = new Blog({ title, body, author });
      await newBlog.save();
      res.status(201).json(newBlog);
  } catch (error) {
      console.error(error);  // Логируем ошибку
      res.status(500).json({ error: "Server error" });
  }
});

router.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (err) {
        console.error("Ошибка при получении блогов:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

router.get("/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            console.log("Ошибка: блог не найден.");
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (err) {
        console.error("Ошибка при получении блога:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

router.put("/blogs/:id", async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedBlog) {
            console.log("Ошибка: блог не найден.");
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json(updatedBlog);
    } catch (err) {
        console.error("Ошибка при обновлении блога:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

router.delete("/blogs/:id", async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            console.log("Ошибка: блог не найден.");
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
        console.error("Ошибка при удалении блога:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

module.exports = router;
