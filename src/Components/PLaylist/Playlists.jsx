import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { FaPlus, FaVideo, FaFileAlt, FaEdit, FaTrash, FaEye, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';
 
const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [videos, setVideos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ 
    title: '', 
    description: '', 
    imageUrl: '',
    videos: [],
    documents: []
  });
  const [showAddPlaylistModal, setShowAddPlaylistModal] = useState(false);
  const [showEditPlaylistModal, setShowEditPlaylistModal] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ 
    title: '', 
    description: '', 
    imageUrl: '',
    videos: [{ title: '', url: '', imageUrl: '' }],
    documents: [{ title: '', content: '', file: null }]
  });
  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [viewVideo, setViewVideo] = useState(false);
  const [viewDoc, setViewDoc] = useState(false);
  
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
 
  useEffect(() => {
    fetchAllData();
  }, []);
 
  const fetchAllData = () => {
   
    axios.get('http://localhost:5104/api/Qtech/Playlists')
      .then(res => setPlaylists(res.data))
      .catch(err => alert("Error fetching playlists: " + err.message));
 
   
    axios.get('http://localhost:5104/api/Qtech/Videos')
      .then(res => {
        console.log("Fetched Videos:", res.data);
        setVideos(res.data);
        
        if (selectedPlaylistId) {
          setFilteredVideos(res.data.filter(video => video.playlistId === selectedPlaylistId));
        }
      })
      .catch(err => console.error("Error fetching videos:", err));
 

    axios.get('http://localhost:5104/api/Qtech/documents')
      .then(res => {
        setDocuments(res.data);
        
        if (selectedPlaylistId) {
          setFilteredDocuments(res.data.filter(doc => doc.playlistId === selectedPlaylistId));
        }
      })
      .catch(err => alert("Error fetching documents: " + err.message));
  };
 
  const deletePlaylist = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this playlist? This action cannot be undone.");
    
    if (confirmDelete) {
      axios.delete(`http://localhost:5104/api/Qtech/Playlists/${id}`)
        .then(() => {
          alert("Deleted successfully");
          setPlaylists(playlists.filter(playlist => playlist.playlistId !== id));
        })
        .catch((err) => alert("Error: " + err.message));
    }
  };
 
  const handleViewVideo = (playlistId) => {
    navigate(`/AdminVideos/${playlistId}`);
  };
 
  const handleViewDocs = (playlistId) => {
    navigate(`/adminDocs/${playlistId}`);
  };
 
  const handleViewClick = (id) => {
    if (selectedPlaylistId === id) {
      setSelectedPlaylistId(null);
      setFilteredVideos([]);
      setFilteredDocuments([]);
    } else {
      setSelectedPlaylistId(id);
      setFilteredVideos(videos.filter(video => video.playlistId === id));
      setFilteredDocuments(documents.filter(doc => doc.playlistId === id));
    }
  };
 
  const handleEditClick = (playlist) => {
    setEditingId(playlist.playlistId);
    
   
    const playlistVideos = videos.filter(video => video.playlistId === playlist.playlistId);
    const playlistDocuments = documents.filter(doc => doc.playlistId === playlist.playlistId);
    
    setEditData({
      title: playlist.title,
      description: playlist.description,
      imageUrl: playlist.imageUrl || '',
      videos: playlistVideos.length > 0 ? playlistVideos : [],
      documents: playlistDocuments.length > 0 ? playlistDocuments : []
    });
    

    setShowEditPlaylistModal(true);
  };
  
  const handleEditVideoChange = (index, field, value) => {
    const updatedVideos = [...editData.videos];
    updatedVideos[index] = { ...updatedVideos[index], [field]: value };
    setEditData({ ...editData, videos: updatedVideos });
  };
  

  const handleEditDocumentChange = (index, field, value) => {
    const updatedDocuments = [...editData.documents];
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
    setEditData({ ...editData, documents: updatedDocuments });
  };
  

  const addEditVideoField = () => {
    setEditData({
      ...editData,
      videos: [...editData.videos, { 
        playlistId: editingId, 
        title: '', 
        url: '', 
        imageUrl: '' 
      }]
    });
  };

  const addEditDocumentField = () => {
    setEditData({
      ...editData,
      documents: [...editData.documents, { 
        playlistId: editingId, 
        title: '', 
        content: '', 
        fileContent: null,
        fileName: '',
        newFile: null 
      }]
    });
  };
  

  const removeEditVideoField = (index) => {
    const updatedVideos = [...editData.videos];
    updatedVideos.splice(index, 1);
    setEditData({ ...editData, videos: updatedVideos });
  };
  
 
  const removeEditDocumentField = (index) => {
    const updatedDocuments = [...editData.documents];
    updatedDocuments.splice(index, 1);
    setEditData({ ...editData, documents: updatedDocuments });
  };
  

  const handleEditFileChange = (index, e) => {
    const updatedDocuments = [...editData.documents];
    updatedDocuments[index] = { 
      ...updatedDocuments[index], 
      newFile: e.target.files[0],
      isFileUpdated: true
    };
    setEditData({ ...editData, documents: updatedDocuments });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setShowEditPlaylistModal(false);
  };

  const handleEditSave = async (id) => {
    try {
   
      await axios.patch(`http://localhost:5104/api/Qtech/Playlists/Edit/${id}`, {
        title: editData.title,
        description: editData.description,
        imageUrl: editData.imageUrl
      });
      
    
      const videoPromises = editData.videos.map(async (video) => {
        if (video.videoId) {
         
          return axios.patch(`http://localhost:5104/api/Qtech/Videos/Edit/${video.videoId}`, {
            title: video.title,
            url: video.url,
            imageUrl: video.imageUrl || "https://via.placeholder.com/150"
          });
        } else if (video.title && video.url) {
         
          return axios.post("http://localhost:5104/api/Qtech/Videos", {
            playlistId: id,
            title: video.title,
            url: video.url,
            imageUrl: video.imageUrl || "https://via.placeholder.com/150"
          });
        }
        return null;
      }).filter(Boolean);
      
   
      const documentPromises = editData.documents.map(async (doc) => {
        if (doc.documentId && !doc.isFileUpdated) {
         
          return axios.patch(`http://localhost:5104/api/Qtech/Documents/Edit/${doc.documentId}`, {
            title: doc.title,
            content: doc.content
          });
        } else if (doc.documentId && doc.isFileUpdated && doc.newFile) {
         
          const formData = new FormData();
          formData.append('title', doc.title);
          formData.append('content', doc.content);
          formData.append('file', doc.newFile);
          formData.append('updatedAt', new Date().toISOString());
          
          return axios.patch(`http://localhost:5104/api/Qtech/Documents/UpdateWithFile/${doc.documentId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else if (!doc.documentId && doc.title && doc.newFile) {
        
          const formData = new FormData();
          formData.append('playlistId', id);
          formData.append('title', doc.title);
          formData.append('content', doc.content || '');
          formData.append('file', doc.newFile);
          formData.append('createdAt', new Date().toISOString());
          formData.append('updatedAt', new Date().toISOString());
          
          return axios.post("http://localhost:5104/api/Qtech/upload", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
        return null;
      }).filter(Boolean);
      

      await Promise.all([...videoPromises, ...documentPromises]);
      
      alert("Playlist with videos and documents updated successfully!");
      setEditingId(null);
      setShowEditPlaylistModal(false);
      fetchAllData();
      
    } catch (err) {
      console.error("Error updating playlist with content:", err);
      alert("Failed to update playlist with content: " + err.message);
    }
  };
 

  const openAddPlaylistModal = () => {
    setShowAddPlaylistModal(true);
    setNewPlaylist({ 
      title: '', 
      description: '', 
      imageUrl: '',
      videos: [{ title: '', url: '', imageUrl: '' }],
      documents: [{ title: '', content: '', file: null }]
    });
  };
 
  const handlePlaylistChange = (e) => {
    setNewPlaylist({ ...newPlaylist, [e.target.name]: e.target.value });
  };

  const handlePlaylistVideoChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVideos = [...newPlaylist.videos];
    updatedVideos[index] = { ...updatedVideos[index], [name]: value };
    setNewPlaylist({ ...newPlaylist, videos: updatedVideos });
  };
  

  const handlePlaylistDocumentChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDocuments = [...newPlaylist.documents];
    updatedDocuments[index] = { ...updatedDocuments[index], [name]: value };
    setNewPlaylist({ ...newPlaylist, documents: updatedDocuments });
  };
  

  const handlePlaylistFileChange = (index, e) => {
    const updatedDocuments = [...newPlaylist.documents];
    updatedDocuments[index] = { ...updatedDocuments[index], file: e.target.files[0] };
    setNewPlaylist({ ...newPlaylist, documents: updatedDocuments });
  };

  const addVideoField = () => {
    setNewPlaylist({
      ...newPlaylist,
      videos: [...newPlaylist.videos, { title: '', url: '', imageUrl: '' }]
    });
  };
  

  const addDocumentField = () => {
    setNewPlaylist({
      ...newPlaylist,
      documents: [...newPlaylist.documents, { title: '', content: '', file: null }]
    });
  };
  

  const removeVideoField = (index) => {
    const updatedVideos = [...newPlaylist.videos];
    updatedVideos.splice(index, 1);
    setNewPlaylist({ ...newPlaylist, videos: updatedVideos });
  };
 
  const removeDocumentField = (index) => {
    const updatedDocuments = [...newPlaylist.documents];
    updatedDocuments.splice(index, 1);
    setNewPlaylist({ ...newPlaylist, documents: updatedDocuments });
  };
  

  const handleAddPlaylistWithContent = async () => {
    if (!newPlaylist.title || !newPlaylist.description) {
      alert("Please fill in the required playlist fields (title and description)");
      return;
    }
    
    try {
   
      const playlistResponse = await axios.post("http://localhost:5104/api/Qtech/Playlists", {
        title: newPlaylist.title,
        description: newPlaylist.description,
        imageUrl: newPlaylist.imageUrl || "https://via.placeholder.com/150"
      });
      
      const newPlaylistId = playlistResponse.data.playlistId;
      

      const videoPromises = newPlaylist.videos.map(async (video) => {
        if (video.title && video.url) {
          return axios.post("http://localhost:5104/api/Qtech/Videos", {
            playlistId: newPlaylistId,
            title: video.title,
            url: video.url,
            imageUrl: video.imageUrl || "https://via.placeholder.com/150"
          });
        }
        return null;
      }).filter(Boolean);
      
   
      const documentPromises = newPlaylist.documents.map(async (doc) => {
        if (doc.title && doc.file) {
          const formData = new FormData();
          formData.append('playlistId', newPlaylistId);
          formData.append('title', doc.title);
          formData.append('content', doc.content || '');
          formData.append('file', doc.file);
          formData.append('createdAt', new Date().toISOString());
          formData.append('updatedAt', new Date().toISOString());
          
          return axios.post("http://localhost:5104/api/Qtech/upload", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
        return null;
      }).filter(Boolean);
      
 
      await Promise.all([...videoPromises, ...documentPromises]);
      
      alert("Playlist with videos and documents added successfully!");
      setShowAddPlaylistModal(false);
      fetchAllData();
    } catch (err) {
      console.error("Error adding playlist with content:", err);
      alert("Failed to add playlist with content: " + err.message);
    }
  };
 
  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="h-10 w-1 bg-purple-600 mr-3"></div>
          <h1 className="text-3xl font-bold text-gray-800">Playlists</h1>
        </div>
        <button
          onClick={openAddPlaylistModal}
          className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md"
        >
          <FaPlus size={16} /> Add Playlist
        </button>
      </div>
   
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div key={playlist.playlistId} className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-purple-100">
            <div className="relative">
              <img
                src={playlist.imageUrl || "https://via.placeholder.com/400x200"}
                alt={playlist.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x200";
                }}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/10 to-purple-900/60"></div>
            </div>
            
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{playlist.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{playlist.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => handleViewVideo(playlist.playlistId)}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-sm font-medium"
                >
                  <FaVideo /> Videos
                </button>
                
                <button
                  onClick={() => handleViewDocs(playlist.playlistId)}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-sm font-medium"
                >
                  <FaFileAlt /> Documents
                </button>
              </div>
              
              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                <button
                  onClick={() => handleEditClick(playlist)}
                  className="flex items-center gap-2 px-3 py-1 text-purple-600 hover:text-purple-800 transition text-sm font-medium"
                >
                  <FaEdit /> Edit
                </button>
                
                <button
                  onClick={() => deletePlaylist(playlist.playlistId)}
                  className="flex items-center gap-2 px-3 py-1 text-red-500 hover:text-red-700 transition text-sm font-medium"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
            
            {selectedPlaylistId === playlist.playlistId && (
              <div className="bg-purple-50 p-6 rounded-b-xl border-t border-purple-100">
                <h3 className="text-lg font-semibold mb-4 text-purple-800">Content</h3>
                
                {filteredVideos.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-3 text-gray-700 flex items-center gap-2">
                      <FaVideo className="text-purple-500" /> Videos
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {filteredVideos.map((video, index) => (
                        <div key={index} className="border border-purple-100 rounded-lg p-3 shadow-sm bg-white flex justify-between items-center">
                          <h5 className="font-medium text-gray-800">{video.title}</h5>
                          <a 
                            href={video.url} 
                            className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center gap-1" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Watch <FaEye />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
  
                {filteredDocuments.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium mb-3 text-gray-700 flex items-center gap-2">
                      <FaFileAlt className="text-purple-500" /> Documents
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {filteredDocuments.map((doc, index) => (
                        <div key={index} className="border border-purple-100 rounded-lg p-3 shadow-sm bg-white">
                          <h5 className="font-medium mb-2 text-gray-800">{doc.title}</h5>
                          {doc.content && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.content}</p>}
                          <a
                            href={`data:application/pdf;base64,${doc.fileContent}`}
                            download={doc.fileName}
                            className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center gap-1"
                          >
                            Download PDF <FaFileAlt />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {filteredVideos.length === 0 && filteredDocuments.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No content available for this playlist</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
    
      {showAddPlaylistModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-800 flex items-center">
                <div className="h-8 w-1 bg-purple-600 mr-3"></div>
                Add Playlist
              </h2>
              <button onClick={() => setShowAddPlaylistModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b text-purple-700">Playlist Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newPlaylist.title}
                    onChange={handlePlaylistChange}
                    className="border border-purple-200 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Enter playlist title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={newPlaylist.description}
                    onChange={handlePlaylistChange}
                    className="border border-purple-200 p-3 w-full rounded-lg min-h-24 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Enter playlist description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={newPlaylist.imageUrl}
                    onChange={handlePlaylistChange}
                    className="border border-purple-200 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Enter image URL (optional)"
                  />
                </div>
              </div>
            </div>
            
           
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                  <FaVideo /> Videos
                </h3>
                <button
                  onClick={addVideoField}
                  className="flex items-center gap-1 text-sm px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md"
                >
                  <FaPlus size={12} /> Add Video
                </button>
              </div>
              
              {newPlaylist.videos.map((video, index) => (
                <div key={index} className="p-4 mb-4 border rounded-lg bg-purple-50 shadow-sm">
                  <div className="flex justify-between">
                    <h4 className="font-medium mb-2 text-purple-700 flex items-center gap-2">
                      <FaVideo /> Video {index + 1}
                    </h4>
                    <button 
                      onClick={() => removeVideoField(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={newPlaylist.videos.length === 1}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
                      <input
                        type="text"
                        name="title"
                        value={video.title}
                        onChange={(e) => handlePlaylistVideoChange(index, e)}
                        className="border border-purple-200 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="Enter video title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                      <input
                        type="text"
                        name="url"
                        value={video.url}
                        onChange={(e) => handlePlaylistVideoChange(index, e)}
                        className="border border-purple-200 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="Enter video URL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                      <input
                        type="text"
                        name="imageUrl"
                        value={video.imageUrl}
                        onChange={(e) => handlePlaylistVideoChange(index, e)}
                        className="border border-purple-200 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="Enter thumbnail URL (optional)"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
         
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                  <FaFileAlt /> Documents
                </h3>
                <button
                  onClick={addDocumentField}
                  className="flex items-center gap-1 text-sm px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md"
                >
                  <FaPlus size={12} /> Add Document
                </button>
              </div>
              
              {newPlaylist.documents.map((document, index) => (
                <div key={index} className="p-4 mb-4 border rounded-lg bg-purple-50 shadow-sm">
                  <div className="flex justify-between">
                    <h4 className="font-medium mb-2 text-purple-700 flex items-center gap-2">
                      <FaFileAlt /> Document {index + 1}
                    </h4>
                    <button 
                      onClick={() => removeDocumentField(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={newPlaylist.documents.length === 1}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                      <input
                        type="text"
                        name="title"
                        value={document.title}
                        onChange={(e) => handlePlaylistDocumentChange(index, e)}
                       
                        className="border border-purple-200 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="Enter document title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Document Content</label>
                      <textarea
                        name="content"
                        value={document.content}
                        onChange={(e) => handlePlaylistDocumentChange(index, e)}
                        className="border border-purple-200 p-2 w-full rounded-lg min-h-24 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        placeholder="Enter document content (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF</label>
                      <input
                        type="file"
                        onChange={(e) => handlePlaylistFileChange(index, e)}
                        className="border border-purple-200 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                        accept="application/pdf"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddPlaylistWithContent}
                className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md"
              >
                Add Playlist
              </button>
              <button
                onClick={() => setShowAddPlaylistModal(false)}
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition shadow-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
  

{showEditPlaylistModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-800 flex items-center">
          <div className="h-8 w-1 bg-purple-600 mr-3"></div>
          Edit Playlist
        </h2>
        <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>
      </div>
      
   
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b text-purple-700">Playlist Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Title *</label>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              className="border border-purple-200 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter playlist title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={editData.description}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              className="border border-purple-200 p-3 w-full rounded-lg min-h-24 focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter playlist description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={editData.imageUrl}
              onChange={(e) => setEditData({...editData, imageUrl: e.target.value})}
              className="border border-purple-200 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter image URL (optional)"
            />
          </div>
        </div>
      </div>
      
  
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
            <FaVideo /> Videos
          </h3>
          <button
            onClick={addEditVideoField}
            className="flex items-center gap-1 text-sm px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md"
          >
            <FaPlus size={12} /> Add Video
          </button>
        </div>
        
        {editData.videos.map((video, index) => (
          <div key={index} className="p-4 mb-4 border rounded-lg bg-purple-50 shadow-sm">
            <div className="flex justify-between">
              <h4 className="font-medium mb-2 text-purple-700 flex items-center gap-2">
                <FaVideo /> Video {index + 1}
              </h4>
              <button 
                onClick={() => removeEditVideoField(index)}
                className="text-red-500 hover:text-red-700"
                disabled={editData.videos.length === 1}
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
                <input
                  type="text"
                  value={video.title || ''}
                  onChange={(e) => handleEditVideoChange(index, 'title', e.target.value)}
                  className="border border-purple-200 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter video title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input
                  type="text"
                  value={video.url || ''}
                  onChange={(e) => handleEditVideoChange(index, 'url', e.target.value)}
                  className="border border-purple-200 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter video URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  value={video.imageUrl || ''}
                  onChange={(e) => handleEditVideoChange(index, 'imageUrl', e.target.value)}
                  className="border border-purple-200 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter thumbnail URL (optional)"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
  
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
            <FaFileAlt /> Documents
          </h3>
          <button
            onClick={addEditDocumentField}
            className="flex items-center gap-1 text-sm px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md"
          >
            <FaPlus size={12} /> Add Document
          </button>
        </div>
        
        {editData.documents.map((document, index) => (
          <div key={index} className="p-4 mb-4 border rounded-lg bg-purple-50 shadow-sm">
            <div className="flex justify-between">
              <h4 className="font-medium mb-2 text-purple-700 flex items-center gap-2">
                <FaFileAlt /> Document {index + 1}
              </h4>
              <button 
                onClick={() => removeEditDocumentField(index)}
                className="text-red-500 hover:text-red-700"
                disabled={editData.documents.length === 1}
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={document.title || ''}
                  onChange={(e) => handleEditDocumentChange(index, 'title', e.target.value)}
                  className="border border-purple-200 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter document title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Content</label>
                <textarea
                  value={document.content || ''}
                  onChange={(e) => handleEditDocumentChange(index, 'content', e.target.value)}
                  className="border border-purple-200 p-2 w-full rounded-lg min-h-24 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter document content (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF</label>
                <input
                  type="file"
                  onChange={(e) => handleEditFileChange(index, e)}
                  className="border border-purple-200 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  accept="application/pdf"
                />
                {document.fileName && (
                  <p className="text-sm text-gray-500 mt-1">Current file: {document.fileName}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
        
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleEditSave(editingId)}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md"
        >
          Save Changes
        </button>
        <button
          onClick={handleCancelEdit}
          className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition shadow-md"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};
 
export default Playlists;