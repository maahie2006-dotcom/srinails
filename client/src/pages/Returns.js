import React from "react";

function Returns() {
  return (
    <div style={{
      maxWidth: "900px",
      margin: "auto",
      padding: "40px 20px",
      lineHeight: "2.0",
      color: "#333"
    }}>

      {/* Title */}
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Refund and Returns Policy
      </h1>

      {/* Return Policy */}
      <section style={{ marginBottom: "25px" }}>
        <h3>Return Policy</h3>
        <p>
          We do not accept returns or refunds on any products sold from our website due to hygiene reasons.
        </p>
        <p>
          For any queries regarding your order, please contact us directly via email or WhatsApp.
        </p>
        <p><strong>Email:</strong> hello@prettypressnails.com</p>
        <p><strong>WhatsApp:</strong> +91 XXXXX XXXXX</p>
      </section>

      {/* Delay in Delivery */}
      <section style={{ marginBottom: "25px" }}>
        <h3>Delay in Delivery</h3>
        <p>
          If you experience any delay in delivery, please contact us through our registered email or WhatsApp number.
        </p>
      </section>

      {/* Exchanges */}
      <section style={{ marginBottom: "25px" }}>
        <h3>Exchanges</h3>
        <p>
          We only replace items if they are defective or damaged.
        </p>
        <p>
          An unboxing video is required as proof to process any exchange request.
        </p>
        <p>
          To request an exchange for the same item, please email us at:
        </p>
        <p><strong>Email:</strong> hello@prettypressnails.com</p>
      </section>

      {/* Refund for Not Deliverable */}
      <section style={{ marginBottom: "25px" }}>
        <h3>Refund on Not Deliverable Items</h3>
        <p>
          If your product cannot be delivered to your address, please contact us for assistance.
        </p>
        <p><strong>Email:</strong> hello@prettypressnails.com</p>
        <p><strong>WhatsApp:</strong> +91 XXXXX XXXXX</p>
      </section>

      {/* Need Help */}
      <section>
        <h3>Need Help?</h3>
        <p>
          Contact us at <strong>hello@prettypressnails.com</strong> for any questions related to refunds and returns.
        </p>
      </section>

    </div>
  );
}

export default Returns;