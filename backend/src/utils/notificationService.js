const Notification = require('../models/Notification');
const { getIO } = require('../socket');

const sendNotification = async (recipientId, senderId, type, taskId, messageText) => {
    try {
        const notification = await Notification.create({
            recipient: recipientId,
            sender: senderId,
            type,
            task: taskId,
            message: messageText
        });

        try {
            const io = getIO();
            io.to(recipientId.toString()).emit('notification', notification);
        } catch (socketError) {
            console.warn('Socket.io not available for notification emission:', socketError.message);
        }

        return notification;
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = { sendNotification };
