import React from "react";
import Navigation from "./components/navbar";
import SimpleFooter from "./components/footer";


export default function About() {
  return (
    <div>
      <Navigation />
      {"this is the about page"}
      <SimpleFooter /> 
    </div>
  );
}