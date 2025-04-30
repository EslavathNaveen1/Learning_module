// import React, { useState, useEffect, useContext, useRef } from 'react';
// import axios from 'axios';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import AuthContext from '../AuthContext';
// import UserDocument from '../User/UserDocument';
// import AIChatbot from '../AIAgent/AIChatbot';
 
// const EnrolledCourses = () => {
//   const { mail } = useContext(AuthContext);
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [otherCourses, setOtherCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [enrolledContent, setEnrolledContent] = useState({});
//   const [selectedPlaylist, setSelectedPlaylist] = useState(null);
//   const [activeContent, setActiveContent] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [courseToEnroll, setCourseToEnroll] = useState(null);
 
//   const [currentVideo, setCurrentVideo] = useState(null);
//   const [notes, setNotes] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState('');
//   const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
//   const processedTranscript = useRef('');
 
//   const contentRef = useRef(null);
//   const videoPlayerRef = useRef(null);
 
//   useEffect(() => {
//     const fetchCourses = async () => {
//       setLoading(true);
//       setError(null);
 
//       if (!mail) {
//         setLoading(false);
//         return;
//       }
 
//       try {
//         const enrolledResponse = await axios.get(`http://localhost:5104/api/QTech/EnrolledPlaylistIds`, {
//           params: { userEmail: mail },
//           timeout: 10000,
//         });
 
//         if (!Array.isArray(enrolledResponse.data)) {
//           throw new Error('Invalid response format for enrolled playlists');
//         }
 
//         const enrolledPlaylistIds = enrolledResponse.data;
 
//         if (enrolledPlaylistIds.length === 0) {
//           setEnrolledCourses([]);
//           const allPlaylistsResponse = await axios.get(`http://localhost:5104/api/Qtech/Playlists`, { timeout: 10000 });
//           if (!Array.isArray(allPlaylistsResponse.data)) {
//             throw new Error('Invalid response format for all playlists');
//           }
//           setOtherCourses(allPlaylistsResponse.data);
//           setLoading(false);
//           return;
//         }
 
//         const enrolledCoursePromises = enrolledPlaylistIds.map((id) =>
//           axios.get(`http://localhost:5104/api/Qtech/Playlists/${id}`, { timeout: 10000 })
//         );
 
//         const enrolledCourseResponses = await Promise.all(enrolledCoursePromises);
//         const enrolledCoursesData = enrolledCourseResponses.map((response) => response.data);
//         setEnrolledCourses(enrolledCoursesData);
 
//         const contentPromises = enrolledPlaylistIds.map(async (playlistId) => {
//           const [videosResponse, documentsResponse] = await Promise.all([
//             axios.get(`http://localhost:5104/api/Qtech/Videos`, { timeout: 30000 }),
//             axios.get(`http://localhost:5104/api/Qtech/Documents`, { timeout: 30000 }),
//           ]);
 
//           return {
//             playlistId,
//             videos: videosResponse.data.filter((video) => video.playlistId === playlistId),
//             documents: documentsResponse.data.filter((doc) => doc.playlistId === playlistId),
//           };
//         });
 
//         const contentResponses = await Promise.all(contentPromises);
//         const contentMap = contentResponses.reduce((acc, content) => {
//           acc[content.playlistId] = {
//             videos: content.videos,
//             documents: content.documents,
//           };
//           return acc;
//         }, {});
//         setEnrolledContent(contentMap);
 
//         const allPlaylistsResponse = await axios.get(`http://localhost:5104/api/Qtech/Playlists`);
//         if (!allPlaylistsResponse.data) {
//           throw new Error('Invalid response format for all playlists');
//         }
 
//         const allPlaylists = allPlaylistsResponse.data;
//         const otherCoursesData = allPlaylists.filter((playlist) => !enrolledPlaylistIds.includes(playlist.playlistId));
//         setOtherCourses(otherCoursesData);
 
//         setLoading(false);
//       } catch (err) {
//         console.error('Detailed Error:', err);
//         setError(
//           err.response
//             ? `Server Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`
//             : err.request
//             ? 'No response received from server. Please check your network connection.'
//             : `Request Setup Error: ${err.message}`
//         );
//         setLoading(false);
//       }
//     };
 
//     fetchCourses();
//   }, [mail]);
 
//   useEffect(() => {
//     if (selectedPlaylist && activeContent === 'video') {
//       const videos = enrolledContent[selectedPlaylist.playlistId]?.videos || [];
//       setCurrentVideo(videos.length > 0 ? videos[0] : null);
//     }
//   }, [selectedPlaylist, activeContent, enrolledContent]);
 
//   useEffect(() => {
//     if (listening && transcript) {
//       const newText = transcript.substring(processedTranscript.current.length).trim();
//       if (newText && newText !== processedTranscript.current) {
//         setNotes((prev) => (prev ? `${prev} ${newText}` : newText));
//         processedTranscript.current = transcript;
//       }
//     }
//   }, [transcript, listening]);
 
//   const getEmbedUrl = (url) => {
//     const youtubeRegex = /youtu\.be\/([a-zA-Z0-9_-]+)|youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
//     const match = url.match(youtubeRegex);
//     if (match) {
//       const videoId = match[1] || match[2];
//       return `https://www.youtube.com/embed/${videoId}`;
//     }
//     return url;
//   };
 
//   const handleStartListening = () => {
//     resetTranscript();
//     processedTranscript.current = '';
//     SpeechRecognition.startListening({ continuous: true });
//   };
 
//   const handleStopListening = () => {
//     SpeechRecognition.stopListening();
//   };
 
 
//   const handleNewNote = () => {
//     setNotes('');
//     resetTranscript();
//     processedTranscript.current = '';
//   };
 
//   const handleDownload = () => {
//     const element = document.createElement('a');
//     const file = new Blob([notes], { type: 'text/plain' });
//     element.href = URL.createObjectURL(file);
//     element.download = 'notes.txt';
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };
 
//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditContent(notes);
//   };
 
//   const handleSave = () => {
//     setIsEditing(false);
//     setNotes(editContent);
//   };
 
//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditContent('');
//   };
 
//   const handleVideoSelect = (video) => {
//     if (!currentVideo || currentVideo.url !== video.url) {
//       setCurrentVideo(video);
//     }
//   };
 
//   const handleEnrollRequest = (playlistId) => {
//     const course = otherCourses.find((c) => c.playlistId === playlistId);
//     setCourseToEnroll(course);
//     setShowModal(true);
//   };
 
//   const handleEnroll = async () => {
//     if (!courseToEnroll) return;
 
//     try {
//       const playlistId = courseToEnroll.playlistId;
//       await axios.post(`http://localhost:5104/api/QTech/EnrollPlaylists`, {
//         userEmail: mail,
//         playlistId: playlistId,
//         enrollStatus: false,
//       });
 
//       const [videosResponse, documentsResponse] = await Promise.all([
//         axios.get(`http://localhost:5104/api/Qtech/Videos`, { params: { playlistId: playlistId }, timeout: 15000 }),
//         axios.get(`http://localhost:5104/api/Qtech/Documents`, { params: { playlistId: playlistId }, timeout: 10000 }),
//       ]);
 
//       setOtherCourses((prevCourses) => prevCourses.filter((course) => course.playlistId !== playlistId));
//       setShowModal(false);
//       setCourseToEnroll(null);
//     } catch (error) {
//       console.error('Error enrolling in course:', error);
//       setShowModal(false);
//       setCourseToEnroll(null);
//     }
//   };
 
//   const handleCancelEnroll = () => {
//     setShowModal(false);
//     setCourseToEnroll(null);
//   };
 
//   const handleImageError = (e) => {
//     e.target.onerror = null;
//     e.target.src = 'https://via.placeholder.com/100';
//   };
 
//   const showCourseContent = (playlist, contentType) => {
//     setSelectedPlaylist(playlist);
//     setActiveContent(contentType);
//   };
 
//   const closeCourseContent = () => {
//     setSelectedPlaylist(null);
//     setActiveContent(null);
//     setCurrentVideo(null);
//     setNotes('');
//     setIsEditing(false);
//     setEditContent('');
//     SpeechRecognition.stopListening();
//   };
 
//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-64">
//         <div className="w-12 h-12 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin mb-4"></div>
//         <p className="text-purple-700 font-medium text-lg">Loading content...</p>
//       </div>
//     );
//   }
 
//   if (error) {
//     return <div className="text-red-500 text-center p-4">Error: {error}</div>;
//   }
 
//   return (
//     <div className="min-h-screen bg-purple-50 p-4 flex flex-col">
       
//       <div>
//         {enrolledCourses.length === 0 && otherCourses.length === 0 ? (
//           <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
//             <p className="text-gray-700">No courses found for this account.</p>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-8">
//             {enrolledCourses.length > 0 && (
//               <div className="flex flex-col">
//                 <h2 className="text-2xl font-bold mb-4 text-purple-800">Enrolled Courses</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {enrolledCourses.map((course) => (
//                     <div
//                       key={course.playlistId}
//                       className="border border-purple-200 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all text-sm relative"
//                     >
//                       <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs py-1 px-2 rounded-bl-lg rounded-tr-lg font-medium z-10">
//                         Enrolled
//                       </div>
//                       <img
//                         src={course.imageUrl || "https://via.placeholder.com/100"}
//                         alt={course.title}
//                         className="w-full h-40 rounded-lg object-cover"
//                         onError={handleImageError}
//                       />
//                       <p className="mt-2 text-center font-semibold text-purple-900">{course.title}</p>
//                       <p className="text-xs text-gray-600 text-center line-clamp-2 mt-1">{course.description}</p>
//                       <div className="flex flex-col gap-2 mt-3">
//                         <div className="flex gap-2 justify-center">
//                           <button
//                             className={`border border-purple-500 px-3 py-1.5 rounded-md text-xs transition font-medium ${
//                               !enrolledContent[course.playlistId]?.videos?.length
//                                 ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
//                                 : 'bg-white hover:bg-purple-600 hover:text-white'
//                             }`}
//                             onClick={() => showCourseContent(course, 'video')}
//                             disabled={!enrolledContent[course.playlistId]?.videos?.length}
//                           >
//                             Videos ({enrolledContent[course.playlistId]?.videos?.length || 0})
//                           </button>
//                           <button
//                             className={`border border-purple-500 px-3 py-1.5 rounded-md text-xs transition font-medium ${
//                               !enrolledContent[course.playlistId]?.documents?.length
//                                 ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
//                                 : 'bg-white hover:bg-purple-600 hover:text-white'
//                             }`}
//                             onClick={() => showCourseContent(course, 'document')}
//                             disabled={!enrolledContent[course.playlistId]?.documents?.length}
//                           >
//                             Docs ({enrolledContent[course.playlistId]?.documents?.length || 0})
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
 
//             {otherCourses.length > 0 && (
//               <div className="flex flex-col">
//                 <h2 className="text-2xl font-bold mb-4 text-purple-800">Available Courses</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {otherCourses.map((course) => (
//                     <div
//                       key={course.playlistId}
//                       className="border border-purple-200 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
//                     >
//                       <img
//                         src={course.imageUrl || "https://via.placeholder.com/100"}
//                         alt={course.title}
//                         className="w-full h-40 rounded-lg object-cover"
//                         onError={handleImageError}
//                       />
//                       <p className="mt-2 text-center font-semibold text-purple-900">{course.title}</p>
//                       <p className="text-xs text-gray-600 text-center line-clamp-2 mt-1">{course.description}</p>
//                       <div className="flex justify-center mt-3">
//                         <button
//                           className="w-24 py-1.5 rounded-md text-xs border border-purple-600 bg-white hover:bg-purple-600 hover:text-white transition font-medium"
//                           onClick={() => handleEnrollRequest(course.playlistId)}
//                         >
//                           Enroll
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
 
//       <div ref={contentRef}>
//         {selectedPlaylist && activeContent === 'video' && (
//           <div className="fixed inset-0 bg-purple-50 flex z-50">
//             <div className="flex w-[100%] pt-9 h-[calc(100vh-2rem)]">
//               <div className="w-[20%] bg-white p-6 overflow-y-auto rounded-xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-purple-100">
//                 <div className="">
//                   <button
//                     className="text-purple-600 hover:text-purple-800 font-bold text-lg"
//                     onClick={closeCourseContent}
//                   >
//                     &lt; Back To courses
//                   </button>
 
//                 </div>
 
//                 <h2 className="text-2xl font-bold mb-6 pt-4 text-purple-800 border-b pb-3 flex items-center">
//                   {selectedPlaylist.title}
//                 </h2>
//                 <ul className="space-y-3">
//                   {enrolledContent[selectedPlaylist.playlistId]?.videos?.length > 0 ? (
//                     enrolledContent[selectedPlaylist.playlistId].videos.map((video, index) => (
//                       <li
//                         key={index}
//                         className={`p-3 cursor-pointer rounded-lg transition-all duration-300 flex items-center hover:bg-purple-100 ${
//                           currentVideo && currentVideo.url === video.url
//                             ? 'bg-purple-600 text-white shadow-md'
//                             : 'text-gray-700'
//                         }`}
//                         onClick={() => handleVideoSelect(video)}
//                       >
//                         <span className="line-clamp-2">{video.title}</span>
//                       </li>
//                     ))
//                   ) : (
//                     <p className="text-gray-600 text-center py-4 italic">No videos available</p>
//                   )}
//                 </ul>
//               </div>
 
//               <div className="w-[100%] bg-white flex flex-col shadow-xl rounded-xl backdrop-blur-sm bg-opacity-90 border border-purple-100 mx-4">
//                 <div
//                   ref={videoPlayerRef}
//                   className="flex-1 flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden"
//                   id="video-player-container"
//                 >
//                   {currentVideo ? (
//                     currentVideo.url.includes('youtube') || currentVideo.url.includes('youtu.be') ? (
//                       <iframe
//                         className="w-full h-full rounded-lg"
//                         src={getEmbedUrl(currentVideo.url)}
//                         title={currentVideo.title}
//                         allowFullScreen
//                         style={{ border: 'none', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
//                       ></iframe>
//                     ) : (
//                       <video
//                         controls
//                         className="w-full h-full rounded-lg"
//                         style={{ border: 'none', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
//                       >
//                         <source src={currentVideo.url} type="video/mp4" />
//                         Your browser does not support the video tag.
//                       </video>
//                     )
//                   ) : (
//                     <div className="text-center text-gray-400 p-10 flex flex-col items-center">
//                       <svg
//                         className="w-20 h-20 mb-4 opacity-50"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
//                         ></path>
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                         ></path>
//                       </svg>
//                       <p className="text-lg font-medium">Select a video to begin</p>
//                       <p className="text-sm mt-2 italic">"Empower your learning journey by choosing a video from the playlist."</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
 
//               <div className="w-[50%] bg-white p-6 rounded-xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-purple-100 flex flex-col">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold text-purple-800 flex items-center">
//                     <div className="h-4 w-4 bg-purple-600 rounded-full mr-2"></div>
//                     Notes
//                   </h3>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={handleNewNote}
//                       className="text-sm px-3 py-1 rounded-full bg-green-100 hover:bg-green-200 text-green-700 transition-colors flex items-center gap-1"
//                     >
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M12 4v16m8-8H4"
//                         ></path>
//                       </svg>
//                       New Note
//                     </button>
//                     {!isEditing && (
//                       <button
//                         onClick={handleEdit}
//                         className="text-sm px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors flex items-center gap-1"
//                       >
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
//                           ></path>
//                         </svg>
//                         Edit
//                       </button>
//                     )}
//                   </div>
//                 </div>
//                 <div className="border border-purple-200 rounded-lg p-4 bg-purple-50 flex-1 overflow-y-auto shadow-inner">
//                   {isEditing ? (
//                     <div className="h-full flex flex-col">
//                       <textarea
//                         className="w-full flex-1 border-none outline-none resize-none bg-white p-3 rounded"
//                         value={editContent}
//                         onChange={(e) => setEditContent(e.target.value)}
//                         placeholder="Your notes will appear here..."
//                       />
//                       <div className="flex justify-end space-x-2 mt-3">
//                         <button
//                           onClick={handleSave}
//                           className="px-3 py-1 rounded text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-1"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M5 13l4 4L19 7"
//                             ></path>
//                           </svg>
//                           Save
//                         </button>
//                         <button
//                           onClick={handleCancel}
//                           className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-1"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M6 18L18 6M6 6l12 12"
//                             ></path>
//                           </svg>
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       {notes ? (
//                         <div className="prose max-w-none">{notes}</div>
//                       ) : (
//                         <div className="h-full flex items-center justify-center flex-col text-purple-400">
//                           <svg
//                             className="w-12 h-12 mb-2 opacity-50"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                             ></path>
//                           </svg>
//                           <p className="text-center">Click "Start" to start your Notes</p>
//                           <p className="text-sm mt-1 text-center">Or type it by clicking the "Edit" button</p>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
 
//                 <div className="mt-6">

//                   {browserSupportsSpeechRecognition ? (
//                     <div className="grid grid-cols-2 gap-3">
//                       <button
//                         onClick={handleStartListening}
//                         className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium shadow-lg transition-all duration-300 ${
//                           listening ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
//                         }`}
//                         disabled={listening}
//                       >
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
//                           ></path>
//                         </svg>
//                         Start
//                       </button>
//                       <button
//                         onClick={handleStopListening}
//                         className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium shadow-lg transition-all duration-300 ${
//                           !listening ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
//                         }`}
//                         disabled={!listening}
//                       >
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                           ></path>
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
//                           ></path>
//                         </svg>
//                         Stop
//                       </button>

//                       <button
//                         onClick={handleDownload}
//                         className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-white font-medium shadow-lg bg-purple-800 hover:bg-purple-900 transition-all duration-300"
//                       >
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                           ></path>
//                         </svg>
//                         Download
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-300">
//                       <p className="font-medium">Your browser doesn't support speech recognition.</p>
//                       <p className="text-sm mt-1">Try using Chrome or Edge for the full experience.</p>
//                     </div>
//                   )}
//                   {listening && (
//                     <div className="mt-4 p-3 bg-purple-100 rounded-lg border border-purple-200 flex items-center">
//                       <div className="mr-3 relative">
//                         <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75"></div>
//                         <div className="relative w-3 h-3 bg-purple-600 rounded-full"></div>
//                       </div>
//                       <span className="text-purple-800 font-medium">Listening...</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         <div>
//         {<AIChatbot/>}
//       </div>
 
//         {selectedPlaylist && activeContent === 'document' && (
//           <div className="fixed inset-0 bg-purple-50 z-50">
//             <div className="p-4">
//               <button
//                 className="text-purple-600 hover:text-purple-800 font-bold text-lg mb-4"
//                 onClick={closeCourseContent}
//               >
//                 &lt; Back to Courses
//               </button>
//               <UserDocument playlistId={selectedPlaylist.playlistId} onClose={closeCourseContent} />
//             </div>
//           </div>
//         )}
//       </div>
 
//       {showModal && courseToEnroll && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
//             <h3 className="text-lg font-semibold text-purple-800 mb-4">Confirm Enrollment</h3>
//             <p className="text-gray-700 mb-2">Are you sure you want to enroll in this course?</p>
//             <div className="bg-purple-50 p-3 rounded-lg mb-4">
//               <p className="font-medium text-purple-900">{courseToEnroll.title}</p>
//               <p className="text-sm text-gray-600 mt-1">{courseToEnroll.description}</p>
//             </div>
//             <div className="flex justify-end gap-4 mt-6">
//               <button
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                 onClick={handleCancelEnroll}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
//                 onClick={handleEnroll}
//               >
//                 Enroll
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
  
// };
 
// export default EnrolledCourses;

 

import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import AuthContext from '../AuthContext';
import UserDocument from '../User/UserDocument';
import AIChatbot from '../AIAgent/AIChatbot';

const EnrolledCourses = () => {
  const { mail } = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [otherCourses, setOtherCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledContent, setEnrolledContent] = useState({});
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [courseToEnroll, setCourseToEnroll] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  const [currentVideo, setCurrentVideo] = useState(null);
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const processedTranscript = useRef('');

  const contentRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const chatbotRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      if (!mail) {
        setLoading(false);
        return;
      }

      try {
        const enrolledResponse = await axios.get(`http://localhost:5104/api/QTech/EnrolledPlaylistIds`, {
          params: { userEmail: mail },
          timeout: 10000,
        });

        if (!Array.isArray(enrolledResponse.data)) {
          throw new Error('Invalid response format for enrolled playlists');
        }

        const enrolledPlaylistIds = enrolledResponse.data;

        if (enrolledPlaylistIds.length === 0) {
          setEnrolledCourses([]);
          const allPlaylistsResponse = await axios.get(`http://localhost:5104/api/Qtech/Playlists`, { timeout: 10000 });
          if (!Array.isArray(allPlaylistsResponse.data)) {
            throw new Error('Invalid response format for all playlists');
          }
          setOtherCourses(allPlaylistsResponse.data);
          setLoading(false);
          return;
        }

        const enrolledCoursePromises = enrolledPlaylistIds.map((id) =>
          axios.get(`http://localhost:5104/api/Qtech/Playlists/${id}`, { timeout: 10000 })
        );

        const enrolledCourseResponses = await Promise.all(enrolledCoursePromises);
        const enrolledCoursesData = enrolledCourseResponses.map((response) => response.data);
        setEnrolledCourses(enrolledCoursesData);

        const contentPromises = enrolledPlaylistIds.map(async (playlistId) => {
          const [videosResponse, documentsResponse] = await Promise.all([
            axios.get(`http://localhost:5104/api/Qtech/Videos`, { timeout: 30000 }),
            axios.get(`http://localhost:5104/api/Qtech/Documents`, { timeout: 30000 }),
          ]);

          return {
            playlistId,
            videos: videosResponse.data.filter((video) => video.playlistId === playlistId),
            documents: documentsResponse.data.filter((doc) => doc.playlistId === playlistId),
          };
        });

        const contentResponses = await Promise.all(contentPromises);
        const contentMap = contentResponses.reduce((acc, content) => {
          acc[content.playlistId] = {
            videos: content.videos,
            documents: content.documents,
          };
          return acc;
        }, {});
        setEnrolledContent(contentMap);

        const allPlaylistsResponse = await axios.get(`http://localhost:5104/api/Qtech/Playlists`);
        if (!allPlaylistsResponse.data) {
          throw new Error('Invalid response format for all playlists');
        }

        const allPlaylists = allPlaylistsResponse.data;
        const otherCoursesData = allPlaylists.filter((playlist) => !enrolledPlaylistIds.includes(playlist.playlistId));
        setOtherCourses(otherCoursesData);

        setLoading(false);
      } catch (err) {
        console.error('Detailed Error:', err);
        setError(
          err.response
            ? `Server Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`
            : err.request
            ? 'No response received from server. Please check your network connection.'
            : `Request Setup Error: ${err.message}`
        );
        setLoading(false);
      }
    };

    fetchCourses();
  }, [mail]);

  useEffect(() => {
    if (selectedPlaylist && activeContent === 'video') {
      const videos = enrolledContent[selectedPlaylist.playlistId]?.videos || [];
      setCurrentVideo(videos.length > 0 ? videos[0] : null);
    }
  }, [selectedPlaylist, activeContent, enrolledContent]);

  useEffect(() => {
    if (listening && transcript) {
      const newText = transcript.substring(processedTranscript.current.length).trim();
      if (newText && newText !== processedTranscript.current) {
        setNotes((prev) => (prev ? `${prev} ${newText}` : newText));
        processedTranscript.current = transcript;
      }
    }
  }, [transcript, listening]);

  const getEmbedUrl = (url) => {
    const youtubeRegex = /youtu\.be\/([a-zA-Z0-9_-]+)|youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const match = url.match(youtubeRegex);
    if (match) {
      const videoId = match[1] || match[2];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const handleStartListening = () => {
    resetTranscript();
    processedTranscript.current = '';
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleNewNote = () => {
    setNotes('');
    resetTranscript();
    processedTranscript.current = '';
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([notes], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'notes.txt';
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
    setEditContent('');
  };

  const handleVideoSelect = (video) => {
    if (!currentVideo || currentVideo.url !== video.url) {
      setCurrentVideo(video);
    }
  };

  const handleEnrollRequest = (playlistId) => {
    const course = otherCourses.find((c) => c.playlistId === playlistId);
    setCourseToEnroll(course);
    setShowModal(true);
  };

  const handleEnroll = async () => {
    if (!courseToEnroll) return;

    try {
      const playlistId = courseToEnroll.playlistId;
      await axios.post(`http://localhost:5104/api/QTech/EnrollPlaylists`, {
        userEmail: mail,
        playlistId: playlistId,
        enrollStatus: false,
      });

      const [videosResponse, documentsResponse] = await Promise.all([
        axios.get(`http://localhost:5104/api/Qtech/Videos`, { params: { playlistId: playlistId }, timeout: 15000 }),
        axios.get(`http://localhost:5104/api/Qtech/Documents`, { params: { playlistId: playlistId }, timeout: 10000 }),
      ]);

      setOtherCourses((prevCourses) => prevCourses.filter((course) => course.playlistId !== playlistId));
      setShowModal(false);
      setCourseToEnroll(null);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setShowModal(false);
      setCourseToEnroll(null);
    }
  };

  const handleCancelEnroll = () => {
    setShowModal(false);
    setCourseToEnroll(null);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/100';
  };

  const showCourseContent = (playlist, contentType) => {
    setSelectedPlaylist(playlist);
    setActiveContent(contentType);
  };

  const closeCourseContent = () => {
    setSelectedPlaylist(null);
    setActiveContent(null);
    setCurrentVideo(null);
    setNotes('');
    setIsEditing(false);
    setEditContent('');
    SpeechRecognition.stopListening();
  };

  const handleChatbotToggle = () => {
    setShowChatbot((prev) => {
      const newState = !prev;
      if (newState) {
        setTimeout(() => {
          chatbotRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
      return newState;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin mb-4"></div>
        <p className="text-purple-700 font-medium text-lg">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-purple-50 p-4 flex flex-col relative">
      <div>
        {enrolledCourses.length === 0 && otherCourses.length === 0 ? (
          <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <p className="text-gray-700">No courses found for this account.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {enrolledCourses.length > 0 && (
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-purple-800">Enrolled Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.playlistId}
                      className="border border-purple-200 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all text-sm relative"
                    >
                      <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs py-1 px-2 rounded-bl-lg rounded-tr-lg font-medium z-10">
                        Enrolled
                      </div>
                      <img
                        src={course.imageUrl || "https://via.placeholder.com/100"}
                        alt={course.title}
                        className="w-full h-40 rounded-lg object-cover"
                        onError={handleImageError}
                      />
                      <p className="mt-2 text-center font-semibold text-purple-900">{course.title}</p>
                      <p className="text-xs text-gray-600 text-center line-clamp-2 mt-1">{course.description}</p>
                      <div className="flex flex-col gap-2 mt-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            className={`border border-purple-500 px-3 py-1.5 rounded-md text-xs transition font-medium ${
                              !enrolledContent[course.playlistId]?.videos?.length
                                ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                                : 'bg-white hover:bg-purple-600 hover:text-white'
                            }`}
                            onClick={() => showCourseContent(course, 'video')}
                            disabled={!enrolledContent[course.playlistId]?.videos?.length}
                          >
                            Videos ({enrolledContent[course.playlistId]?.videos?.length || 0})
                          </button>
                          <button
                            className={`border border-purple-500 px-3 py-1.5 rounded-md text-xs transition font-medium ${
                              !enrolledContent[course.playlistId]?.documents?.length
                                ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                                : 'bg-white hover:bg-purple-600 hover:text-white'
                            }`}
                            onClick={() => showCourseContent(course, 'document')}
                            disabled={!enrolledContent[course.playlistId]?.documents?.length}
                          >
                            Docs ({enrolledContent[course.playlistId]?.documents?.length || 0})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {otherCourses.length > 0 && (
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-purple-800">Available Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherCourses.map((course) => (
                    <div
                      key={course.playlistId}
                      className="border border-purple-200 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
                    >
                      <img
                        src={course.imageUrl || "https://via.placeholder.com/100"}
                        alt={course.title}
                        className="w-full h-40 rounded-lg object-cover"
                        onError={handleImageError}
                      />
                      <p className="mt-2 text-center font-semibold text-purple-900">{course.title}</p>
                      <p className="text-xs text-gray-600 text-center line-clamp-2 mt-1">{course.description}</p>
                      <div className="flex justify-center mt-3">
                        <button
                          className="w-24 py-1.5 rounded-md text-xs border border-purple-600 bg-white hover:bg-purple-600 hover:text-white transition font-medium"
                          onClick={() => handleEnrollRequest(course.playlistId)}
                        >
                          Enroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div ref={contentRef}>
        {selectedPlaylist && activeContent === 'video' && (
          <div className="fixed inset-0 bg-purple-50 flex z-50">
            <div className="flex w-[100%] pt-9 h-[calc(100vh-2rem)]">
              <div className="w-[20%] bg-white p-6 overflow-y-auto rounded-xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-purple-100">
                <div className="">
                  <button
                    className="text-purple-600 hover:text-purple-800 font-bold text-lg"
                    onClick={closeCourseContent}
                  >
                     Back To courses
                  </button>
                </div>

                <h2 className="text-2xl font-bold mb-6 pt-4 text-purple-800 border-b pb-3 flex items-center">
                  {selectedPlaylist.title}
                </h2>
                <ul className="space-y-3">
                  {enrolledContent[selectedPlaylist.playlistId]?.videos?.length > 0 ? (
                    enrolledContent[selectedPlaylist.playlistId].videos.map((video, index) => (
                      <li
                        key={index}
                        className={`p-3 cursor-pointer rounded-lg transition-all duration-300 flex items-center hover:bg-purple-100 ${
                          currentVideo && currentVideo.url === video.url
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-gray-700'
                        }`}
                        onClick={() => handleVideoSelect(video)}
                      >
                        <span className="line-clamp-2">{video.title}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-4 italic">No videos available</p>
                  )}
                </ul>
              </div>

              <div className="w-[100%] bg-white flex flex-col shadow-xl rounded-xl backdrop-blur-sm bg-opacity-90 border border-purple-100 mx-4">
                <div
                  ref={videoPlayerRef}
                  className="flex-1 flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden"
                  id="video-player-container"
                >
                  {currentVideo ? (
                    currentVideo.url.includes('youtube') || currentVideo.url.includes('youtu.be') ? (
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={getEmbedUrl(currentVideo.url)}
                        title={currentVideo.title}
                        allowFullScreen
                        style={{ border: 'none', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
                      ></iframe>
                    ) : (
                      <video
                        controls
                        className="w-full h-full rounded-lg"
                        style={{ border: 'none', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
                      >
                        <source src={currentVideo.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )
                  ) : (
                    <div className="text-center text-gray-400 p-10 flex flex-col items-center">
                      <svg
                        className="w-20 h-20 mb-4 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <p className="text-lg font-medium">Select a video to begin</p>
                      <p className="text-sm mt-2 italic">"Empower your learning journey by choosing a video from the playlist."</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-[50%] bg-white p-6 rounded-xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-purple-100 flex flex-col">
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        ></path>
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
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
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
                          listening ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
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
                          !listening ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
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
                        className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-white font-medium shadow-lg bg-purple-800 hover:bg-purple-900 transition-all duration-300"
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
                        Download
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

        {selectedPlaylist && activeContent === 'document' && (
          <div className="fixed inset-0 bg-purple-50 z-50">
            <div className="p-4">
              <button
                className="text-purple-600 hover:text-purple-800 font-bold text-lg mb-4"
                onClick={closeCourseContent}
              >
                < Back to Courses/>
              </button>
              <UserDocument playlistId={selectedPlaylist.playlistId} onClose={closeCourseContent} />
            </div>
          </div>
        )}
      </div>

      <img
        src="https://tse3.mm.bing.net/th/id/OIP.itxWoOeIJLpFNBHL3PpVsgHaHa?rs=1&pid=ImgDetMain"
        alt="Chatbot Trigger"
        className="fixed bottom-4 right-4 w-20 h-20 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform z-50"
        onClick={handleChatbotToggle}
        onError={handleImageError}
      />

      {showChatbot && (
        <div ref={chatbotRef} className="mt-8">
          <AIChatbot />
        </div>
      )}

      {showModal && courseToEnroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Confirm Enrollment</h3>
            <p className="text-gray-700 mb-2">Are you sure you want to enroll in this course?</p>
            <div className="bg-purple-50 p-3 rounded-lg mb-4">
              <p className="font-medium text-purple-900">{courseToEnroll.title}</p>
              <p className="text-sm text-gray-600 mt-1">{courseToEnroll.description}</p>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                onClick={handleCancelEnroll}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                onClick={handleEnroll}
              >
                Enroll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;