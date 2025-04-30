import React, { useState, useEffect, useContext } from "react";
import Video from "../PLaylist/Video";
import UserDocument from "./UserDocument";
import AuthContext from "../AuthContext"; 

const UserCourses = () => {
  const { mail } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledPlaylists, setEnrolledPlaylists] = useState([]);


  const saveEnrolledPlaylistsToStorage = (userEmail, enrolledIds) => {
    localStorage.setItem(`enrolledPlaylists_${userEmail}`, JSON.stringify(enrolledIds));
  };


  const getEnrolledPlaylistsFromStorage = (userEmail) => {
    const storedData = localStorage.getItem(`enrolledPlaylists_${userEmail}`);
    return storedData ? JSON.parse(storedData) : [];
  };

  useEffect(() => {
    const fetchEnrolledPlaylists = async () => {
      try {
        const response = await fetch(
          `http://localhost:5104/api/Qtech/EnrolledPlaylistIds?userEmail=${encodeURIComponent(mail)}`
        );
        if (!response.ok) throw new Error("Failed to fetch enrolled playlists");
        const enrolledData = await response.json();
        const enrolledIds = enrolledData.map((item) => item.playlistId);

        setEnrolledPlaylists(enrolledIds);
        saveEnrolledPlaylistsToStorage(mail, enrolledIds);
      } catch (error) {
        console.error("Error fetching enrolled playlists:", error);
      }
    };

    if (mail) {
      const storedEnrollments = getEnrolledPlaylistsFromStorage(mail);
      if (storedEnrollments.length > 0) {
        setEnrolledPlaylists(storedEnrollments);
      } else {
        fetchEnrolledPlaylists();
      }
    }
  }, [mail]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5104/api/Qtech/Playlists");
        if (!response.ok) throw new Error("Failed to fetch playlists");
        const data = await response.json();
        setPlaylists(data);
        setFilteredPlaylists(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPlaylists(playlists);
    } else {
      const filtered = playlists.filter(
        (playlist) =>
          playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          playlist.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlaylists(filtered);
    }
  }, [searchTerm, playlists]);

  const handleEnroll = async (playlistId) => {
    try {
      const response = await fetch("http://localhost:5104/api/Qtech/EnrollPlaylists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: mail,
          playlistId: playlistId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to enroll in playlist");
      }

      const updatedEnrollments = [...enrolledPlaylists, playlistId];
      setEnrolledPlaylists(updatedEnrollments);
      saveEnrolledPlaylistsToStorage(mail, updatedEnrollments);

      alert("Successfully enrolled in the course!");
    } catch (error) {
      console.error("Enrollment error:", error);
      alert(error.message || "Failed to enroll in the course");
    }
  };

 
  if (loading) {   return (     <div className="flex flex-col justify-center items-center h-64">      <div className="w-12 h-12 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin mb-4"></div>      <p className="text-purple-700 font-medium text-lg">Loading content...</p>    </div>   ); }
 

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen mt-20 bg-purple-50">
      <div className="p-4 flex justify-center">
        <input
          type="text"
          placeholder="Search courses"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 p-2 border border-purple-400 rounded-lg text-sm text-center bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
        />
      </div>
      
      {filteredPlaylists.length === 0 && searchTerm !== "" && (
        <div className="text-center p-2 text-gray-500 text-sm">
          No playlists found matching "{searchTerm}"
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filteredPlaylists.map((playlist) => (
          <div 
            key={playlist.playlistId} 
            className="border bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all text-sm border-purple-200"
          >
            <img
              src={playlist.imageUrl || "https://via.placeholder.com/100"}
              alt={playlist.title}
              className="w-full h-40 rounded-lg object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/100";
              }}
            />
            <p className="mt-2 text-center font-semibold text-purple-900">{playlist.title}</p>
            <p className="text-xs text-gray-600 text-center line-clamp-2 mt-1">{playlist.description}</p>
            
            <div className="flex flex-col gap-2 mt-3 justify-center items-center">
           
              <button
                className={`w-24 py-1.5 rounded-md text-xs transition font-medium ${
                  enrolledPlaylists.includes(playlist.playlistId)
                    ? "bg-purple-600 text-white cursor-default"
                    : "border border-purple-600 bg-white hover:bg-purple-600 hover:text-white"
                }`}
                onClick={() =>
                  !enrolledPlaylists.includes(playlist.playlistId) && handleEnroll(playlist.playlistId)
                }
                disabled={enrolledPlaylists.includes(playlist.playlistId)}
              >
                {enrolledPlaylists.includes(playlist.playlistId) ? "Enrolled" : "Enroll"}
              </button>
              
            
              {enrolledPlaylists.includes(playlist.playlistId) && (
                <div className="flex gap-2 justify-center mt-1">
                  <button
                    className="border border-purple-500 px-3 py-1.5 rounded-md text-xs hover:bg-purple-600 hover:text-white transition bg-white font-medium"
                    onClick={() => {
                      setSelectedPlaylist(playlist);
                      setActiveContent("video");
                    }}
                  >
                    Videos
                  </button>
                  <button
                    className="border border-purple-500 px-3 py-1.5 rounded-md text-xs hover:bg-purple-600 hover:text-white transition bg-white font-medium"
                    onClick={() => {
                      setSelectedPlaylist(playlist);
                      setActiveContent("document");
                    }}
                  >
                    Docs
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {selectedPlaylist && activeContent === "video" && (
        <Video
          playlistName={selectedPlaylist.title}
          videos={selectedPlaylist.videos || []} 
          onClose={() => setSelectedPlaylist(null)}
        />
      )}
      
      {selectedPlaylist && activeContent === "document" && (
        <UserDocument playlistId={selectedPlaylist.playlistId} onClose={() => setSelectedPlaylist(null)} />
      )}
    </div>
  );
};

export default UserCourses;