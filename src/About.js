import React from "react";
import Navigation from "./components/navbar";
import Footer from "./components/footer";

export default function About() {
  return (
    <div>
      <Navigation />
      <div class='container'>
        <div>
          <h1>About the Project</h1>
          <p>
            The goal of this project is to design and develop a web-based
            interactive visualization tool for novices to learn about AI or
            machine learning (ML). The tool will enable users to actively learn
            about AI on their web browsers without programming, specifically by
            uploading their datasets (e.g., a set of images), train ML models,
            visually analyze results, and test them. We plan to evaluate our
            tool by conducting human-subject studies with potential users who
            aspire to learn about AI. We also aim to open-source the tool, so
            that anyone can use our tool for their learning.
          </p>
        </div>
        <hr></hr>
      </div>

      <div class='container' style={{ flexDirection: "row" }}>
        <h2> Meet the Team!</h2>
        <br></br>
        <div>
          <img src='teampics/derek.png' alt='Derek' width='80%' />
          <h4>Junhyeok Jeong </h4>

          <img src='teampics/laura.png' alt='Laura' width='80%' />
          <h4> Laura Jiang</h4>

          <img src='teampics/owen.png' alt='Owen' width='80%' />
          <h4>Owen Markley</h4>

          <img src='teampics/thuyvy.png' alt='Thuy-Vy' width='80%' />
          <h4>Thuy-Vy Nguyen</h4>
        </div>
      </div>
      <Footer />
    </div>
  );
}
