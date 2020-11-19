import React from "react";
import Navigation from "./components/navbar";
import SimpleFooter from "./components/footer";
import TfVis from "./components/tf";

export default function Chapter1() {
        return(
          <div>
          <Navigation/>
          <TfVis/>
          <SimpleFooter/>
          </div> 
        )
    }