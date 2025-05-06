// import React, { useState, useEffect, useRef ,useContext} from "react";
// import axios from "axios";
// import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import AuthContext from "../AuthContext";
// import { useParams } from "react-router-dom";
 
// const AdminVideos = () => {
//   const { playlistId } = useParams(); 
//   const [playlists, setPlaylists] = useState([]);
//   const [selectedPlaylist, setSelectedPlaylist] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [editingVideoId, setEditingVideoId] = useState(null);
//   const [videoEditData, setVideoEditData] = useState({
//     title: "",
//     url: "",
//     imgUrl: "",
//   });
//   const[Back,setBack]=useState(false)
//   const navigate = useNavigate()
//   const {role } = useContext(AuthContext);
 

//   const videoContainerRef = useRef(null);
//   const editFormRef = useRef(null);
//   const handleBack =()=>{
//     setBack(!Back)
//   }
 
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const playlistsResponse = await axios.get("http://localhost:5104/api/Qtech/Playlists");
//         const videosResponse = await axios.get("http://localhost:5104/api/Qtech/Videos");
 
//         setPlaylists(playlistsResponse.data);
//         setVideos(videosResponse.data);
       
     
//         if (playlistId) {
//           const playlist = playlistsResponse.data.find(p => p.playlistId === parseInt(playlistId));
//           if (playlist) {
//             setSelectedPlaylist(playlist);
//             setShowPlaylists(false);
//             setTimeout(() => {
//               videoContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//             }, 300);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
 
//     fetchData();
//   }, [playlistId]);
 
//   const navToPlaylist=(role)=>{
     
 
//       if(role==='Manager'){
//         navigate('/managerDashboard')
//       }
//       else{
//         navigate('/Admin/Actions')
//       }
//   }
 
//   const handleSelectPlaylist = (playlist) => {
//     setSelectedPlaylist(playlist);
//     setTimeout(() => {
//       videoContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 300);
//   };
 
//   const handleEditVideo = (video) => {
//     setEditingVideoId(video.videoId);
//     setVideoEditData({
//       title: video.title,
//       url: video.url,
//       imgUrl: video.imgUrl || "",
//     });
 
  
//     setTimeout(() => {
//       editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 300);
//   };
 
//   const handleSaveVideo = async (videoId) => {
//     if (!videoEditData.imgUrl.trim()) {
//       alert("Image URL is required!");
//       return;
//     }
 
//     try {
//       console.log("Sending Data:", videoEditData);
 
//       await axios.patch(`http://localhost:5104/api/Qtech/Videos/Edit/${videoId}`, videoEditData, {
//         headers: { "Content-Type": "application/json" },
//       });
 
//       setVideos((prevVideos) =>
//         prevVideos.map((video) => (video.videoId === videoId ? { ...video, ...videoEditData } : video))
//       );
 
//       setEditingVideoId(null);
//     } catch (error) {
//       console.error("Error updating video:", error.response?.data || error.message);
//       alert("Error updating video: " + (error.response?.data?.title || error.message));
//     }
//   };
 
//   const handleDeleteVideo = async (videoId) => {
//     if (!window.confirm("Are you sure you want to delete this video?")) return;
 
//     try {
//       await axios.delete(`http://localhost:5104/api/Qtech/Videos/${videoId}`);
//       setVideos((prevVideos) => prevVideos.filter((video) => video.videoId !== videoId));
//     } catch (error) {
//       alert("Error deleting video: " + error.message);
//     }
//   };
 
 
//   return (
//     <div className="w-full p-6 mt-5">
//       <button
//         onClick={()=>navToPlaylist(role)}
//         className="mt-4 px-4 py-2 mb-4 ml-5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition shadow-md"
//       >
//         Back to Playlist
//       </button>
     
     
//       {selectedPlaylist && (
//         <div ref={videoContainerRef} className="mt-4 p-6 rounded-lg shadow-lg bg-white border border-purple-200">
//           <h3 className="text-xl font-semibold text-purple-800 mb-4">Videos for {selectedPlaylist.title}</h3>
//           {videos.filter((video) => video.playlistId === selectedPlaylist.playlistId).length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {videos
//                 .filter((video) => video.playlistId === selectedPlaylist.playlistId)
//                 .map((video) => (
//                   <div key={video.videoId} className="border-2 border-purple-400 rounded-lg p-4 shadow-md hover:shadow-purple-200 bg-white flex flex-col items-center w-full transition-all duration-300">
//                     <img
//                       src={video.ImageUrl || video.imageUrl || "/fallback-image.jpg"}
//                       alt={video.title}
//                       className="w-full h-40 object-cover rounded-lg"
//                       onError={(e) => {
//                         e.target.src = "/fallback-image.jpg";
//                       }}
//                     />
//                     <h4 className="font-medium mt-3 text-purple-900">{video.title}</h4>
//                     <a href={video.url} className="text-purple-600 hover:underline mt-2 text-sm" target="_blank" rel="noopener noreferrer">
//                       Watch Video
//                     </a>
//                     <div className="flex gap-3 mt-3">
//                       <button onClick={() => handleEditVideo(video)} className="px-4 py-2 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-600 transition shadow-sm flex items-center">
//                         <FaEdit className="mr-1" /> Edit
//                       </button>
//                       <button onClick={() => handleDeleteVideo(video.videoId)} className="px-4 py-2 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition shadow-sm flex items-center">
//                         <FaTrash className="mr-1" /> Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           ) : (
//             <p className="text-gray-600 text-sm p-4 bg-purple-50 rounded-lg">No videos available</p>
//           )}
//         </div>
//       )}
  
 
//       {editingVideoId && (
//         <div ref={editFormRef} className="w-2/3 mx-auto p-6 bg-purple-50 rounded-lg shadow-md mt-8 border border-purple-200">
//           <h2 className="text-lg font-semibold mb-4 text-purple-800">Edit Video Details</h2>
//           <input
//             type="text"
//             value={videoEditData.title}
//             onChange={(e) => setVideoEditData({ ...videoEditData, title: e.target.value })}
//             className="border border-purple-200 p-3 rounded-md w-full text-sm block mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
//             placeholder="Title"
//           />
//           <input
//             type="text"
//             value={videoEditData.url}
//             onChange={(e) => setVideoEditData({ ...videoEditData, url: e.target.value })}
//             className="border border-purple-200 p-3 rounded-md w-full text-sm block mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
//             placeholder="Video URL"
//           />
//           <input
//             type="text"
//             value={videoEditData.imgUrl}
//             onChange={(e) => setVideoEditData({ ...videoEditData, imgUrl: e.target.value })}
//             className="border border-purple-200 p-3 rounded-md w-full text-sm block mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
//             placeholder="Image URL"
//           />
//           <div className="flex gap-4">
//             <button onClick={() => handleSaveVideo(editingVideoId)} className="px-5 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition shadow-sm flex items-center">
//               <FaCheck className="mr-2" /> Save
//             </button>
//             <button onClick={() => setEditingVideoId(null)} className="px-5 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition shadow-sm flex items-center">
//               <FaTimes className="mr-2" /> Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
 
 
// export default AdminVideos;
 
 
 

import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import { useParams } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const AdminVideos = () => {
  const { playlistId } = useParams();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoEditData, setVideoEditData] = useState({
    title: "",
    url: "",
    imgUrl: "",
  });
  const [Back, setBack] = useState(false);
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);

 
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const processedTranscript = useRef("");

  const videoContainerRef = useRef(null);
  const editFormRef = useRef(null);
  const videoPlayerRef = useRef(null);

  const handleBack = () => {
    setBack(!Back);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playlistsResponse = await axios.get("https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/Playlists");
        const videosResponse = await axios.get("https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/Videos");

        setPlaylists(playlistsResponse.data);
        setVideos(videosResponse.data);

        if (playlistId) {
          const playlist = playlistsResponse.data.find((p) => p.playlistId === parseInt(playlistId));
          if (playlist) {
            setSelectedPlaylist(playlist);
            setTimeout(() => {
              videoContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [playlistId]);

  // Effect for transcript handling
  useEffect(() => {
    if (listening && transcript) {
      const newText = transcript.substring(processedTranscript.current.length).trim();
      if (newText && newText !== processedTranscript.current) {
        setNotes((prev) => (prev ? `${prev} ${newText}` : newText));
        processedTranscript.current = transcript;
      }
    }
  }, [transcript, listening]);

  const navToPlaylist = (role) => {
    if (role === "Manager") {
      navigate("/managerDashboard");
    } else {
      navigate("/Admin/Actions");
    }
  };

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setTimeout(() => {
      videoContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  const handleEditVideo = (video) => {
    setEditingVideoId(video.videoId);
    setVideoEditData({
      title: video.title,
      url: video.url,
      imgUrl: video.imgUrl || "",
    });

    setTimeout(() => {
      editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  const handleSaveVideo = async (videoId) => {
    if (!videoEditData.imgUrl.trim()) {
      alert("Image URL is required!");
      return;
    }

    try {
      console.log("Sending Data:", videoEditData);

      await axios.patch(`https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/Videos/Edit/${videoId}`, videoEditData, {
        headers: { "Content-Type": "application/json" },
      });

      setVideos((prevVideos) =>
        prevVideos.map((video) => (video.videoId === videoId ? { ...video, ...videoEditData } : video))
      );

      setEditingVideoId(null);
    } catch (error) {
      console.error("Error updating video:", error.response?.data || error.message);
      alert("Error updating video: " + (error.response?.data?.title || error.message));
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/Videos/${videoId}`);
      setVideos((prevVideos) => prevVideos.filter((video) => video.videoId !== videoId));
    } catch (error) {
      alert("Error deleting video: " + error.message);
    }
  };

  // Video player functions
  const getEmbedUrl = (url) => {
    const youtubeRegex = /youtu\.be\/([a-zA-Z0-9_-]+)|youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const match = url.match(youtubeRegex);
    if (match) {
      const videoId = match[1] || match[2];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const handleWatchVideo = (video) => {
    setCurrentVideo(video);
    setShowVideoPlayer(true);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setCurrentVideo(null);
    setNotes("");
    setIsEditing(false);
    setEditContent("");
    if (listening) {
      SpeechRecognition.stopListening();
    }
  };

  // Notes functions
  const handleStartListening = () => {
    resetTranscript();
    processedTranscript.current = "";
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleNewNote = () => {
    setNotes("");
    resetTranscript();
    processedTranscript.current = "";
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([notes], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "notes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(notes);
  };

  const handleSave = () => {
    setIsEditing(false);
    setNotes(editContent);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent("");
  };

  return (
    <div className="w-full p-6 mt-5">
      <button
        onClick={() => navToPlaylist(role)}
        className="mt-4 px-4 py-2 mb-4 ml-5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition shadow-md"
      >
        Back to Playlist
      </button>

      {selectedPlaylist && (
        <div ref={videoContainerRef} className="mt-4 p-6 rounded-lg shadow-lg bg-white border border-purple-200">
          <h3 className="text-xl font-semibold text-purple-800 mb-4">Videos for {selectedPlaylist.title}</h3>
          {videos.filter((video) => video.playlistId === selectedPlaylist.playlistId).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos
                .filter((video) => video.playlistId === selectedPlaylist.playlistId)
                .map((video) => (
                  <div key={video.videoId} className="border-2 border-purple-400 rounded-lg p-4 shadow-md hover:shadow-purple-200 bg-white flex flex-col items-center w-full transition-all duration-300">
                    <img
                      src={video.ImageUrl || video.imageUrl || "/fallback-image.jpg"}
                      alt={video.title}
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/fallback-image.jpg";
                      }}
                    />
                    <h4 className="font-medium mt-3 text-purple-900">{video.title}</h4>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => handleWatchVideo(video)}
                        className="px-4 py-2 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition shadow-sm flex items-center"
                      >
                        Watch Video
                      </button>
                      <button
                        onClick={() => handleEditVideo(video)}
                        className="px-4 py-2 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-600 transition shadow-sm flex items-center"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video.videoId)}
                        className="px-4 py-2 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition shadow-sm flex items-center"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm p-4 bg-purple-50 rounded-lg">No videos available</p>
          )}
        </div>
      )}

      {editingVideoId && (
        <div ref={editFormRef} className="w-2/3 mx-auto p-6 bg-purple-50 rounded-lg shadow-md mt-8 border border-purple-200">
          <h2 className="text-lg font-semibold mb-4 text-purple-800">Edit Video Details</h2>
          <input
            type="text"
            value={videoEditData.title}
            onChange={(e) => setVideoEditData({ ...videoEditData, title: e.target.value })}
            className="border border-purple-200 p-3 rounded-md w-full text-sm block mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            placeholder="Title"
          />
          <input
            type="text"
            value={videoEditData.url}
            onChange={(e) => setVideoEditData({ ...videoEditData, url: e.target.value })}
            className="border border-purple-200 p-3 rounded-md w-full text-sm block mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            placeholder="Video URL"
          />
          <input
            type="text"
            value={videoEditData.imgUrl}
            onChange={(e) => setVideoEditData({ ...videoEditData, imgUrl: e.target.value })}
            className="border border-purple-200 p-3 rounded-md w-full text-sm block mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            placeholder="Image URL"
          />
          <div className="flex gap-4">
            <button
              onClick={() => handleSaveVideo(editingVideoId)}
              className="px-5 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition shadow-sm flex items-center"
            >
              <FaCheck className="mr-2" /> Save
            </button>
            <button
              onClick={() => setEditingVideoId(null)}
              className="px-5 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition shadow-sm flex items-center"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        </div>
      )}


      {showVideoPlayer && currentVideo && (
        
      <div> 
        
        <div className="fixed inset-0 bg-purple-50 flex z-50">
         
          <div className="flex w-full pt-9 h-screen">
            
            
            <div className="w-full mt-[-5%] bg-white flex flex-col shadow-xl rounded-xl backdrop-blur-sm bg-opacity-90 border border-purple-100 ">
            <button
                  className="text-purple-600 ml-[-85%] hover:text(Back To Playlisat) font-bold text"
                  onClick={closeVideoPlayer}
                >
                  &lt; Back To Video
                </button>
              <div
                ref={videoPlayerRef}
                className="flex-1 flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden"
              >
                {currentVideo && (
                  currentVideo.url.includes("youtube") || currentVideo.url.includes("youtu.be") ? (
                    <iframe
                      className="w-full h-full rounded-lg"
                      src={getEmbedUrl(currentVideo.url)}
                      title={currentVideo.title}
                      allowFullScreen
                      style={{ border: "none", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}
                    ></iframe>
                  ) : (
                    <video
                      controls
                      className="w-full h-full rounded-lg"
                      style={{ border: "none", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}
                    >
                      <source src={currentVideo.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )
                )}
              </div>
            </div>
            </div>
           
            <div className="w-2/5 bg-white p-6 rounded-xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-purple-100 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-purple-800 flex items-center">
                  <div className="h-4 w-4 bg-purple-600 rounded-full mr-2"></div>
                  Notes
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNewNote}
                    className="text-sm px-3 py-1 rounded-full bg-green-100 hover:bg-green-200 text-green-700 transition-colors flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    New Note
                  </button>
                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      className="text-sm px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                      </svg>
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50 flex-1 overflow-y-auto shadow-inner">
                {isEditing ? (
                  <div className="h-full flex flex-col">
                    <textarea
                      className="w-full flex-1 border-none outline-none resize-none bg-white p-3 rounded"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Your notes will appear here..."
                    />
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 rounded text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {notes ? (
                      <div className="prose max-w-none">{notes}</div>
                    ) : (
                      <div className="h-full flex items-center justify-center flex-col text-purple-400">
                        <svg
                          className="w-12 h-12 mb-2 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                        <p className="text-center">Click "Start" to start your Notes</p>
                        <p className="text-sm mt-1 text-center">Or type it by clicking the "Edit" button</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-6">
                {browserSupportsSpeechRecognition ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleStartListening}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium shadow-lg transition-all duration-300 ${
                        listening ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-700"
                      }`}
                      disabled={listening}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        ></path>
                      </svg>
                      Start
                    </button>
                    <button
                      onClick={handleStopListening}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium shadow-lg transition-all duration-300 ${
                        !listening ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-700"
                      }`}
                      disabled={!listening}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                        ></path>
                      </svg>
                      Stop
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-white font-medium shadow-lg bg-purple-800 hover:bg-purple-900 transition-all duration-300 col-span-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        ></path>
                      </svg>
                      Download Notes
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-300">
                    <p className="font-medium">Your browser doesn't support speech recognition.</p>
                    <p className="text-sm mt-1">Try using Chrome or Edge for the full experience.</p>
                  </div>
                )}
                {listening && (
                  <div className="mt-4 p-3 bg-purple-100 rounded-lg border border-purple-200 flex items-center">
                    <div className="mr-3 relative">
                      <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75"></div>
                      <div className="relative w-3 h-3 bg-purple-600 rounded-full"></div>
                    </div>
                    <span className="text-purple-800 font-medium">Listening...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideos;