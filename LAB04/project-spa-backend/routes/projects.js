const express = require('express');
const router = express.Router();
const Project = require('../models/project');

// GET all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ dueDate: 1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving projects', 
            error: error.message 
        });
    }
});

module.exports = router;