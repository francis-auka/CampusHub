const express = require('express');
const router = express.Router();
const { register, login, getMe, updateDetails } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'businessLogo', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'companyProfile', maxCount: 1 }
]), register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'businessLogo', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'companyProfile', maxCount: 1 }
]), updateDetails);

module.exports = router;
