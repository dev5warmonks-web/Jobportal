const express = require('express');
const router = express.Router();
const JobExperience = require('../models/JobExperience');

// GET all job experiences
router.get('/', async (req, res) => {
    try {
        // const experiences = await JobExperience.find();
        const experiences = await JobExperience.find().sort({ createdAt: 1 });
        res.json(experiences);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one job experience
router.get('/:id', async (req, res) => {
    try {
        const experience = await JobExperience.findById(req.params.id);
        if (experience == null) {
            return res.status(404).json({ message: 'Cannot find job experience' });
        }
        res.json(experience);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// CREATE a job experience
router.post('/', async (req, res) => {
    const experience = new JobExperience({
        jobExperience: req.body.jobExperience,
        is_active: req.body.is_active
    });
    try {
        const newExperience = await experience.save();
        res.status(201).json(newExperience);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a job experience
router.put('/:id', async (req, res) => {
    try {
        const experience = await JobExperience.findById(req.params.id);
        if (experience == null) {
            return res.status(404).json({ message: 'Cannot find job experience' });
        }

        if (req.body.jobExperience != null) {
            experience.jobExperience = req.body.jobExperience;
        }
        if (req.body.is_active != null) {
            experience.is_active = req.body.is_active;
        }

        const updatedExperience = await experience.save();
        res.json(updatedExperience);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a job experience
router.delete('/:id', async (req, res) => {
    try {
        const experience = await JobExperience.findById(req.params.id);
        if (experience == null) {
            return res.status(404).json({ message: 'Cannot find job experience' });
        }
        await experience.deleteOne();
        res.json({ message: 'Deleted job experience' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
