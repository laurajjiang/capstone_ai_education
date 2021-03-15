import React from "react";
import Navigation from "../components/navbar";
import Description from "../components/description";
import { Callout, Button, Intent } from "@blueprintjs/core";
import { CopyBlock, nord, a11yLight } from "react-code-blocks";
import Spacer from "../components/spacer";
import ConfusionMatrix from "../components/confusionMatrix";
import Container from "../components/container";
import "../index.css";

const importCode = ``;

const peekData = ``;

const naiveBayesCode = ``;

const training = ``;

const buttonGroup = (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <Button
      className='bp3-large'
      intent={Intent.PRIMARY}
      text='View on GitHub'
      style={{ maxWidth: "50%", margin: "1em" }}
    />
    <Button
      className='bp3-large'
      intent={Intent.PRIMARY}
      text='Download notebook'
      style={{ maxWidth: "50%", margin: "1em" }}
    />
    <Button
      className='bp3-large'
      intent={Intent.PRIMARY}
      text='View in Google Colab'
      style={{ maxWidth: "50%", margin: "1em" }}
    />
  </div>
);

const pretext = (
  <>
    Text classification is the process of assigning tags or categories to text
    according to its content. It’s one of the fundamental tasks in natural
    language processing.
  </>
);

const setUp = (
  <>
    Let's move to creating our own model for sentiment classification. This page
    will walk you through three different models.
    <Spacer space='1vh' />
    <h1>Set up data and imports</h1>
    This section of code is to import any necessary Python libraries that we'll
    need for the rest of this notebook. Some packages may need to be installed
    since they are not built in to Python 3:
    <Spacer space='1vh' />
    <CopyBlock
      text={importCode}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
  </>
);

const visualization = (
  <>
    <Spacer space='1vh' />
    We also can visualize the results of our model using a confusion matrix. A
    confusion matrix helps us see which results are accurately classified and
    which are mis-classified, as well as how confident the model is in its
    classifications. The one below is interactive, so you can click on each
    block to see what data falls where.
    <Spacer space='1vh' />
  </>
);

const introContent = (
  <>
    <Spacer space='1vh' />
    <div className='title'>chapter 1 - logistic regression</div>
    {buttonGroup}
    <Spacer space='1vh' />
    <Description content={pretext} />
    <Description content={setUp} />
    <ConfusionMatrix />
    <Spacer space='1vh' />
    <div>
      <Button
        className='bp3-large'
        intent={Intent.PRIMARY}
        icon='arrow-left'
        text='Previous chapter'
        style={{ maxWidth: "50%", margin: "5vh" }}
        onClick={(e) => (window.location.href = "/chapter0")}
      />
      <Button
        className='bp3-large'
        intent={Intent.PRIMARY}
        icon='arrow-right'
        text='Next chapter'
        style={{ maxWidth: "50%", margin: "5vh" }}
        onClick={(e) => (window.location.href = "/chapter2")}
      />
    </div>
  </>
);

export default function LogisticRegression() {
  return (
    <div>
      <Navigation />
      <div className='container'>
        <Container content={introContent} />
      </div>
    </div>
  );
}
