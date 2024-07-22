import express from 'express';
import BlogPost from '../models/BlogPost.js';
import cloudinaryUploader from '../config/cloudinaryConfig.js';
import { v2 as cloudinary } from 'cloudinary';
import { sendEmail } from '../services/emailService.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
// import controlloMail from '../middlewares/controlloMail.js'; // NON USARE - SOLO PER DIDATTICA - MIDDLEWARE (commentato)

const router = express.Router();

// router.use(controlloMail); // NON USARE - SOLO PER DIDATTICA - Applicazione del middleware a tutte le rotte (commentato)

// GET /blogPosts
router.get('/', async (req, res) => {
  try {
    // Filter blog posts by title (case-insensitive research)
    let query = {};
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' };
    }

    // Filter blog posts by query (if exist)
    const blogPosts = await BlogPost.find(query);
    res.json(blogPosts);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /blogPosts/:id
router.get('/:id', async (req, res) => {
  try {
    // Find blog post by id in MongoDB
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(blogPost);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Auth middleware for the others routes
router.use(authMiddleware);

// POST /blogPosts - with cover upload
router.post('/', cloudinaryUploader.single('cover'), async (req, res) => {
  try {
    const postData = req.body;

    if (req.file) {
      postData.cover = req.file.path;
    }

    const newPost = new BlogPost(postData);

    // Save new blog post in MongoDB
    await newPost.save();

    const htmlContent = `
      <h1>Post published!</h1>
      <p>Hi ${newPost.author}</p>
      <p>This is your post: "${newPost.title}"</p>
      <p>thank you</p>
    `

    // Mailgun trigger
    await sendEmail(newPost.author, 'post created!', htmlContent)

    res.status(201).json(newPost);

  } catch (err) {
    console.error('Post creation error', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT /blogPosts/:id
router.put('/:id', async (req, res) => {
  try {
    // Find and update specific blog post in MongoDB
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // Option to return the updated document
    );

    if (!updatedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.json(updatedBlogPost);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /blogPosts/:id
router.delete('/:id', async (req, res) => {
  try {
    
    // Find post by id
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Pull cloudinary cover public id
    const publicId = `blog_covers/${post.cover.split('/').pop().split('.')[0]}`

    // Delete cloudinary img
    await cloudinary.uploader.destroy(publicId);

    // Find and delete specific post in MongoDB
    const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);

    if (!deletedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /blogPosts/:id/cover
router.patch('/:id/cover', cloudinaryUploader.single('cover'), async (req, res) => {
  try {
    if(!req.file) {
      return res.status(400).json({ message: 'Blog post cover file not uploaded' })
    }

    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' })
    }

    // blog post cover data on cloudinary
    blogPost.cover = req.file.path;

    // Save on MongoDB
    await blogPost.save();

    // Send request
    res.json(blogPost);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /blogPosts/:id/comments
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' })
    }

    res.json(post.comments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /blogPosts/:id/comments/:commentId
router.get('/:id/comments/:commentId', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' })
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    res.json(comment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /blogPosts/:id/comments
router.post('/:id/comments', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' })
    }

    const newComment = {
      name: req.body.name,
      email: req.body.email,
      content: req.body.content,
    }

    // Add comments
    post.comments.push(newComment);

    // Save comment on MongoDB
    await post.save();

    res.status(201).json(comment);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /blogPosts/:id/comments/:commentId
router.patch('/:id/comments/:commentId', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' })
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    // TODO:
    comment.content = req.body.content;

    // Save comment on MongoDB
    await post.save();

    res.json(comment);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /blogPosts/:id/comments/:commentId
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' })
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    // delete comment
    comment.remove();

    // Save post on MongoDB
    await post.save();

    // Send message
    res.json({ message: 'comment deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
