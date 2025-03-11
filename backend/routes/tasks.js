const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const router = express.Router();
require('dotenv').config();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all tasks for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Add a new task
router.post('/', authenticateToken, async (req, res) => {
  const { title } = req.body;
  try {
    const task = new Task({ title, user: req.user.userId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Update a task
router.put('/:id', authenticateToken, async (req, res) => {
  const { title } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }
    task.title = title;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (task.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
