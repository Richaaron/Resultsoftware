import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { Send, MessageCircle, X, Clock, User } from "lucide-react";

const AdminTeacherChat = ({ onClose }) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);

  // Fetch teachers on mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Fetch messages when teacher is selected
  useEffect(() => {
    if (selectedTeacher) {
      fetchMessages();
    }
  }, [selectedTeacher]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/messages/teacher/${selectedTeacher.id}`);
      setMessages(res.data.rows || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTeacher || !subject.trim()) return;

    try {
      await api.post("/messages/send", {
        recipientId: selectedTeacher.id,
        subject,
        content: newMessage,
        messageType: "GENERAL",
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
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

  return (
    <div className="fixed inset-0 bg-brand-950/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-brand-700/50 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-brand-900 bg-brand-800">
          <div className="flex items-center gap-3">
            <MessageCircle size={28} className="text-accent-gold" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
              Teacher Chat
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-700 rounded-lg text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Teachers List */}
          <div className="w-64 border-r-4 border-brand-900 bg-brand-50 overflow-y-auto">
            <div className="p-4 space-y-2">
              {teachers.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No teachers found
                </p>
              ) : (
                teachers.map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => setSelectedTeacher(teacher)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedTeacher?.id === teacher.id
                        ? "bg-accent-gold border-brand-900 shadow-md"
                        : "bg-white border-gray-300 hover:border-brand-900"
                    }`}
                  >
                    <p className="font-bold text-sm uppercase tracking-tight">
                      {teacher.fullName}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {teacher.email || "No email"}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedTeacher ? (
              <>
                {/* Selected Teacher Info */}
                <div className="p-6 border-b-4 border-brand-900 bg-brand-100">
                  <h3 className="text-lg font-bold text-black uppercase tracking-tight">
                    {selectedTeacher.fullName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    📧 {selectedTeacher.email || "No email"}
                  </p>
                  {selectedTeacher.assignedClass && (
                    <p className="text-sm text-gray-600">
                      📚 Class: {selectedTeacher.assignedClass}
                    </p>
                  )}
                </div>

                {/* Messages */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4 bg-white"
                >
                  {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No messages yet. Start a conversation!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === JSON.parse(localStorage.getItem("user")).id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-sm px-6 py-4 rounded-lg border-2 ${
                            msg.senderId === JSON.parse(localStorage.getItem("user")).id
                              ? "bg-accent-gold border-brand-900"
                              : `bg-brand-100 border-gray-300 ${!msg.isRead ? "border-accent-red border-4" : ""}`
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <User size={16} />
                            <p className="text-xs font-bold text-gray-600 uppercase">
                              {msg.subject}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-800 break-words">
                            {msg.content}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Clock size={12} />
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          {!msg.isRead &&
                            msg.recipientId === JSON.parse(localStorage.getItem("user")).id && (
                              <button
                                onClick={() => markAsRead(msg.id)}
                                className="mt-2 text-xs font-bold text-accent-red hover:text-black transition"
                              >
                                Mark as Read
                              </button>
                            )}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-6 border-t-4 border-brand-900 bg-brand-50"
                >
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Message subject..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-brand-900 outline-none font-medium"
                    />
                    <div className="flex gap-3">
                      <textarea
                        placeholder="Type your message here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows="3"
                        className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-brand-900 outline-none font-medium resize-none"
                      />
                      <button
                        type="submit"
                        className="bg-accent-gold border border-brand-700/50 px-6 py-3 rounded-lg font-bold hover:bg-brand-950 hover:text-accent-gold transition shadow-md hover:-translate-y-1"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p className="font-bold text-lg uppercase tracking-tight">
                  Select a teacher to start chatting 👈
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeacherChat;
