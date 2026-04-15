import React from "react";

function Privacy() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Privacy Policy</h1>

      <p style={styles.text}>
        At SriNails, we value your privacy and are committed to protecting your personal information.
      </p>

      <h3 style={styles.subheading}>Information We Collect</h3>
      <p style={styles.text}>
        We collect your name, email, shipping address, and contact details when you place an order or contact us.
      </p>

      <h3 style={styles.subheading}>How We Use Your Information</h3>
      <p style={styles.text}>
        Your information is used to process orders, provide customer support, and improve your shopping experience.
      </p>

      <h3 style={styles.subheading}>Data Protection</h3>
      <p style={styles.text}>
        Your data is securely stored and never sold or shared with third parties.
      </p>

      <h3 style={styles.subheading}>Contact Us</h3>
      <p style={styles.text}>
        If you have any questions, contact us at:
      </p>

      <p style={styles.link}>
        📧 <a href="mailto:nailnrutya@gmail.com">nailnrutya@gmail.com</a>
      </p>
    </div>
  );
}

const styles = {
  container: {
    padding: "50px",
    maxWidth: "900px",
    margin: "auto",
    fontFamily: "Arial"
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px"
  },
  subheading: {
    marginTop: "20px",
    color: "#ff69b4"
  },
  text: {
    lineHeight: "1.6",
    marginTop: "10px"
  },
  link: {
    marginTop: "10px",
    fontWeight: "bold"
  }
};

export default Privacy;