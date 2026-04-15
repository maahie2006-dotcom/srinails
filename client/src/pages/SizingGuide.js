import React from "react";

function SizingGuide() {
  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",   // ✅ centers content
      padding: "20px",
      textAlign: "center"
    }}>
      <h1>Sizing Guide</h1>

      <img 
        src="https://i.pinimg.com/1200x/9d/d0/b7/9dd0b77d683b4a398b1820118bd93655.jpg"
        alt="Size Guide"
        style={{
          width: "100%",       // ✅ full responsive
          maxWidth: "900px",   // ✅ control size
          height: "auto",
          display: "block",
          margin: "20px auto", // ✅ center image
          borderRadius: "10px"
        }}
      />
    </div>
  );
}

export default SizingGuide;