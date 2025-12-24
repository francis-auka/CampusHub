const socketio = require('socket.io');
const Message = require('./models/Message');

let io;

const initSocket = (server, allowedOrigins) => {
    io = socketio(server, {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Join a task room for chat
        socket.on('joinTask', ({ taskId }) => {
            socket.join(taskId);
            console.log(`User joined task room: ${taskId}`);
        });

        // Handle chat messages
        socket.on('sendMessage', async ({ taskId, senderId, content }) => {
            try {
                const message = await Message.create({
                    task: taskId,
                    sender: senderId,
                    content
                });

                const populatedMessage = await Message.findById(message._id).populate('sender', 'name profilePhoto businessLogo');

                io.to(taskId).emit('message', populatedMessage);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        // Handle typing indicator
        socket.on('typing', ({ taskId, userName, isTyping }) => {
            socket.to(taskId).emit('userTyping', { userName, isTyping });
        });

        // Join user-specific room for notifications
        socket.on('joinUser', ({ userId }) => {
            socket.join(userId);
            console.log(`User joined personal room: ${userId}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initSocket, getIO };
