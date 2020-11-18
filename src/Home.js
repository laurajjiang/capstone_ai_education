import React from "react";
import Navigation from "./components/navbar";
import SimpleFooter from "./components/footer";
import 'bootstrap/dist/css/bootstrap.min.css';



export default function Home() {
  return (
    <div>
      <Navigation />
      <div class="jumbotron text-center">
        <h1> Introduction</h1>
      </div>

      <div class = "container">
        <div>
          <p> This project aims to be an interactive visualization tool to teach beginners about artificial intelligence (AI) and machine learning (ML). This tool will allow users to interact and actively learn about complex computer science topics. Learning about artificial intelligence and machine learning can be difficult given that these topics are a complicated and niche sector of computer science. There lacks fun, interactive, informative education tools to teach beginners about AI and ML and so this interactive web application project aims to serve as an educational tool that will help novices become more acquainted with AI and ML. Users that will be included in testing this tool including students aspiring to learn about AI, students who have some background or experience with AI, and potentially faculty or industry professionals who are interested in AI visualization tools.</p>
        </div>
      </div>
      <SimpleFooter /> 
    </div>
  );
}