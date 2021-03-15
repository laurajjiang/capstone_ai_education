import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import Home from "./Home";
import reportWebVitals from "./reportWebVitals";
import About from "./About";
import Error from "./Error";
import Introduction from "./chapters/Intro";
import SentimentClassification from "./chapters/SentimentClassification";
import LogisticRegression from "./chapters/LogisticRegression";
import NeuralNetworkClass from "./chapters/NeuralNetworkClass";
import NeuralNetworkImg from "./chapters/NeuralNetworkImg";
import ConvolutionalNN from "./chapters/CNeuralNetworkImg";

const routing = (
  <Router>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/about' component={About} />
      <Route exact path='/chapter0' component={Introduction} />
      <Route exact path='/chapter1' component={LogisticRegression} />
      <Route exact path='/chapter2' component={NeuralNetworkClass} />
      <Route exact path='/chapter3' component={NeuralNetworkImg} />
      <Route exact path='/chapter4' component={ConvolutionalNN} />
      <Route exact path='/chapter5' component={SentimentClassification} />
      <Route component={Error} />
    </Switch>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
