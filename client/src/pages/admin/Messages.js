import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);

  // 📥 Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/contact");
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 📤 Send reply
  const handleReply = async (id) => {
    if (!replyText[id]) return alert("Write reply first!");

    setLoading(true);
    try {
      await axios.put(`/api/contact/reply/${id}`, {
  reply: replyText[id],
});

      alert("Reply sent ✅");
      setReplyText({ ...replyText, [id]: "" });
      fetchMessages(); // refresh
    } catch (err) {
      console.log(err);
      alert("Error sending reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Customer Messages 💬</h1>

      {messages.length === 0 ? (
        <p>No messages yet</p>
      ) : (
        <div className="message-list">
          {messages.map((msg) => (
            <div key={msg._id} className="message-card">

              {/* User Info */}
              <div className="message-header">
                <h3>{msg.name}</h3>
                <span>{msg.email}</span>
              </div>

              {/* Message */}
              <p className="message-text">{msg.message}</p>

              {/* Date */}
              <small className="message-date">
                {new Date(msg.createdAt).toLocaleString()}
              </small>

              {/* Reply Section */}
              <div className="reply-section">

                {msg.reply ? (
                  <div className="reply-box">
                    <strong>Admin Reply:</strong>
                    <p>{msg.reply}</p>
                  </div>
                ) : (
                  <>
                    <textarea
                      placeholder="Write your reply..."
                      value={replyText[msg._id] || ""}
                      onChange={(e) =>
                        setReplyText({
                          ...replyText,
                          [msg._id]: e.target.value,
                        })
                      }
                      className="reply-input"
                    />

                    <button
                      className="reply-btn"
                      onClick={() => handleReply(msg._id)}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reply"}
                    </button>
                  </>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;