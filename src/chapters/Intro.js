import React from "react";
import Navigation from "../components/navbar";
import Footer from "../components/footer";
import Container from "../components/container";
import Description from "../components/description";
import { Callout } from "@blueprintjs/core";
import Spacer from "../components/spacer";
import {
  Alignment,
  Classes,
  H3,
  H5,
  InputGroup,
  Navbar,
  Switch,
  Tab,
  TabId,
  Tabs,
} from "@blueprintjs/core";

const text = (
  <>
    Artificial intelligence is the science and engineering of making machines
    behave or think rationally or for the machines to act or think like humans.
  </>
);

const PrefacePanel = () => (
  <div>
    <H3>Preface</H3>
    <p className={Classes.RUNNING_TEXT}>
      Lots of people use React as the V in MVC. Since React makes no assumptions
      about the rest of your technology stack, it's easy to try it out on a
      small feature in an existing project.
    </p>
  </div>
);

const AngularPanel = () => (
  <div>
    <H3>Example panel: Angular</H3>
    <p className={Classes.RUNNING_TEXT}>
      HTML is great for declaring static documents, but it falters when we try
      to use it for declaring dynamic views in web-applications. AngularJS lets
      you extend HTML vocabulary for your application. The resulting environment
      is extraordinarily expressive, readable, and quick to develop.
    </p>
  </div>
);

const EmberPanel = () => (
  <div>
    <H3>Example panel: Ember</H3>
    <p className={Classes.RUNNING_TEXT}>
      Ember.js is an open-source JavaScript application framework, based on the
      model-view-controller (MVC) pattern. It allows developers to create
      scalable single-page web applications by incorporating common idioms and
      best practices into the framework. What is your favorite JS framework?
    </p>
    <input className={Classes.INPUT} type='text' />
  </div>
);

const introContent = (
  <>
    <div style={{ fontSize: "500%" }}>chapter 0 - introduction</div>
    <Spacer space='3vh' />
    <Description content={text} />
    <Spacer space='1vh' />
    <Callout intent={"primary"} title={"Getting familiar with terminology"}>
      In computer science and AI/ML especially, there is a lot of specialized
      terminology. Each chapter will explain every new term or concept
      introduced, and there will also be additional resources provided to help
      you dive a bit deeper if necessary.
    </Callout>
    <Spacer space='1vh' />
    <Tabs
      animate={true}
      id='sidebar'
      renderActiveTabPanelOnly={false}
      vertical={true}>
      <Tab id='pf' title='Preface' panel={<PrefacePanel />} />
      <Tab id='ng' title='Angular' panel={<AngularPanel />} />
      <Tab
        id='mb'
        title='Ember'
        panel={<EmberPanel />}
        panelClassName='ember-panel'
      />
    </Tabs>
  </>
);

export default function Introduction() {
  return (
    <div>
      <Navigation />
      <Container content={introContent} />

      <hr style={{ marginTop: "0px" }} />
      <Footer />
    </div>
  );
}
