import React,{Component} from "react";
import Navigation from "./components/navbar";
import SimpleFooter from "./components/footer";
import Tf_VIS from "./components/tf";


class App extends Component {
  componentDidMount(){
    const script1 = document.createElement("script");    
    script1.async = true;
    script1.src = "./js/data.js";    
    this.div.appendChild(script1);

    const script2 = document.createElement("script");    
    script2.async = true;
    script2.src = "./js/model.js";    
    this.div.appendChild(script2);

    const script3 = document.createElement("script");    
    script3.async = true;
    script3.src = "./js/tf-vis.js";    
    this.div.appendChild(script3);

  }

  render(){
    return(
      <div>
      <header><Navigation/></header> 
      <Tf_VIS/>
      <footer><SimpleFooter/></footer>
      </div> 
    )
  }
}

export default App;