import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../AuthContext";
import axios from "axios";
import { Person as PersonIcon } from '@mui/icons-material';

const Profile = () => {
  const { fname, lname, mail, setFname, setLname } = useContext(AuthContext);
  const [firstName, setFirstName] = useState(fname || "");
  const [lastName, setLastName] = useState(lname || "");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    setFirstName(fname);
    setLastName(lname);
  }, [fname, lname]);
  
  const handleUpdate = async () => {
    try {
      const response = await axios.put("http://localhost:5104/api/Qtech/update-profile", {
        email: mail,
        fname: firstName,
        lname: lastName,
      });
      
      if (response.status === 200) {
        setFname(firstName);
        setLname(lastName);
        localStorage.setItem("fname", firstName);
        localStorage.setItem("lname", lastName);
        setMessage("Profile updated successfully!");
        
       
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    }
    
    setIsEditing(false);
  };
  
  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-xl p-8 mt-10 border border-purple-200 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100 rounded-tr-full opacity-50"></div>
      
     
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-1 text-center text-purple-700">Profile Information</h2>
        <div className="flex items-center justify-center mb-6">
          <div className="h-1 w-16 bg-purple-600 rounded-full"></div>
          <div className="h-2 w-2 mx-2 bg-purple-400 rounded-full"></div>
          <div className="h-1 w-16 bg-purple-600 rounded-full"></div>
        </div>
      </div>
      
      
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center overflow-hidden shadow-lg border-4 border-white">
          <PersonIcon style={{ fontSize: 64, color: 'white' }} />
        </div>
      </div>
      
   
      <div className="mb-6 relative z-10">
        <label className="block text-purple-700 font-medium mb-2">First Name</label>
        <input
          type="text"
          value={firstName}
          disabled={!isEditing}
          onChange={(e) => setFirstName(e.target.value)}
          className={`w-full p-3 border ${isEditing ? 'border-purple-300' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
        />
      </div>
      
      <div className="mb-6 relative z-10">
        <label className="block text-purple-700 font-medium mb-2">Last Name</label>
        <input
          type="text"
          value={lastName}
          disabled={!isEditing}
          onChange={(e) => setLastName(e.target.value)}
          className={`w-full p-3 border ${isEditing ? 'border-purple-300' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
        />
      </div>
      
      <div className="mb-6 relative z-10">
        <label className="block text-purple-700 font-medium mb-2">Email</label>
        <input
          type="text"
          value={mail}
          disabled
          className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
        />
      </div>
      
    
      {message && (
        <div className="mb-4 py-2 px-3 bg-purple-100 text-purple-700 rounded-lg flex items-center transition-all animate-fade-in relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p>{message}</p>
        </div>
      )}
   
      <div className="flex justify-center mt-8 relative z-10">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 font-medium flex items-center shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Profile
          </button>
        ) : (
          <div className="space-x-4">
            <button
              onClick={handleUpdate}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 font-medium flex  shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save 
            </button> <br/>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;