const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ['student', 'msme'],
        required: [true, 'Please specify a role'],
    },

    // Student-specific fields
    university: {
        type: String,
        required: function () { return this.role === 'student'; },
    },
    course: String,
    skills: [String],
    portfolio: [String],
    resume: String, // Path to resume file

    // MSME-specific fields
    company: {
        type: String,
        required: function () { return this.role === 'msme'; },
    },
    businessDescription: String,
    servicesOffered: [String],
    businessLogo: String,
    companyProfile: String, // Path to company profile/portfolio file
    businessCategory: String,
    location: String,
    website: String,
    socialLinks: {
        linkedin: String,
        twitter: String,
        facebook: String,
        instagram: String
    },

    // Common fields
    profilePhoto: {
        type: String,
        default: '',
    },
    bio: String,
    resume: String, // Path to resume file
    phone: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
