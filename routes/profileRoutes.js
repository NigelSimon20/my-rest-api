const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');


router.get('/', async (req, res) => {
    try {
        const { name, skills, location, experience, page = 1, limit = 10 } = req.query;
        const query = {};

        if (name) query.name = new RegExp(name, 'i');
        if (skills) query.skills = { $in: skills.split(',') };
        if (location) query.location = new RegExp(location, 'i');
        if (experience) query.experience = { $gte: experience };

        const profiles = await Profile.find(query)
            .limit(parseInt(limit))
            .skip((page - 1) * limit);
        const count = await Profile.countDocuments(query);

        res.json({
            profiles,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (profile == null) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const profile = new Profile({
        name: req.body.name,
        skills: req.body.skills,
        experience: req.body.experience,
        location: req.body.location
    });

    try {
        const newProfile = await profile.save();
        res.status(201).json(newProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (profile == null) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (req.body.name != null) profile.name = req.body.name;
        if (req.body.skills != null) profile.skills = req.body.skills;
        if (req.body.experience != null) profile.experience = req.body.experience;
        if (req.body.location != null) profile.location = req.body.location;

        const updatedProfile = await profile.save();
        res.json(updatedProfile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (profile == null) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        await profile.remove();
        res.json({ message: 'Profile deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
