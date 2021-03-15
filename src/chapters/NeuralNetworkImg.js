import React from "react";
import Navigation from "../components/navbar";
import Description from "../components/description";
import { Callout, Button, Intent } from "@blueprintjs/core";
import { CopyBlock, nord, a11yLight } from "react-code-blocks";
import Spacer from "../components/spacer";
import ConfusionMatrix from "../components/confusionMatrix";
import Container from "../components/container";
import "../index.css";

export default function NeuralNetworkImg() {
  return (
    <div>
      <Navigation />
      <div className='container'>
        <Container content={"NeuralNetworkImg"} />
      </div>
    </div>
  );
}
