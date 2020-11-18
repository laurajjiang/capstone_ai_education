import React,{Component} from "react";
import Navigation from "./components/navbar";
import SimpleFooter from "./components/footer";
import TfVis from "./components/tf";


export default function App() {
    return(
      <div>
      <Navigation/>
      <TfVis/>
      <SimpleFooter/>
      </div> 
    )
}
