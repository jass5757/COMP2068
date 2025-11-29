const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'To-Do List App' });
});

// Public tasks page (read-only)
router.get('/public-tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    res.render('public-tasks', { 
      title: 'All Tasks',
      tasks 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;