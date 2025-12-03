const express = require('express');
const router = express.Router();
const SortByDate = require('../models/SortByDate');

// GET all sort by dates
router.get('/', async (req, res) => {
    try {
        const dates = await SortByDate.find();
        res.json(dates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one sort by date
router.get('/:id', async (req, res) => {
    try {
        const date = await SortByDate.findById(req.params.id);
        if (date == null) {
            return res.status(404).json({ message: 'Cannot find sort by date' });
        }
        res.json(date);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// CREATE a sort by date
router.post('/', async (req, res) => {
    const date = new SortByDate({
        sortByDate: req.body.sortByDate,
        is_active: req.body.is_active
    });
    try {
        const newDate = await date.save();
        res.status(201).json(newDate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a sort by date
router.put('/:id', async (req, res) => {
    try {
        const date = await SortByDate.findById(req.params.id);
        if (date == null) {
            return res.status(404).json({ message: 'Cannot find sort by date' });
        }

        if (req.body.sortByDate != null) {
            date.sortByDate = req.body.sortByDate;
        }
        if (req.body.is_active != null) {
            date.is_active = req.body.is_active;
        }

        const updatedDate = await date.save();
        res.json(updatedDate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a sort by date
router.delete('/:id', async (req, res) => {
    try {
        const date = await SortByDate.findById(req.params.id);
        if (date == null) {
            return res.status(404).json({ message: 'Cannot find sort by date' });
        }
        await date.deleteOne();
        res.json({ message: 'Deleted sort by date' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
