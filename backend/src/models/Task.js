const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a task title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a task description'],
    },
    category: {
        type: String,
        required: [true, 'Please specify a category'],
    },
    type: {
        type: String,
        enum: ['micro-task', 'project', 'internship', 'attachment'],
        required: [true, 'Please specify a task type'],
    },
    budget: {
        type: Number,
        required: [true, 'Please provide a budget'],
        min: 0,
    },
    deadline: {
        type: Date,
        required: [true, 'Please provide a deadline'],
    },
    skills: {
        type: [String],
        required: [true, 'Please specify required skills'],
    },
    attachments: [String],

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    maxAssignees: {
        type: Number,
        default: 1,
        min: 1,
    },
    assigned: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['in-progress', 'submitted', 'completed', 'revisions-requested'],
            default: 'in-progress',
        },
        submission: {
            content: String,
            attachments: [String],
            submittedAt: Date,
        },
        feedback: String,
        assignedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed', 'cancelled'],
        default: 'open',
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
}, {
    timestamps: true,
});

// Index for search optimization
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ category: 1, type: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
