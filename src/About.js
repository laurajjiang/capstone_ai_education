import React from "react";
import Navigation from "./components/navbar";
import Footer from "./components/footer";
import Description from "./components/description";
import Spacer from "./components/spacer";
import Container from "./components/container";

/** About page describing team members and purpose of this site/project. */

const aboutParagraph = (
  <>
    The goal of this project is to design and develop a web-based interactive
    visualization tool for novices to learn about AI or machine learning (ML).
    The tool will enable users to actively learn about AI on their web browsers
    without programming, specifically by uploading their datasets (e.g., a set
    of images), train ML models, visually analyze results, and test them. We
    plan to evaluate our tool by conducting human-subject studies with potential
    users who aspire to learn about AI. We also aim to open-source the tool, so
    that anyone can use our tool for their learning.
  </>
);

const aboutContent = (
  <>
    <Spacer space={"3vh"} />
    <div>
      <div style={{ fontSize: "500%" }}>about the project</div>
      <Spacer space={"3vh"} />
      <Description content={aboutParagraph} />
    </div>
  </>
);

export default function About() {
  return (
    <>
      <Navigation />
      <div style={{ backgroundColor: "#f5f8fa" }}>
        <Container height='75vh' content={aboutContent} />
      </div>
      <hr style={{ marginTop: "0px" }} />
      <Footer />
    </>
  );
}
