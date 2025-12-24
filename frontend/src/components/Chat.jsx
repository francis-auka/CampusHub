import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { AuthContext } from '../contexts/AuthContext';
import api, { API_URL } from '../utils/api';

const Chat = ({ taskId, taskTitle }) => {
    const socket = useSocket();
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await api.get(`/chat/${taskId}`);
                setMessages(response.data.data);
                scrollToBottom();
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        fetchChatHistory();
    }, [taskId]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('joinTask', { taskId });

        socket.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
            scrollToBottom();
        });

        socket.on('userTyping', ({ userName, isTyping }) => {
            if (isTyping) {
                setTypingUser(userName);
            } else {
                setTypingUser(null);
            }
        });

        return () => {
            socket.off('message');
            socket.off('userTyping');
        };
    }, [socket, taskId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        socket.emit('sendMessage', {
            taskId,
            senderId: user._id,
            content: newMessage
        });

        setNewMessage('');
        handleTyping(false);
    };

    const handleTyping = (typing) => {
        if (!socket) return;

        if (typing !== isTyping) {
            setIsTyping(typing);
            socket.emit('typing', {
                taskId,
                userName: user.name,
                isTyping: typing
            });
        }

        if (typing) {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                handleTyping(false);
            }, 3000);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-card overflow-hidden border border-gray-100">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-900">Task Chat</h3>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{taskTitle}</p>
                </div>
                <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500">Live</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {messages.map((msg) => {
                    const isMe = msg.sender._id === user._id;
                    return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                                <div className="flex-shrink-0">
                                    {msg.sender.profilePhoto || msg.sender.businessLogo ? (
                                        <img
                                            src={`${API_URL}${msg.sender.profilePhoto || msg.sender.businessLogo}`}
                                            alt={msg.sender.name}
                                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                                            {msg.sender.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm ${isMe
                                        ? 'bg-primary-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none'
                                    }`}>
                                    {!isMe && <p className="text-[10px] font-bold mb-1 opacity-70">{msg.sender.name}</p>}
                                    <p>{msg.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            {typingUser && (
                <div className="px-4 py-1 bg-gray-50/30">
                    <p className="text-[10px] text-gray-500 italic">{typingUser} is typing...</p>
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping(true);
                    }}
                    placeholder="Type your message..."
                    className="flex-1 input py-2 text-sm"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="btn-primary p-2 rounded-lg disabled:opacity-50"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default Chat;
