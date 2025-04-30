import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
 
const Video = ({ playlistName, videos, onClose }) => {
  const [currentVideo, setCurrentVideo] = useState(videos.length > 0 ? videos[0] : null);
  const [notes, setNotes] = useState('');
  const [allNotes, setAllNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  

  const componentRef = useRef(null);
  const videoPlayerRef = useRef(null);
  
  useEffect(() => {
    if (listening) {
      setNotes(transcript);
    }
  }, [transcript, listening]);
  
  
  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, []);
  

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
    SpeechRecognition.startListening({ continuous: true });
  };
 
  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setAllNotes((prevNotes) => [...prevNotes, transcript]);
  };
 
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([notes], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "notes.txt";
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element); 
    setAllNotes([]); 
    setNotes(''); 
  };
 
  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(notes);
  };
 
  const handleSave = () => {
    setIsEditing(false);
    setNotes(editContent);
    setAllNotes((prevNotes) => [...prevNotes, editContent]);
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
 
  return (
    <div 
      ref={componentRef}
      className=" top-[-5%] bg-purple-50 flex flex-col "
    >
      <div className="flex flex-1 p-5 ">
       
        <div className="w-1/4  bg-white p-6 overflow-y-auto rounded-xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-purple-100">
          <h2 className="text-2xl font-bold mb-6 text-purple-800 border-b pb-3 flex items-center">
            {playlistName}
          </h2>
          <ul className="space-y-3">
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <li
                  key={index}
                  className={`p-3 cursor-pointer rounded-lg transition-all duration-300 flex items-center ${
                    currentVideo && currentVideo.url === video.url 
                      ? "bg-purple-600 text-white shadow-md transform scale-105" 
                      : "hover:bg-purple-100 text-gray-700"
                  }`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <span className="mr-2">{index + 1}.</span>
                  <span className="line-clamp-2">{video.title}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-600 text-center py-4 italic">No videos available</p>
            )}
          </ul>
        </div>
 
     
        <div 
          className=" bg-white  relative flex flex-col shadow-xl rounded-xl backdrop-blur-sm bg-opacity-90 border border-purple-100"
        >
         
          <div 
            ref={videoPlayerRef}
            className="flex-1 flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden"
            id="video-player-container"
          >
            {currentVideo ? (
              currentVideo.url.includes("youtube") || currentVideo.url.includes("youtu.be") ? (
                <iframe
                  className="w-180 h-10 md:h-[500px] lg:h-[550px] rounded-lg"
                  src={getEmbedUrl(currentVideo.url)}
                  title={currentVideo.title}
                  allowFullScreen
                  style={{ border: 'none', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
                ></iframe>
              ) : (
                <video controls className="w-full h-20 md:h-[500px] lg:h-[550px] rounded-lg" style={{ border: 'none', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}>
                  <source src={currentVideo.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <div className="text-center text-gray-400 p-10 flex flex-col items-center">
                <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>Select a video from the playlist to start watching</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white mt-6 rounded-xl shadow-xl backdrop-blur-sm bg-opacity-90 border border-purple-100">
        <div className="flex justify-between items-start gap-6">
         
          <div className="w-1/3">

            {browserSupportsSpeechRecognition ? (
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleStartListening} 
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium shadow-lg transition-all duration-300 ${
                    listening ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  disabled={listening}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                  </svg>
                  Stop
                </button>
                <button 
                  onClick={handleDownload} 
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium shadow-lg bg-purple-800 hover:bg-purple-900 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
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
          
  
          <div className="w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-purple-800 flex items-center">
                <div className="h-4 w-4 bg-purple-600 rounded-full mr-2"></div>
                Notes
              </h3>
              {!isEditing && (
                <button 
                  onClick={handleEdit} 
                  className="text-sm px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Edit
                </button>
              )}
            </div>
            
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50 overflow-y-auto h-48 shadow-inner">
              {isEditing ? (
                <div className="h-full flex flex-col">
                  <textarea
                    className="w-full h-full border-none outline-none resize-none bg-white p-3 rounded"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Your notes will appear here..."
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <button 
                      onClick={handleSave} 
                      className="px-3 py-1 rounded text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Save
                    </button>
                    <button 
                      onClick={handleCancel} 
                      className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {notes ? (
                    <div className="prose max-w-none">
                      {notes}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center flex-col text-purple-400">
                      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p className="text-center">
                        Click "Start Listening" to begin voice transcription
                      </p>
                      <p className="text-sm mt-1 text-center">
                        Or type directly by clicking the "Edit" button
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Video;