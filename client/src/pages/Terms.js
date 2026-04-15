import React from "react";

function Terms() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Terms of Service</h1>

      <p style={styles.text}>
        Welcome to SriNails! By using our website, you agree to the following terms and conditions.
      </p>

      <h3 style={styles.subheading}>Orders</h3>
      <p style={styles.text}>
        All press-on nail sets are handmade and made to order. Slight variations may occur.
      </p>

      <h3 style={styles.subheading}>Payments</h3>
      <p style={styles.text}>
        Full payment is required before order processing.
      </p>

      <h3 style={styles.subheading}>Returns & Exchanges</h3>
      <p style={styles.text}>
        Due to hygiene reasons, we do not accept returns. Exchanges are only allowed for damaged items.
      </p>

      <h3 style={styles.subheading}>Shipping</h3>
      <p style={styles.text}>
        Orders are processed within 3–5 business days. Delivery times may vary based on location.
      </p>

      <h3 style={styles.subheading}>Contact</h3>
      <p style={styles.text}>
        For any issues, contact us at:
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

export default Terms;