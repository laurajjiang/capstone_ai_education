import React from "react";
import Navigation from "./components/navbar";
import SimpleFooter from "./components/footer";
import { Button, Classes, NonIdealState } from "@blueprintjs/core";

const description = (
  <>
    You've landed on a page that doesn't exist.
    <br />
    <br />
    <Button
      className='bp3-minimal'
      icon='home'
      text='Go to Home'
      intent='warning'
      onClick={(e) => (window.location.href = "/")}
    />
  </>
);

export default function error() {
  return (
    <div>
      <Navigation style={{}} />
      <div style={{ backgroundColor: "#EBF1F5", height: "80vh" }}>
        <NonIdealState
          icon='error'
          title='No page found'
          description={description}
        />
      </div>

      <SimpleFooter style={{}} />
    </div>
  );
}
