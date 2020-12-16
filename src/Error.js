import React from "react";
import Navigation from "./components/navbar";
import Footer from "./components/footer";
import { Button, NonIdealState } from "@blueprintjs/core";

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
      <div style={{ backgroundColor: "#F5F8FA", height: "80vh" }}>
        <NonIdealState
          icon='error'
          title='No page found'
          description={description}
        />
      </div>
      <hr style={{ marginTop: "0px" }} />
      <Footer />
    </div>
  );
}
