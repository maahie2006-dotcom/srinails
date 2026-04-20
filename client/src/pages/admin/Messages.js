import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"; 
import "./Messages.css"; 

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('ppn_token');
      // Updated to plural '/api/contacts' - check your backend route!
      const { data } = await axios.get('http://localhost:5000/api/contacts', {
    headers: { Authorization: `Bearer ${token}` }
});

      // Safety check for data format
      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data && Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      // Fallback: Try singular if plural fails
      try {
        const token = localStorage.getItem('ppn_token');
        const res = await axios.get("/api/contact", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (innerErr) {
        toast.error("Could not load inquiries");
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = async (id) => {
    if (!replyText[id]) return toast.error("Please write a response first");

    setLoading(true);
    try {
      const token = localStorage.getItem('ppn_token');
      await axios.put(`/api/contacts/reply/${id}`, {
        reply: replyText[id],
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Reply sent to customer ✅");
      setReplyText({ ...replyText, [id]: "" });
      fetchMessages();
    } catch (err) {
      toast.error("Error sending reply");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading-center">💅 Checking Inbox...</div>;

  return (
    <div className="msg-admin-wrapper">
      <div className="container">
        <header className="msg-admin-header">
          <h1>Customer Inbox</h1>
          <p>Manage inquiries and provide luxury support for SriNails</p>
        </header>

        {!messages || messages.length === 0 ? (
          <div className="empty-messages">
            <span className="emoji">✉️</span>
            <p>Your inbox is currently empty</p>
            <button onClick={fetchMessages} className="btn-secondary" style={{marginTop: '10px'}}>Refresh</button>
          </div>
        ) : (
          <div className="luxe-message-list">
            {messages.map((msg) => (
              <div key={msg._id} className="luxe-message-card">
                
                <div className="luxe-card-header">
                  <div className="user-meta">
                    <div className="user-avatar">{msg.name ? msg.name.charAt(0) : "?"}</div>
                    <div>
                      <h3>{msg.name}</h3>
                      <span className="user-email">{msg.email}</span>
                    </div>
                  </div>
                  <span className="luxe-date">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "Just now"}
                  </span>
                </div>

                <div className="luxe-card-body">
                  <p className="customer-msg">“{msg.message}”</p>
                </div>

                <div className="luxe-card-footer">
                  {msg.reply ? (
                    <div className="luxe-reply-box">
                      <span className="reply-label">Your Response</span>
                      <p>{msg.reply}</p>
                    </div>
                  ) : (
                    <div className="luxe-reply-action">
                      <textarea
                        placeholder="Type your professional reply here..."
                        value={replyText[msg._id] || ""}
                        onChange={(e) =>
                          setReplyText({
                            ...replyText,
                            [msg._id]: e.target.value,
                          })
                        }
                      />
                      <button
                        className="btn-luxe-send"
                        onClick={() => handleReply(msg._id)}
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;