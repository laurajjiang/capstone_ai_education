import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Navigation from "../components/navbar";
import Footer from "../components/footer";
import Container from "../components/container";
import Description from "../components/description";
import { Callout } from "@blueprintjs/core";
import Spacer from "../components/spacer";

import IframeResizer from "iframe-resizer-react";
import ReactIframeResizer from "react-iframe-resizer-super";

const text = (
  <>
    Artificial intelligence is the science and engineering of making machines
    behave or think rationally or for the machines to act or think like humans.
  </>
);

const introContent = (
  <>
    <Spacer space='1vh' />
    <div style={{ fontSize: "500%" }}>chapter 0 - introduction</div>
    <Spacer space='1vh' />
    <Description content={text} />
    <Spacer space='1vh' />
    <Callout intent={"primary"} title={"Getting familiar with terminology"}>
      In computer science and AI/ML especially, there is a lot of specialized
      terminology. Each chapter will explain every new term or concept
      introduced, and there will also be additional resources provided to help
      you dive a bit deeper if necessary.
    </Callout>
  </>
);

export default function Introduction() {
  useEffect(() => {
    console.log(window.innerHeight);
  }, []);

  return (
    <div>
      <Navigation />

      <div style={{ height: "70vh" }}>
        <object
          data='https://laurajjiang.github.io/capstone-notebooks/2021/01/10/Text-Classification.html'
          width='100%'
          height='115%'
          style={{ top: "-12.5%", position: "relative" }}
        />
      </div>

      <Spacer space='-1vh' />
      <hr style={{ marginTop: "0px" }} />
      <Footer />
    </div>
  );
}
