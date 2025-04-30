import React, { useContext, useState, useRef, useEffect } from "react";
import { Avatar } from "@mui/material";
import AuthContext from "../AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
 
const DashBoardHeader = () => {
  const { logout, role, mail, fname, lname } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
 
  const firstLetter = mail ? mail.charAt(0).toUpperCase() : "?";
 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
 
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
 
 
  const getDashboardType = () => {
    if (location.pathname.startsWith("/Admin")) return "Admin Dashboard";
    if (location.pathname.startsWith("/Manager")) return "Manager Dashboard";
    if (location.pathname.startsWith("/User") || location.pathname === "/UserDashBoard") return "User Dashboard";
    return "Dashboard";
  };
 
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const name = fname || "User";
   
    let greeting;
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';
 
    return `${greeting}, ${name}`;
  };
 
  const isActive = (path) => {
    if (location.pathname === path) return true;
   
    if (role === "User") {
      if (path === "/User/courses") {
        return location.pathname === "/UserDashBoard" ||
               location.pathname === "/User/courses" ||
               location.pathname.startsWith("/User/courses");
      }
    }
   
    if (path === "/Admin/Home" && location.pathname.startsWith("/Admin")) return true;
    if (path === "/Manager/Home" && location.pathname.startsWith("/Manager")) return true;
   
    return false;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
 
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
        {(role === "Admin" || role === "Manager") && (
          <Link
            to={role === "Admin" ? "/Admin/Home" : "/Manager/Home"}
            className={`px-4 py-2 transition-all duration-300 rounded-md ${
              isActive(role === "Admin" ? "/Admin/Home" : "/Manager/Home")
                ? "bg-white text-purple-800 font-semibold shadow-md"
                : "text-purple-100 hover:bg-purple-600/40 hover:text-white"
            }`}
          >
            Home
          </Link>
        )}
        {role === "User" && (
          <Link
            to="/User/courses"
            className={`px-4 py-2 transition-all duration-300 rounded-md ${
              isActive("/User/courses")
                ? "bg-white text-purple-800 font-semibold shadow-md"
                : "text-purple-100 hover:bg-purple-600/40 hover:text-white"
            }`}
          >
            Courses
          </Link>
        )}
        <Link
          to="/User/about"
          className={`px-4 py-2 transition-all duration-300 rounded-md ${
            isActive("/User/about")
              ? "bg-white text-purple-800 font-semibold shadow-md"
              : "text-purple-100 hover:bg-purple-600/40 hover:text-white"
          }`}
        >
          About
        </Link>
        <Link
          to="/User/contact"
          className={`px-4 py-2 transition-all duration-300 rounded-md ${
            isActive("/User/contact")
              ? "bg-white text-purple-800 font-semibold shadow-md"
              : "text-purple-100 hover:bg-purple-600/40 hover:text-white"
          }`}
        >
          Contact
        </Link>
      </nav>

  
      <div className="flex items-center space-x-4">
       
        <div className="text-right">
          <p className="text-sm font-bold text-purple-100">{role}</p>
          <p className="text-lg font-semibold text-white">{getWelcomeMessage()}</p>
        </div>
 
        <div className="relative inline-block" ref={menuRef}>
          <Avatar
            className="bg-white text-purple-800 cursor-pointer hover:shadow-lg transition text-xl border-2 border-purple-200"
            onClick={toggleMenu}
          >
            {firstLetter}
          </Avatar>
 
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white shadow-lg rounded-lg border border-purple-200 z-50">
              <ul className="text-gray-700">
                <li
                  onClick={() => {
                    navigate("/User/profile");
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-purple-50 cursor-pointer rounded-t-lg"
                >
                  Profile
                </li>
                <li
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-purple-50 rounded-b-lg cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
 
export default DashBoardHeader;