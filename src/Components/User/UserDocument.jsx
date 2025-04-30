import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDocument = ({ playlistId, onClose, showAllDocuments = false }) => {
    const [pdfs, setPdfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editId, setEditId] = useState(null);
    const [selectedPdf, setSelectedPdf] = useState(null);

    useEffect(() => {
        const fetchPdfs = async () => {
            try {
                let response;
                
                if (showAllDocuments) {
                 
                    response = await axios.get('http://localhost:5104/api/Qtech/documents');
                } else if (playlistId) {
                   
                    response = await axios.get(`http://localhost:5104/api/Qtech/documents/${playlistId}`);
                }

                setPdfs(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch documents. Please try again.");
                setLoading(false);
                console.error("Error fetching documents:", error);
            }
        };

        if (showAllDocuments || playlistId) {
            fetchPdfs();
        }
    }, [playlistId, showAllDocuments]);

    const handleDownload = (pdf) => {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${pdf.fileContent}`;
        link.download = pdf.fileName;
        link.click();
    };

    const handleOpenPdf = (pdf) => {
        setSelectedPdf(pdf);
    };

    const handleClosePdf = () => {
        setSelectedPdf(null);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleEdit = (id) => {
        setEditId(id);
    };

    const handleDelete = async (id) => {
        try {
          
            await axios.delete(`http://localhost:5104/api/Qtech/document/${id}`);
            setPdfs(pdfs.filter(pdf => pdf.docId !== id));
        } catch (error) {
            console.error('Error deleting PDF:', error);
        }
    };

    const handleUpdate = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await axios.put(`http://localhost:5104/api/Qtech/update-pdf/${editId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setEditId(null);
            setSelectedFile(null);
          
            let updatedDocsResponse;
            if (showAllDocuments) {
                updatedDocsResponse = await axios.get('http://localhost:5104/api/Qtech/documents');
            } else if (playlistId) {
                updatedDocsResponse = await axios.get(`http://localhost:5104/api/Qtech/documents/${playlistId}`);
            }
            
            setPdfs(updatedDocsResponse.data);
        } catch (error) {
            console.error('Error updating PDF:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-400">{error}</div>;
    }

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
                        title={selectedPdf.fileName}
                        className="mt-10"
                    >
                        <p>
                            Your browser does not support PDFs. 
                            <a 
                                href={`data:application/pdf;base64,${selectedPdf.fileContent}`} 
                                download={selectedPdf.fileName}
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
        <div className="inset-0 bg-gradient-to-br from-purple-50 to-purple-100 bg-opacity-75 flex justify-center items-center py-8">
          <div className="bg-white p-8 rounded-xl shadow-xl w-2/3 max-w-3xl border border-purple-200 mt-5 relative overflow-hidden">
        
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-100 rounded-tr-full opacity-50"></div>
           
            <div className="relative z-10">
              <h1 className="text-2xl font-bold mb-1 text-center text-purple-700">
                {showAllDocuments ? 'All Documents' : 'Playlist Documents'}
              </h1>
              <div className="flex items-center justify-center mb-6">
                <div className="h-1 w-16 bg-purple-600 rounded-full"></div>
                <div className="h-2 w-2 mx-2 bg-purple-400 rounded-full"></div>
                <div className="h-1 w-16 bg-purple-600 rounded-full"></div>
              </div>
            </div>
      
            {pdfs.length === 0 ? (
              <div className="text-center py-10 bg-purple-50 rounded-lg border border-dashed border-purple-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-center font-medium">
                  {showAllDocuments 
                    ? 'No documents available.' 
                    : 'No documents available for this playlist.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pdfs.map((pdf) => (
                  <div 
                    key={pdf.docId} 
                    className="border p-5 rounded-xl shadow-md bg-gradient-to-br from-purple-200 to-purple-00 text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                  >
                    <div className="flex items-start mb-3">

                      <h2 className="text-lg font-semibold text-black truncate flex-1">
                        {pdf.title}
                      </h2>
                    </div>
                    <p className="mt-2 text-xs text-purple-900 line-clamp-2 mb-3">{pdf.content}</p>
                    <div className="flex space-x-2 mt-4">
                      <button 
                        onClick={() => handleOpenPdf(pdf)}
                        className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all duration-300 font-medium flex-1 flex items-center justify-center group-hover:shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Open
                      </button>
                      <button 
                        onClick={() => handleDownload(pdf)}
                        className="bg-purple-800 text-white px-4 py-2 rounded-lg hover:bg-purple-900 transition-all duration-300 font-medium flex-1 flex items-center justify-center border border-purple-500 group-hover:shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
     
            {editId && (
              <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit PDF
                </h3>
                <div className="mt-4 flex flex-col sm:flex-row items-center">
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="mt-2 text-purple-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 flex-1" 
                  />
                  <button 
                    onClick={handleUpdate} 
                    className="mt-4 sm:mt-2 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-500 transition-all duration-300 font-medium flex items-center sm:ml-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Update
                  </button>
                </div>
              </div>
            )}
      
    
            <button
              onClick={onClose}
              className="mt-8 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 font-medium flex items-center mx-auto shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
        </div>
      );
};

export default UserDocument;