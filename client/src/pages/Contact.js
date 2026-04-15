import React from "react";
import axios from "axios";

function Contact() {

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };

    try {
      await axios.post("http://localhost:5000/api/contact", data);
      alert("Message sent successfully! 💅");
      e.target.reset();
    } catch (error) {
      alert("Error sending message ❌");
      console.log(error);
    }
  };

  return (
    <div style={styles.container}>
      
      <h1 style={styles.heading}>💅 Contact Us</h1>

      <div style={styles.box}>

        {/* LEFT SIDE */}
        <div style={styles.left}>
          <h2>Contact Information</h2>

          <p>
            📧 <a href="mailto:nailnrutya@gmail.com">
              nailnrutya@gmail.com
            </a>
          </p>

          <p>
            📸 <a 
              href="https://instagram.com/nailnrutya" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              @nailnrutya
            </a>
          </p>

          <p>🕐 Mon–Fri, 9am–5pm</p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div style={styles.right}>
          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              style={styles.input}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              style={styles.input}
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              style={styles.input}
            />

            <textarea
              name="message"
              placeholder="Your Message"
              required
              style={styles.textarea}
            />

            <button type="submit" style={styles.button}>
              Send Message 💅
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "50px",
    fontFamily: "Arial"
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px"
  },
  box: {
    display: "flex",
    gap: "40px",
    justifyContent: "center"
  },
  left: {
    width: "40%"
  },
  right: {
    width: "60%"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "15px"
  },
  button: {
    background: "#ff69b4",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default Contact;
