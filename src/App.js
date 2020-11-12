import React,{Component} from "react";
import Navigation from "./components/navbar";
import SimpleFooter from "./components/footer";
import Tf_VIS from "./components/tf";
import ScriptTag from 'react-script-tag';


class App extends Component {

  render(){
    return(
      <div>
      <ScriptTag isHydrating={true} type="text/javascript" src="js/data.js" />
      <ScriptTag isHydrating={true} type="text/javascript" src="js/model.js" />
      <ScriptTag isHydrating={true} type="text/javascript" src="js/tf-vis.js" />
      <header><Navigation/></header>
      <Tf_VIS/>
      <footer><SimpleFooter/></footer>
      </div> 
    )
  };
}

export default App;