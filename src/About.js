import React from "react";
import Navigation from "./components/navbar";
import SimpleFooter from "./components/footer";


export default function About() {
  return (
    <div>
      <Navigation />
      
      <div class="jumbotron text-center">
        <h1>About the Project</h1>
      </div>

      <div class = "container">
        <div>
          <p> The goal of this project is to design and develop a web-based interactive visualization tool for novices to learn about AI or machine learning (ML). The tool will enable users to actively learn about AI on their web browsers without programming, specifically by uploading their datasets (e.g., a set of images), train ML models, visually analyze results, and test them. We plan to evaluate our tool by conducting human-subject studies with potential users who aspire to learn about AI. We also aim to open-source the tool, so that anyone can use our tool for their learning.</p>
        </div>
        <hr></hr>

      </div>

      <div class ="container">
        <h2 class ="text-center"> Meet the Team!</h2>
        <br></br>
        <div class="row text-center">
        <div class="col-sm-3">
          <img src="teampics/derek.png" alt="Derek" width="80%"/>
           <h4>Junhyeok Jeong </h4>

          </div>

          <div class="col-sm-3">
             <img src="teampics/laura.png" alt="Derek" width="80%"/>
            <h4> Laura Jiang</h4>
          </div>

          <div class="col-sm-3">
          <img src="teampics/owen.png" alt="Derek" width="80%"/>
           <h4>Owen Markley</h4>
          </div>

          <div class="col-sm-3">
            <img src="teampics/thuyvy.png" alt="Derek" width="80%"/>
            <h4>Thuy-Vy Nguyen</h4>
          </div>

        </div>

      </div>
      <SimpleFooter /> 
    </div>
  );
}