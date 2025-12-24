const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getTasks);
router.get('/applications/me', protect, authorize('student'), getMyApplications);
router.get('/:id', getTask);

// Protected routes - MSME only
router.post('/', protect, authorize('msme'), createTask);
router.put('/:id', protect, authorize('msme'), updateTask);
router.delete('/:id', protect, authorize('msme'), deleteTask);
router.post('/:id/assign', protect, authorize('msme'), assignTask);
router.get('/:id/applicants', protect, authorize('msme'), getTaskApplicants);
router.post('/:id/review', protect, authorize('msme'), reviewWork);

// Protected routes - Student only
router.post('/:id/apply', protect, authorize('student'), applyForTask);
router.post('/:id/submit', protect, authorize('student'), submitWork);

module.exports = router;
