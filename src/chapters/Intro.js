import React from "react";
import Navigation from "../components/navbar";
import Description from "../components/description";
import { Callout, Button, Intent } from "@blueprintjs/core";
import Spacer from "../components/spacer";
import Container from "../components/container";
import "../index.css";

/** This component is the introduction chapter on the website. */

const pretext = (
  <>
    <Spacer space='1vh' />
    To view and modify any code snippets shown on the site, please go to the
    <a href='https://github.com/laurajjiang/capstone_ai_education'>
      {" "}
      repository{" "}
    </a>{" "}
    and follow the README and user guide for how to properly set up your machine
    and install any necessary packages.
    <Spacer space='1vh' />
    Artificial intelligence is the science and engineering of making machines
    behave or think rationally or for the machines to act or think like humans.
    <Spacer space='1vh' />
  </>
);

const introAI = (
  <>
    Let's briefly go over some of the ideas motivating the use of artificial
    intelligence. Mouseover any concept for a more in-depth explanation.
    <Spacer space='1vh' />
  </>
);

const approaches = (
  <>
    There are 4 approaches to AI:
    <ul>
      <li>Thinking humanly</li>
      <li>Thinking rationally</li>
      <li>Acting humanly</li>
      <li>Acting rationally</li>
    </ul>
  </>
);

const goals = (
  <>
    Goals of AI:
    <ul>
      <li>Reasoning</li>
      <li>Learning</li>
      <li>Perception</li>
      <li>Natural language processing </li>
    </ul>
  </>
);

const applications = (
  <>
    <Spacer space='1vh' />
    <b>Real life applications:</b> detecting credit card fraud, search engines,
    spam filtering, medical diagnosis, face detection, and opponents in video
    games.
    <Spacer space='1vh' />
    How do computers do this? The ways to accomplish this primarily involve
    using statistics and probability.
    <Spacer space='1vh' />
    <b>Machine learning</b> is a subset of artificial intelligence. It is the
    study of computer algorithms that provides the system the ability to learn
    through experience. That is, artificial intelligence is the more general
    topic where machine learning is one of the more specialized topics within
    it.
    <Spacer space='1vh' />
  </>
);

const introContent = (
  <>
    <Spacer space='1vh' />
    <div className='title'>chapter 0 - introduction</div>
    <Description content={pretext} />
    <Callout intent={"primary"} title={"Getting familiar with terminology"}>
      In computer science and AI/ML especially, there is a lot of specialized
      terminology. Each chapter will explain every new term or concept
      introduced, and there will also be additional resources provided to help
      you dive a bit deeper if necessary.
    </Callout>
    <Spacer space='1vh' />
    <Description content={introAI} />
    <div className='flex-row-space'>
      <Description content={approaches} />
      <Spacer space='4vh' />
      <Description content={goals} />
    </div>
    <Description content={applications} />
    <Button
      className='bp3-large'
      intent={Intent.PRIMARY}
      icon='arrow-right'
      text='Next chapter'
      style={{ maxWidth: "50%", marginBottom: "5vh" }}
      onClick={(e) => (window.location.href = "/chapter1")}
    />
  </>
);

export default function Introduction() {
  return (
    <div>
      <Navigation />
      <div className='container'>
        <Container content={introContent} />
      </div>
    </div>
  );
}
