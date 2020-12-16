import React from "react";

function Footer() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}>
      <div>
        <img src='/logo.png' alt='logo' width='20%' />
        <div class='.bp3-text-muted'>
          Capstone (CS461) - Group 21 <br></br> Oregon State University
        </div>
      </div>

      <div class='.bp3-text-muted'>
        Advisor: <a href='https://minsuk.com/'>Dr. Minsuk Kahng </a>
      </div>
    </div>
  );
}

export default Footer;
