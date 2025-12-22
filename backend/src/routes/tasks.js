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

// Protected routes - Student only
router.post('/:id/apply', protect, authorize('student'), applyForTask);

module.exports = router;
