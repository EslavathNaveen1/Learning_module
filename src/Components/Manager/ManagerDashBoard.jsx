import { useState } from "react";

import Playlists from "../PLaylist/Playlists";
import MangerCouses from "./MangerCouses";
import ManagerUsers from "./ManagerUsers";


const ManagerDashBoard = () => {
  const [selectedComponent, setSelectedComponent] = useState("playlists");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "playlists":
        return <Playlists />;
      case "users":
        return <ManagerUsers />;
      default:
        return <Playlists />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
    
      <div className="flex  h-screen">
      
        <div className="w-1/5 fixed top-20 left-0 h-[calc(100vh-5rem)] bg-gradient-to-b from-[#A32CC4] to-purple-500 shadow-lg flex flex-col overflow-hidden">
          <div className="px-4 py-6 text-white">
            <h2 className="text-2xl font-bold mb-1">Manager Portal</h2>
            <p className="text-purple-200 text-sm">Control your resources</p>
            <div className="w-16 h-1 bg-yellow-400 rounded-full mt-2"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent px-2">
            <MangerCouses 
              setSelectedComponent={setSelectedComponent} 
              selectedComponent={selectedComponent} 
            />
          </div>
          
          <div className="p-4 bg-purple-800/30 border-t border-purple-400/20">
            <div className="flex items-center text-purple-100 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Active Session
            </div>
          </div>
        </div>
        <div className="w-4/5 ml-[20%] p-6 bg-gray-50 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {selectedComponent === "playlists" && "Playlists Management"}
                {selectedComponent === "users" && "User Management"}
              </h1>             
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-100">
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A32CC4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Managing {selectedComponent}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedComponent === "playlists" && "Create, edit, delete your course playlists."}
                    {selectedComponent === "users" && "View and manage user accounts, permissions and enrollment status."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            {renderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashBoard;