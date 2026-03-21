import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { getTaskMessages } from '../../services/chatService';

const ChatBox = ({ taskId, taskTitle, currentUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 1. Fetch old messages from the database
    const fetchHistory = async () => {
      try {
        const response = await getTaskMessages(taskId);
        setMessages(response.data ||[]);
      } catch (error) {
        console.error('Failed to fetch messages');
      }
    };
    fetchHistory();

    // 2. Connect to the Backend Socket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Join this specific task's private room
    newSocket.emit('join_task_chat', taskId);

    // 3. Listen for incoming messages in real-time
    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup: Disconnect when the chat window is closed
    return () => {
      newSocket.off('receive_message');
      newSocket.disconnect();
    };
  }, [taskId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !socket) return;

    const messageData = {
      text: newMessage,
      taskId: taskId,
      senderId: currentUser.id
    };

    // Send the message to the backend via socket
    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-[100] overflow-hidden animate-slide-up">
      
      {/* Chat Header */}
      <div className="bg-indigo-600 px-4 py-3 flex justify-between items-center text-white">
        <div>
          <h3 className="font-bold text-sm leading-tight">Live Coordination</h3>
          <p className="text-xs text-indigo-200 truncate w-48">{taskTitle}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:text-rose-200 transition-colors focus:outline-none bg-indigo-700/50 hover:bg-indigo-700 p-1.5 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 h-80 overflow-y-auto bg-slate-50 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 text-xs my-auto font-medium">
            This is a secure coordination channel. Send a message to coordinate relief details.
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && (
                  <span className="text-[10px] font-bold text-slate-400 ml-1 mb-0.5">
                    {msg.sender?.name} ({msg.sender?.role})
                  </span>
                )}
                <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                  isMe 
                    ? 'bg-indigo-600 text-white rounded-br-sm' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 mx-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <input
            type="text"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 pr-12"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className={`absolute right-1.5 top-1.5 bottom-1.5 w-8 flex items-center justify-center rounded-full transition-colors ${
              newMessage.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400'
            }`}
          >
            <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;