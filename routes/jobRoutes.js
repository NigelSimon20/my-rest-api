const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

router.get('/', async (req, res) => {
    try {
        const { title, company, skillsRequired, location, salary, page = 1, limit = 10 } = req.query;
        const query = {};

        if (title) query.title = new RegExp(title, 'i');
        if (company) query.company = new RegExp(company, 'i');
        if (skillsRequired) query.skillsRequired = { $in: skillsRequired.split(',') };
        if (location) query.location = new RegExp(location, 'i');
        if (salary) query.salary = { $gte: salary };

        const jobs = await Job.find(query)
            .limit(parseInt(limit))
            .skip((page - 1) * limit);
        const count = await Job.countDocuments(query);

        res.json({
            jobs,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job == null) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const job = new Job({
        title: req.body.title,
        company: req.body.company,
        description: req.body.description,
        skillsRequired: req.body.skillsRequired,
        location: req.body.location,
        salary: req.body.salary
    });

    try {
        const newJob = await job.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job == null) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (req.body.title != null) job.title = req.body.title;
        if (req.body.company != null) job.company = req.body.company;
        if (req.body.description != null) job.description = req.body.description;
        if (req.body.skillsRequired != null) job.skillsRequired = req.body.skillsRequired;
        if (req.body.location != null) job.location = req.body.location;
        if (req.body.salary != null) job.salary = req.body.salary;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job == null) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.remove();
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
