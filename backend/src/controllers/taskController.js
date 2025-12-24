const Task = require('../models/Task');
const Application = require('../models/Application');

// @desc    Get all tasks with filters
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
    try {
        const { search, category, type, minBudget, maxBudget, skills, status, postedBy, assignedTo } = req.query;

        // Build query
        let query = {};

        // Search in title and description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by type
        if (type) {
            const types = Array.isArray(type) ? type : [type];
            query.type = { $in: types };
        }

        // Filter by budget range
        if (minBudget || maxBudget) {
            query.budget = {};
            if (minBudget) query.budget.$gte = Number(minBudget);
            if (maxBudget) query.budget.$lte = Number(maxBudget);
        }

        // Filter by skills
        if (skills) {
            const skillsArray = Array.isArray(skills) ? skills : [skills];
            query.skills = { $in: skillsArray };
        }

        // Filter by status (default to open unless specific status requested or filtering by user)
        if (status) {
            query.status = status;
        } else if (!postedBy && !assignedTo) {
            // Only show tasks that are open or in-progress but not fully assigned
            query.$or = [
                { status: 'open' },
                {
                    status: 'in-progress',
                    $expr: { $lt: [{ $size: "$assigned" }, "$maxAssignees"] }
                }
            ];
        }

        // Filter by postedBy
        if (postedBy) {
            query.postedBy = postedBy;
        }

        // Filter by assignedTo
        if (assignedTo) {
            query.assignedTo = assignedTo;
        }

        const tasks = await Task.find(query)
            .populate('postedBy', 'name company email profilePhoto businessLogo businessDescription businessCategory location')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get current user's applications
// @route   GET /api/tasks/applications/me
// @access  Private (Student only)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user._id })
            .populate({
                path: 'task',
                populate: { path: 'postedBy', select: 'name company' }
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('postedBy', 'name company email profilePhoto businessLogo businessDescription businessCategory location website socialLinks')
            .populate('assignedTo', 'name email profilePhoto university skills bio resume')
            .populate('applicants', 'name email profilePhoto university skills bio resume');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({
            success: true,
            data: task,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (MSME only)
const createTask = async (req, res) => {
    try {
        const { title, description, category, type, budget, deadline, skills, attachments } = req.body;

        const task = await Task.create({
            title,
            description,
            category,
            type,
            budget,
            deadline,
            skills,
            attachments: attachments || [],
            postedBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (MSME - owner only)
const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check ownership
        if (task.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({
            success: true,
            data: task,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (MSME - owner only)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check ownership
        if (task.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();

        res.json({
            success: true,
            message: 'Task deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Apply for a task
// @route   POST /api/tasks/:id/apply
// @access  Private (Student only)
const applyForTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            task: req.params.id,
            applicant: req.user._id,
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this task' });
        }

        // Create application
        const application = await Application.create({
            task: req.params.id,
            applicant: req.user._id,
            coverLetter: req.body.coverLetter || '',
        });

        // Add applicant to task
        task.applicants.push(req.user._id);
        await task.save();

        res.status(201).json({
            success: true,
            data: application,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get applicants for a task
// @route   GET /api/tasks/:id/applicants
// @access  Private (MSME - owner only)
const getTaskApplicants = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('postedBy', 'name company email');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check ownership
        const postedById = task.postedBy._id ? task.postedBy._id.toString() : task.postedBy.toString();
        if (postedById !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view applicants for this task' });
        }

        // Get all applications for this task
        const applications = await Application.find({ task: req.params.id })
            .populate('applicant', 'name email profilePhoto university skills bio')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: applications.length,
            data: {
                task: {
                    _id: task._id,
                    title: task.title,
                    description: task.description,
                    budget: task.budget,
                    deadline: task.deadline,
                    status: task.status
                },
                applications
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const { sendNotification } = require('../utils/notificationService');

// @desc    Assign task to a student
// @route   POST /api/tasks/:id/assign
// @access  Private (MSME - owner only)
const assignTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check ownership
        if (task.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to assign this task' });
        }

        const { studentId } = req.body;

        // Check if student applied
        const hasApplied = task.applicants.some(id => id.toString() === studentId);
        if (!hasApplied) {
            return res.status(400).json({ message: 'Student has not applied for this task' });
        }

        // Check if already assigned
        const isAlreadyAssigned = task.assigned.some(a => a.student.toString() === studentId);
        if (isAlreadyAssigned) {
            return res.status(400).json({ message: 'Student is already assigned to this task' });
        }

        // Check maxAssignees
        if (task.assigned.length >= task.maxAssignees) {
            return res.status(400).json({ message: 'Task has reached maximum number of assignees' });
        }

        task.assigned.push({ student: studentId, status: 'in-progress' });
        task.status = 'in-progress';
        await task.save();

        // Update application status
        await Application.findOneAndUpdate(
            { task: req.params.id, applicant: studentId },
            { status: 'accepted' }
        );

        // Send real-time notification
        await sendNotification(
            studentId,
            req.user._id,
            'assignment',
            task._id,
            `You have been assigned to the task: ${task.title}`
        );

        res.json({
            success: true,
            data: task,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Submit work for a task
// @route   POST /api/tasks/:id/submit
// @access  Private (Student only)
const submitWork = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const assignment = task.assigned.find(a => a.student.toString() === req.user._id.toString());
        if (!assignment) return res.status(403).json({ message: 'You are not assigned to this task' });

        const { content, attachments } = req.body;
        assignment.submission = {
            content,
            attachments: attachments || [],
            submittedAt: new Date()
        };
        assignment.status = 'submitted';

        await task.save();

        // Notify MSME
        await sendNotification(
            task.postedBy,
            req.user._id,
            'submission',
            task._id,
            `Student ${req.user.name} has submitted work for: ${task.title}`
        );

        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Approve or request revision for work
// @route   POST /api/tasks/:id/review
// @access  Private (MSME only)
const reviewWork = async (req, res) => {
    try {
        const { studentId, action, feedback } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const assignment = task.assigned.find(a => a.student.toString() === studentId);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        if (action === 'approve') {
            assignment.status = 'completed';
            assignment.feedback = feedback;
        } else if (action === 'revise') {
            assignment.status = 'revisions-requested';
            assignment.feedback = feedback;
        }

        // Check if all assigned students are completed
        const allCompleted = task.assigned.every(a => a.status === 'completed');
        if (allCompleted) {
            task.status = 'completed';
        }

        await task.save();

        // Notify Student
        await sendNotification(
            studentId,
            req.user._id,
            action === 'approve' ? 'completion' : 'feedback',
            task._id,
            action === 'approve' ? `Your work for ${task.title} has been approved!` : `Revision requested for ${task.title}`
        );

        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    applyForTask,
    assignTask,
    getMyApplications,
    getTaskApplicants,
    submitWork,
    reviewWork
};
