const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Task = require('../src/models/Task');
const Application = require('../src/models/Application');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Task.deleteMany({});
        await Application.deleteMany({});
        console.log('Cleared existing data');

        // Create Users
        const student1 = await User.create({
            name: 'John Student',
            email: 'john@student.com',
            password: 'password123',
            role: 'student',
            university: 'Tech University',
            skills: ['React', 'Node.js', 'Python']
        });

        const student2 = await User.create({
            name: 'Jane Student',
            email: 'jane@student.com',
            password: 'password123',
            role: 'student',
            university: 'Design College',
            skills: ['Figma', 'UI/UX', 'Adobe XD']
        });

        const msme1 = await User.create({
            name: 'Tech Corp',
            email: 'tech@corp.com',
            password: 'password123',
            role: 'msme',
            company: 'Tech Corp Inc.',
            businessCategory: 'IT Services',
            location: 'New York'
        });

        const msme2 = await User.create({
            name: 'Creative Studio',
            email: 'creative@studio.com',
            password: 'password123',
            role: 'msme',
            company: 'Creative Studio',
            businessCategory: 'Design',
            location: 'San Francisco'
        });

        console.log('Users created');

        // Create Tasks
        const task1 = await Task.create({
            title: 'Build a React Website',
            description: 'We need a modern website built with React and Tailwind CSS.',
            category: 'Web Development',
            type: 'project',
            budget: 500,
            deadline: new Date('2025-12-31'),
            skills: ['React', 'Tailwind CSS'],
            postedBy: msme1._id,
            status: 'open'
        });

        const task2 = await Task.create({
            title: 'Logo Design',
            description: 'Design a professional logo for our new startup.',
            category: 'Design',
            type: 'micro-task',
            budget: 100,
            deadline: new Date('2025-12-15'),
            skills: ['Figma', 'Illustrator'],
            postedBy: msme2._id,
            status: 'open'
        });

        const task3 = await Task.create({
            title: 'Python Data Analysis',
            description: 'Analyze customer data using Python and Pandas.',
            category: 'Data Entry',
            type: 'project',
            budget: 300,
            deadline: new Date('2026-01-15'),
            skills: ['Python', 'Pandas'],
            postedBy: msme1._id,
            status: 'in-progress',
            assignedTo: student1._id,
            applicants: [student1._id]
        });

        console.log('Tasks created');

        // Create Applications
        await Application.create({
            task: task1._id,
            applicant: student1._id,
            coverLetter: 'I am interested in this project.',
            status: 'pending'
        });

        await Application.create({
            task: task2._id,
            applicant: student2._id,
            coverLetter: 'I have experience in logo design.',
            status: 'pending'
        });

        // Application for assigned task (accepted)
        await Application.create({
            task: task3._id,
            applicant: student1._id,
            coverLetter: 'I am an expert in Python.',
            status: 'accepted'
        });

        // Update task applicants
        task1.applicants.push(student1._id);
        await task1.save();

        task2.applicants.push(student2._id);
        await task2.save();

        console.log('Applications created');
        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
