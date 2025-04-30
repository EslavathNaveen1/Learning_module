import React from "react";
import { Link, useLocation } from "react-router-dom";
import LogoImg from "/Qtech.png";

const MainHeader = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#A32CC4] shadow-md text-black py-4 px-8 flex items-center justify-between sticky top-0 z-50">
    
      <div className="flex items-center space-x-2">
      
        <div className="relative">
          <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center transform rotate-45 shadow-inner">
            <div className="h-8 w-8 bg-purple-600 rounded transform -rotate-45 flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full shadow" />
        </div>
        
      
        <div className="text-white font-bold">
          <span className="text-2xl tracking-tight">QTech</span>
          <div className="flex items-center">
            <span className="text-lg text-purple-200">E-Learning</span>
            <div className="h-1 w-1 bg-yellow-400 rounded-full ml-1 animate-pulse" />
          </div>
        </div>
      </div>

    
      <nav className="flex items-center space-x-4 font-medium rounded-lg px-2 py-1">
  <Link
    to="/"
    className={`px-4 py-2 transition-all duration-300 rounded-md ${
      isActive("/")
        ? "bg-white text-purple-800 font-semibold shadow-md"
        : "text-purple-100 hover:bg-purple-600/40 hover:text-white"
    }`}
  >
    Home
  </Link>
  <Link
    to="/Courses"
    className={`px-4 py-2 transition-all duration-300 rounded-md ${
      isActive("/Courses")
        ? "bg-white text-purple-800 font-semibold shadow-md"
        : "text-purple-100 hover:bg-purple-600/40 hover:text-white"
    }`}
  >
    Courses
  </Link>
  <Link
    to="/About"
    className={`px-4 py-2 transition-all duration-300 rounded-md ${
      isActive("/About")
        ? "bg-white text-purple-800 font-semibold shadow-md"
        : "text-purple-100 hover:bg-purple-600/40 hover:text-white"
    }`}
  >
    About
  </Link>
  <Link
    to="/Contact"
    className={`px-4 py-2 transition-all duration-300 rounded-md ${
      isActive("/Contact")
        ? "bg-white text-purple-800 font-semibold shadow-md"
        : "text-purple-100 hover:bg-purple-600/40 hover:text-white"
    }`}
  >
    Contact
  </Link>
</nav>

<Link
    to="/Login"
    className="px-4 py-2 bg-white text-purple-800 font-medium transition-all duration-300 rounded-full hover:bg-purple-200 hover:shadow-md ml-2"
  >
    Login
  </Link>
    </header>
  );
};

export default MainHeader;
