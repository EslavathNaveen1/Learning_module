import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaTimes, FaCheck, FaEye } from "react-icons/fa";
import cimage from "../../assets/cimage.jpg";
import datascience from "../../assets/datascience.jpg";
import AuthContext from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
 
const AdminDocs = () => {
  const { playlistId } = useParams(); 
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [editingDocId, setEditingDocId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null); 
  const { role } = useContext(AuthContext);
 
  const docContainerRef = useRef(null);
  const editFormRef = useRef(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const playlistsResponse = await axios.get("http://localhost:5104/api/Qtech/Playlists");
        const documentsResponse = await axios.get("http://localhost:5104/api/Qtech/documents");
 
        setPlaylists(playlistsResponse.data.map((playlist, index) => ({
          ...playlist,
          img: playlist.imageUrl || (index % 2 === 0 ? cimage : datascience),
        })));
 
        setDocuments(documentsResponse.data);
       
      
        if (playlistId) {
          const playlist = playlistsResponse.data.find(p => p.playlistId === parseInt(playlistId));
          if (playlist) {
            setSelectedPlaylist(playlist);
           
            setTimeout(() => {
              docContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
 
    fetchData();
  }, [playlistId]);
 
  useEffect(() => {
    if (editingDocId && editFormRef.current) {
      setTimeout(() => {
        editFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [editingDocId]);
 
  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setTimeout(() => {
      docContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };
 
  const navToPlaylist = (role) => {
    if (role === 'Manager') {
      navigate('/managerDashboard');
    } else {
      navigate('/Admin/Actions');
    }
  };
 
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
 
  const handleEditDoc = (doc) => {
    setEditingDocId(doc.docId);
    setSelectedFile(null);
  };
 
  const handleUpdateDoc = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }
 
    const formData = new FormData();
    formData.append('file', selectedFile);
 
    try {
      await axios.put(`http://localhost:5104/api/Qtech/update-pdf/${editingDocId}`, formData);
 
     
      const updatedDocsResponse = await axios.get('http://localhost:5104/api/Qtech/documents');
      setDocuments(updatedDocsResponse.data);
 
      
      setEditingDocId(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document');
    }
  };
 
  const handleOpenPdf = (doc) => {
    setSelectedPdf(doc);
  };
 
  const handleClosePdf = () => {
    setSelectedPdf(null);
  };
 

  const handleDownload = (doc) => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${doc.fileContent}`;
    link.download = doc.fileName || 'document.pdf';
    link.click();
  };
 
  const handleDeleteDoc = async (documentId) => {
    if (!documentId) {
      alert("Document ID is missing.");
      return;
    }
 
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;
 
    try {
      await axios.delete(`http://localhost:5104/api/Qtech/document/${documentId}`);
      setDocuments(documents.filter((doc) => doc.docId !== documentId));
    } catch (error) {
      console.error("Error deleting document:", error.response ? error.response.data : error.message);
      alert("Error deleting document: " + error.message);
    }
  };
 
  
  if (selectedPdf) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-4/5 h-200 max-w-6xl relative mt-50">
          <button
            onClick={handleClosePdf}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Close
          </button>
          <iframe
            src={`data:application/pdf;base64,${selectedPdf.fileContent}`}
            width="100%"
            height="100%"
            title={selectedPdf.fileName || selectedPdf.title}
            className="mt-10"
          >
            <p>
              Your browser does not support PDFs.
              <a
                href={`data:application/pdf;base64,${selectedPdf.fileContent}`}
                download={selectedPdf.fileName || selectedPdf.title}
              >
                Download the PDF
              </a>.
            </p>
          </iframe>
        </div>
      </div>
    );
  }
 
  return (
    <div className="w-full p-6 mt-5 ">
      <button
        onClick={() => navToPlaylist(role)}
        className="mt-4 px-4 py-2 mb-4 ml-5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition"
      >
        Back to Playlist
      </button>
     

      {!playlistId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist.playlistId} className="border p-3 rounded-lg shadow-sm bg-purple-800 w-11/12 mx-auto">
              <img
                src={playlist.imageUrl || playlist.img}
                alt={playlist.title}
                className="w-full h-32 object-cover rounded-md"
                onError={(e) => {
                  console.error(`Image failed to load: ${playlist.imageUrl}`);
                  e.target.src = playlist.img || "/fallback-image.jpg";
                }}
              />
              <p className="mt-2 text-center font-medium text-sm text-white">{playlist.title}</p>
              <p className="text-xs text-white text-center">{playlist.description}</p>
              <div className="flex gap-2 justify-center mt-2">
                <button
                  className="border border-purple-600 px-3 py-1 text-xs rounded cursor-pointer bg-teal-200 hover:bg-purple-400 hover:text-white transition"
                  onClick={() => handleSelectPlaylist(playlist)}
                >
                  Documents
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
 

      {selectedPlaylist && (
        <div ref={docContainerRef} className="mt-6 p-4 rounded-lg shadow-lg w-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Documents for {selectedPlaylist.title}
          </h3>
 
          {documents.filter(doc => doc.playlistId === selectedPlaylist.playlistId).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {documents.filter(doc => doc.playlistId === selectedPlaylist.playlistId).map((doc) => (
                <div key={doc.docId} className="border-2 border-violet-800 rounded-lg p-3 shadow-md bg-white flex flex-col items-center w-full">
                  <h4 className="font-medium mt-2 text-sm">{doc.title}</h4>
                 

                  {doc.fileContent && (
                    <div className="relative w-full h-32 overflow-hidden mb-2 mt-2">
                      <iframe
                        src={`data:application/pdf;base64,${doc.fileContent}`}
                        width="100%"
                        height="200"
                        title={doc.fileName || "PDF Preview"}
                        className="absolute transform scale-90 origin-top-left pointer-events-none"
                      ></iframe>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
                    </div>
                  )}
                 
          
                  <div className="flex gap-3 mt-3 w-full justify-center">
                    <button
                      onClick={() => handleOpenPdf(doc)}
                      className="px-4 py-2 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition flex items-center"
                    >
                      <FaEye className="mr-1" /> View
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="px-4 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteDoc(doc.docId)}
                      className="px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition flex items-center"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No documents available</p>
          )}
         
      
          {!playlistId && (
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
              onClick={() => setSelectedPlaylist(null)}
            >
              Close
            </button>
          )}
        </div>
      )}
 
   
      {editingDocId && (
        <div ref={editFormRef} className="w-2/3 mx-auto p-4 bg-teal-100 rounded shadow mt-6 border">
          <h2 className="text-md font-medium mb-3">Update Document</h2>
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 rounded w-2/3 text-sm block mb-2 bg-white"
          />
          <div className="flex gap-3">
            <button
              onClick={handleUpdateDoc}
              className="px-4 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center"
              disabled={!selectedFile}
            >
              <FaCheck className="mr-1" /> Update
            </button>
            <button
              onClick={() => {
                setEditingDocId(null);
                setSelectedFile(null);
              }}
              className="px-4 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 flex items-center"
            >
              <FaTimes className="mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default AdminDocs;
 