const Message = require('../models/Message');

// @desc    Get chat history for a task
// @route   GET /api/chat/:taskId
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        const messages = await Message.find({ task: req.params.taskId })
            .populate('sender', 'name profilePhoto businessLogo')
            .sort({ createdAt: 1 });

        res.json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getChatHistory
};
