const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');


router.get('/teachers', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/teachers', async (req, res) => {
    const teacher = new Teacher({
        fullName: req.body.fullName,
        age: req.body.age,
        dateOfBirth: req.body.dateOfBirth,
        numberOfClasses: req.body.numberOfClasses
    });

    try {
        const newTeacher = await teacher.save();
        res.status(201).json(newTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/teachers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findById(id);

        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/teachers/search', async (req, res) => {
    const { name } = req.query;
    try {
        const teacher = await Teacher.findOne({ fullName: new RegExp(name, 'i') });
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/teachers/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        if (req.body.fullName != null) teacher.fullName = req.body.fullName;
        if (req.body.age != null) teacher.age = req.body.age;
        if (req.body.dateOfBirth != null) teacher.dateOfBirth = req.body.dateOfBirth;
        if (req.body.numberOfClasses != null) teacher.numberOfClasses = req.body.numberOfClasses;

        const updatedTeacher = await teacher.save();
        res.json(updatedTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/teachers/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        await teacher.deleteOne();
        res.json({ message: 'Teacher deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/teachers/filter/age', async (req, res) => {
    const { minAge, maxAge } = req.query;
    try {
        const teachers = await Teacher.find({ age: { $gte: minAge, $lte: maxAge } });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/teachers/filter/classes', async (req, res) => {
    const { minClasses, maxClasses } = req.query;
    try {
        const teachers = await Teacher.find({ numberOfClasses: { $gte: minClasses, $lte: maxClasses } });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/teachers/average/classes', async (req, res) => {
    try {
        const teachers = await Teacher.find({});
        const totalClasses = teachers.reduce((sum, teacher) => sum + teacher.numberOfClasses, 0);
        const averageClasses = totalClasses / teachers.length;
        res.json({ averageClasses });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
