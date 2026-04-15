import React, { useState } from "react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How long do press-on nails last?",
      answer:
        "Our luxury press-on nails last up to 2–3 weeks with proper application and care. Using nail glue provides longer wear than adhesive tabs."
    },
    {
      question: "Can I reuse the nails?",
      answer:
        "Yes! Our nails are reusable. Gently remove them and clean off the glue to use again."
    },
    {
      question: "How do I choose my size?",
      answer:
        "We provide a sizing guide to help you find the perfect fit. You can also order custom sizes for a flawless look."
    },
    {
      question: "How long does shipping take?",
      answer:
        "Orders are processed within 1–2 days and delivered within 3–7 working days across India."
    },
    {
      question: "Do you offer custom nail designs?",
      answer:
        "Yes! We create custom press-on nail sets based on your preferences. Contact us via Instagram or WhatsApp."
    }
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>💅 Frequently Asked Questions</h1>
      <p style={styles.subheading}>
        Everything you need to know about our luxury press-on nails
      </p>

      <div style={styles.faqBox}>
        {faqs.map((item, index) => (
          <div key={index} style={styles.card}>
            
            <div style={styles.question} onClick={() => toggle(index)}>
              <span>{item.question}</span>
              <span style={styles.icon}>
                {openIndex === index ? "−" : "+"}
              </span>
            </div>

            {openIndex === index && (
              <div style={styles.answer}>{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "50px 20px",
    maxWidth: "800px",
    margin: "auto",
    fontFamily: "Arial, sans-serif"
  },
  heading: {
    textAlign: "center",
    fontSize: "32px",
    marginBottom: "10px"
  },
  subheading: {
    textAlign: "center",
    color: "#777",
    marginBottom: "30px"
  },
  faqBox: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  card: {
    border: "1px solid #eee",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    background: "#fff"
  },
  question: {
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px"
  },
  answer: {
    marginTop: "10px",
    color: "#555",
    lineHeight: "1.6"
  },
  icon: {
    fontSize: "20px",
    color: "#ff69b4"
  }
};

export default FAQ;