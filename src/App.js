import React from "react";
import Navigation from "./components/navbar";
import SimpleFooter from "./components/footer";


export default function App() {
  return (
    <div>
      <Navigation />
      {"this is the home page"}
      <SimpleFooter /> 
    </div>
  );
}