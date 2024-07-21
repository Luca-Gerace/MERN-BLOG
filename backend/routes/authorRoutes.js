import express from 'express';
import cloudinaryUploader from '../config/cloudinaryConfig.js';
import Author from '../models/Author.js';
import BlogPost from '../models/BlogPost.js';

const router = express.Router();

// GET /authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();

    res.json(authors);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /authors/:id
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.json(author);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /authors
router.post('/', async (req, res) => {
  const author = new Author(req.body);
  try {
    // Save new author in MongoDB
    const newAuthor = await author.save();

    res.status(201).json(newAuthor);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /authors/:id
router.put('/:id', async (req, res) => {
  try {
    // Find and update specific author in MongoDB
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.json(updatedAuthor);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /authors/:id
router.delete('/:id', async (req, res) => {
  try {
    // Find and delete specific author in MongoDB
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);

    if (!deletedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.json({ message: 'Author deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /authors/:id/blogPosts
router.get('/:id/blogPosts', async (req, res) => {
  try {
    // Find author by id
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    // Find all author's blog posts by author email (unique param)
    const blogPosts = await BlogPost.find({ author: author.email });

    res.json(blogPosts);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /author/:id/avatar
router.patch('/:id/avatar', cloudinaryUploader.single('avatar'), async (req, res) => {
  try {
    if(!req.file) {
      return res.status(400).json({ message: 'Author avatar file not uploaded' })
    }

    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' })
    }

    // author avatar data on cloudinary
    author.avatar = req.file.path;

    // Save on MongoDB
    await author.save();

    // Send request
    res.json(author);

  } catch(err) {
    res.status(500).json({ message: err.message });
  }
})

export default router;
