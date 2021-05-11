import React from "react";
import Navigation from "./components/navbar";
import Footer from "./components/footer";
import { Button, NonIdealState, Intent } from "@blueprintjs/core";
import Spacer from "./components/spacer";

/** Error (404) page not found component. */

const description = (
  <>
    You've landed on a page that doesn't exist.
    <Spacer space='1vh' />
    <Button
      icon='home'
      text='Go to Home'
      intent={Intent.WARNING}
      onClick={(e) => (window.location.href = "/")}
    />
  </>
);

export default function Error() {
  return (
    <div>
      <Navigation />
      <div style={{ backgroundColor: "#F5F8FA", height: "75vh" }}>
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
