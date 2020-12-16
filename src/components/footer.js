import React from "react";

function Footer() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      }}>
      <div class='.bp3-text-muted'>
        Advisor: <a href='https://minsuk.com/'>Dr. Minsuk Kahng </a>
      </div>
      <div class='.bp3-text-muted'>
        Written by Group 21: <br></br> Laura Jiang, Thuy-Vy Nguyen, <br></br>
        Owen Taylor Markley, Junhyeok Jeong
      </div>
      <div class='.bp3-text-muted'>
        Oregon State University, <br></br> Corvallis, OR, USA
      </div>
    </div>
  );
}

export default Footer;
