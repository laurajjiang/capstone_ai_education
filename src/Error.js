import React from "react";
import Navigation from "./components/navbar";
import SimpleFooter from "./components/footer";


export default function error() {
  return (
    <div>
      <Navigation />
      <div class="jumbotron text-center">
        <h1> 404 - Page Not Found</h1>
      </div>
      <SimpleFooter /> 
    </div>
  );
}