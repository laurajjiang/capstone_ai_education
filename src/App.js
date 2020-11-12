import React,{Component} from "react";
import Navigation from "./components/navbar";
import SimpleFooter from "./components/footer";
import TfVis from "./components/tf";


class App extends Component {

  render(){
    return(
      <div>
      <header><Navigation/></header>
      <TfVis/>
      <footer><SimpleFooter/></footer>
      </div> 
    )
  };
}

export default App;