const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

// Apply authentication middleware to all routes
router.use(ensureAuthenticated);

// GET all tasks for logged-in user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.render('tasks/index', { 
      title: 'My Tasks',
      tasks 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET add task form
router.get('/add', (req, res) => {
  res.render('tasks/add', { title: 'Add Task' });
});

// POST create new task
router.post('/add', async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    const task = new Task({
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      user: req.user.id
    });

    await task.save();
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating task');
  }
});

// GET edit task form
router.get('/edit/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    res.render('tasks/edit', { 
      title: 'Edit Task',
      task 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST update task
router.post('/edit/:id', async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    
    await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        title, 
        description, 
        priority, 
        dueDate: dueDate || null,
        completed: completed === 'on'
      }
    );

    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating task');
  }
});

// GET delete confirmation
router.get('/delete/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    res.render('tasks/delete', { 
      title: 'Delete Task',
      task 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST delete task
router.post('/delete/:id', async (req, res) => {
  try {
    await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting task');
  }
});

// POST toggle task completion
router.post('/toggle/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (task) {
      task.completed = !task.completed;
      await task.save();
    }

    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating task');
  }
});

// API endpoint for notifications
router.get('/api/notifications', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueTasks = await Task.find({
      user: req.user.id,
      completed: false,
      dueDate: { $lt: today }
    });
    
    const dueTodayTasks = await Task.find({
      user: req.user.id,
      completed: false,
      dueDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    res.json({
      overdue: overdueTasks.length,
      dueToday: dueTodayTasks.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

module.exports = router;