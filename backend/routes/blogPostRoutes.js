import express from "express";
import BlogPost from "../models/BlogPost.js";
import upload from "../middlewares/upload.js";
// import controlloMail from "../middlewares/controlloMail.js"; // NON USARE - SOLO PER DIDATTICA - MIDDLEWARE (commentato)

const router = express.Router();

// router.use(controlloMail); // NON USARE - SOLO PER DIDATTICA - Applicazione del middleware a tutte le rotte (commentato)

// GET /blogPosts
router.get("/", async (req, res) => {
  try {

    // Filter blog posts by title (case-insensitive research)
    let query = {};
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: "i" };
    }

    // Filter blog posts by query (if exist)
    const blogPosts = await BlogPost.find(query);
    res.json(blogPosts);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /blogPosts/<blogPost._id>
router.get("/:id", async (req, res) => {
  try {
    // Find blog post by id in MongoDB
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(blogPost);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /blogPosts - with cover upload
router.post("/", upload.single('cover'), async (req, res) => {
  try {
    const postData = req.body;

    if (req.file) {
      postData.cover = `http://localhost:5005/uploads/${req.file.filename}`;
    }

    const newPost = new BlogPost(postData);

    // Save new blog post in MongoDB
    await newPost.save();

    res.status(201).json(newPost);

  } catch (err) {
    console.error('Post creation error', err);
    res.status(400).json({ message: err.message });
  }
});



// PUT /blogPosts/<blogPost._id>
router.put("/:id", async (req, res) => {
  try {
    // Find and update specific blog post in MongoDB
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // Option to return the updated document
    );

    if (!updatedBlogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    
    res.json(updatedBlogPost);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /blogPosts/<blogPost._id>
router.delete("/:id", async (req, res) => {
  try {
    // Find and delete specific author in MongoDB
    const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);

    if (!deletedBlogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json({ message: "Blog post eliminato" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
