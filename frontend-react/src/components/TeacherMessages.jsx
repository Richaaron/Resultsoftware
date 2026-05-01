import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { MessageCircle, X, Clock, User } from "lucide-react";

const TeacherMessages = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/messages/teacher/${user.id}`);
      setMessages(res.data.rows || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await api.put(`/messages/${messageId}/read`);
      fetchMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead && m.recipientId === user.id).length;

  return (
    <div className="fixed inset-0 bg-brand-950/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-brand-700/50 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-brand-900 bg-brand-800">
          <div className="flex items-center gap-3">
            <MessageCircle size={28} className="text-accent-gold" />
            <div>
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                My Messages 💬
              </h2>
              {unreadCount > 0 && (
                <p className="text-sm text-accent-gold font-bold">
                  {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-700 rounded-lg text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-bold text-lg uppercase">No messages yet</p>
              <p className="text-sm mt-2">Check back later for updates from admin</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isFromAdmin = msg.senderId !== user.id;
              const isUnread = !msg.isRead && isFromAdmin;

              return (
                <div
                  key={msg.id}
                  className={`p-5 rounded-lg border-4 ${
                    isUnread
                      ? "bg-yellow-50 border-accent-gold shadow-md"
                      : "bg-brand-50 border-gray-300"
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-600" />
                      <p className="font-bold text-sm text-gray-700 uppercase">
                        {msg.sender?.fullName || "Admin"}
                      </p>
                      {isUnread && (
                        <span className="bg-accent-gold text-black px-2 py-1 rounded-lg text-xs font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={14} />
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Subject */}
                  <p className="font-bold text-sm text-gray-700 uppercase tracking-tight mb-2 bg-white px-3 py-2 rounded-lg border-2 border-gray-300">
                    {msg.subject}
                  </p>

                  {/* Content */}
                  <p className="text-gray-800 leading-relaxed mt-3 whitespace-pre-wrap">
                    {msg.content}
                  </p>

                  {/* Mark as Read Button */}
                  {isUnread && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="mt-4 px-4 py-2 bg-accent-gold border border-brand-700/50 rounded-lg font-bold text-xs uppercase hover:bg-brand-950 hover:text-accent-gold transition"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default TeacherMessages;
