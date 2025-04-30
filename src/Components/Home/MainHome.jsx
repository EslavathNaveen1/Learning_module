 import { Link } from "react-router-dom";

import Courses from "../PLaylist/Courses";
import About from "./About";
import Contact from "./Contact";
import MainHeader from "../Headers/MainHeader";


const MainHome = () => {
  return (
    <> 

    <div>
      <Courses/> 
       <About/>  
      <Contact/>
      </div>
    </>
  );
};

export default MainHome;
