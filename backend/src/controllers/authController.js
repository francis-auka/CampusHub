const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        console.log('Register request body:', req.body);
        console.log('Register request files:', req.files);

        const {
            name, email, password, role,
            university, course, skills, bio,
            company, businessDescription, servicesOffered, businessCategory, location, website
        } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user data object
        const userData = {
            name,
            email,
            password,
            role,
        };

        // Handle role-specific fields
        if (role === 'student') {
            userData.university = university;
            userData.course = course;
            userData.bio = bio;
            if (skills) {
                userData.skills = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills;
            }
        } else if (role === 'msme') {
            userData.company = company;
            userData.businessDescription = businessDescription;
            userData.businessCategory = businessCategory;
            userData.location = location;
            userData.website = website;
            if (servicesOffered) {
                userData.servicesOffered = typeof servicesOffered === 'string' ? servicesOffered.split(',').map(s => s.trim()) : servicesOffered;
            }
        }

        // Handle file uploads
        if (req.files) {
            if (req.files.profilePhoto) {
                userData.profilePhoto = `/uploads/${req.files.profilePhoto[0].filename}`;
            }
            if (req.files.businessLogo) {
                userData.businessLogo = `/uploads/${req.files.businessLogo[0].filename}`;
            }
            if (req.files.resume) {
                userData.resume = `/uploads/${req.files.resume[0].filename}`;
            }
            if (req.files.companyProfile) {
                userData.companyProfile = `/uploads/${req.files.companyProfile[0].filename}`;
            }
        }

        const user = await User.create(userData);

        if (user) {
            console.log('User created successfully:', user._id);
            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(201).json({
                ...userResponse,
                token: generateToken(user._id),
            });
        } else {
            console.log('Invalid user data');
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        console.log('Login request:', req.body.email);
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.comparePassword(password))) {
            console.log('Login successful for:', email, 'Role:', user.role);
            const userResponse = user.toObject();
            delete userResponse.password;

            res.json({
                ...userResponse,
                token: generateToken(user._id),
            });
        } else {
            console.log('Login failed: Invalid credentials for', email);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        };

        if (req.user.role === 'student') {
            fieldsToUpdate.university = req.body.university;
            fieldsToUpdate.course = req.body.course;
            fieldsToUpdate.bio = req.body.bio;
            if (req.body.skills) {
                fieldsToUpdate.skills = typeof req.body.skills === 'string' ? req.body.skills.split(',').map(s => s.trim()) : req.body.skills;
            }
        } else if (req.user.role === 'msme') {
            fieldsToUpdate.company = req.body.company;
            fieldsToUpdate.businessDescription = req.body.businessDescription;
            fieldsToUpdate.businessCategory = req.body.businessCategory;
            fieldsToUpdate.location = req.body.location;
            fieldsToUpdate.website = req.body.website;
            if (req.body.servicesOffered) {
                fieldsToUpdate.servicesOffered = typeof req.body.servicesOffered === 'string' ? req.body.servicesOffered.split(',').map(s => s.trim()) : req.body.servicesOffered;
            }
            if (req.body.socialLinks) {
                fieldsToUpdate.socialLinks = typeof req.body.socialLinks === 'string' ? JSON.parse(req.body.socialLinks) : req.body.socialLinks;
            }
        }

        if (req.files) {
            if (req.files.profilePhoto) {
                fieldsToUpdate.profilePhoto = `/uploads/${req.files.profilePhoto[0].filename}`;
            }
            if (req.files.businessLogo) {
                fieldsToUpdate.businessLogo = `/uploads/${req.files.businessLogo[0].filename}`;
            }
            if (req.files.resume) {
                fieldsToUpdate.resume = `/uploads/${req.files.resume[0].filename}`;
            }
            if (req.files.companyProfile) {
                fieldsToUpdate.companyProfile = `/uploads/${req.files.companyProfile[0].filename}`;
            }
        }

        const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateDetails
};
