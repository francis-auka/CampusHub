const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    coverLetter: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'accepted', 'rejected'],
        default: 'pending',
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Prevent duplicate applications
applicationSchema.index({ task: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
