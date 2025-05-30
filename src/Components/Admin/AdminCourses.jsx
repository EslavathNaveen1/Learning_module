import React from "react";
import { FaUsers, FaList } from "react-icons/fa";

const AdminCourses = ({ setSelectedComponent, selectedComponent }) => {
  const menuItems = [
    { id: "playlists", label: "Playlists", desc: "Manage Playlists", icon: <FaList className="text-lg" /> },
    { id: "users", label: "Users", desc: "Manage Users", icon: <FaUsers className="text-lg" /> }
  ];

  return (
    <div className="w-full flex flex-col ">
      <nav className="flex flex-col space-y-1 px-2 mt-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedComponent(item.id)}
            className={`
              flex items-center justify-start p-3 rounded-lg transition-all duration-200 
              ${
                selectedComponent === item.id
                ? "bg-white/20 text-white font-medium border-l-4 border-yellow-400"
                : "hover:bg-white/10 text-purple-100"
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`${selectedComponent === item.id ? "text-yellow-500" : "text-purple-200"}`}>
                {item.icon}
              </div>
              <div className="flex flex-col items-start">
                <span className={`text-sm ${selectedComponent === item.id ? "font-medium" : ""}`}>{item.label}</span>
                <p className={`text-xs ${selectedComponent === item.id ? "text-white" : "text-white"}`}>{item.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminCourses;