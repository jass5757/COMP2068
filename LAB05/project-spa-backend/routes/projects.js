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

// POST - Create new project
router.post('/', async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(501).json({ 
            message: 'Error creating project', 
            error: error.message 
        });
    }
});

// PUT - Update project
router.put('/', async (req, res) => {
    try {
        const updatedProject = await Project.findOneAndUpdate(
            { _id: req.body._id },
            req.body,
            { new: true }
        );
        res.status(202).json(updatedProject);
    } catch (error) {
        res.status(400).json({ 
            message: 'Error updating project', 
            error: error.message 
        });
    }
});

// DELETE - Remove project
router.delete('/:_id', async (req, res) => {
    try {
        await Project.deleteOne({ _id: req.params._id });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ 
            message: 'Error deleting project', 
            error: error.message 
        });
    }
});

module.exports = router;