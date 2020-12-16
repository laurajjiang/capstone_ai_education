import React from "react";
import Navigation from "./components/navbar";
import Footer from "./components/footer";
import "./index.css";
import { Button, Icon, Intent } from "@blueprintjs/core";
import TextLoop from "react-text-loop";

export default function Home() {
  return (
    <>
      <div>
        <Navigation />
        <div style={{ backgroundColor: "#f5f8fa" }}>
          <div className='container'>
            <div style={{ padding: "3vh" }}>
              <br />
            </div>
            <div style={{ fontSize: "500%" }}>
              a new{" "}
              <TextLoop springConfig={{ stiffness: 210, damping: 45 }}>
                <span>hands-on, live</span>
                <span>programming</span>
                <span>introductory</span>
              </TextLoop>{" "}
              approach to teach machine learning
            </div>
            <div style={{ margin: "auto", fontSize: "large" }}>
              This project aims to be an interactive visualization tool to teach
              beginners about artificial intelligence (AI) and machine learning
              (ML). This tool will allow users to interact and actively learn
              about complex computer science topics. Learning about artificial
              intelligence and machine learning can be difficult given that
              these topics are a complicated and niche sector of computer
              science. There lacks fun, interactive, informative education tools
              to teach beginners about AI and ML and so this interactive web
              application project aims to serve as an educational tool that will
              help novices become more acquainted with AI and ML. Users that
              will be included in testing this tool including students aspiring
              to learn about AI, students who have some background or experience
              with AI, and potentially faculty or industry professionals who are
              interested in AI visualization tools.
            </div>
            <br />
            <Button
              className='bp3-large'
              intent={Intent.PRIMARY}
              icon='learning'
              text='Get Started'
              style={{ maxWidth: "50%", marginBottom: "5vh" }}
            />
          </div>
        </div>
        <hr style={{ marginTop: "0px" }} />
        <Footer />
      </div>
    </>
  );
}
