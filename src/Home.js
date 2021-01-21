import React from "react";
import Navigation from "./components/navbar";
import Footer from "./components/footer";
import "./index.css";
import { Button, Intent } from "@blueprintjs/core";
import TextLoop from "react-text-loop";
import Description from "./components/description";
import Spacer from "./components/spacer";
import Container from "./components/container";

const goal = (
  <>
    This project aims to be an interactive visualization tool to teach beginners
    about artificial intelligence (AI) and machine learning (ML). This tool will
    allow users to interact and actively learn about AI and ML. Learning about
    these topics can be difficult given that these are a complicated and niche
    sector of computer science.
  </>
);

const use = (
  <>
    This interactive web application project will serve as an educational tool
    that will help novices become more acquainted with AI and ML. Users that
    will be included in testing this tool including students aspiring to learn
    about AI, students who have some background or experience with AI, and
    potentially faculty or industry professionals who are interested in AI
    visualization tools.
  </>
);

const homeContent = (
  <>
    <Spacer space={"3vh"} />
    <div style={{ fontSize: "500%" }}>
      a new{" "}
      <TextLoop springConfig={{ stiffness: 210, damping: 45 }}>
        <span>interactive</span>
        <span>programming</span>
        <span>introductory</span>
      </TextLoop>{" "}
      approach to teach machine learning
    </div>
    <Description content={goal} />
    <Description content={use} />
    <br />
    <Button
      className='bp3-large'
      intent={Intent.PRIMARY}
      icon='learning'
      text='Get Started'
      style={{ maxWidth: "50%", marginBottom: "5vh" }}
      onClick={(e) => (window.location.href = "/chapter0")}
    />
  </>
);

export default function Home() {
  return (
    <>
      <div>
        <Navigation />
        <div style={{ backgroundColor: "#f5f8fa" }}>
          <Container height='75vh' content={homeContent} />
        </div>
        <hr style={{ marginTop: "0px" }} />
        <Footer />
      </div>
    </>
  );
}
