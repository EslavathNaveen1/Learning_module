import React, { useEffect, useState, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
 
import AuthContext from "../AuthContext";
 
const ManagerUsers = () => {
    const { mail } = useContext(AuthContext);
 
    const [users, setUsers] = useState([]);
    const [enrollmentRequests, setEnrollmentRequests] = useState([]);
    const [groupedPendingEnrollments, setGroupedPendingEnrollments] = useState({});
    const [groupedApprovedEnrollments, setGroupedApprovedEnrollments] = useState({});
    const [allEnrollments, setAllEnrollments] = useState({}); 
    const [playlists, setPlaylists] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [editUser, setEditUser] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [nameSearchTerm, setNameSearchTerm] = useState(''); 
    const [emailSearchTerm, setEmailSearchTerm] = useState(''); 
    const [playlistSearchTerm, setPlaylistSearchTerm] = useState(''); 
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Users');
 
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/Users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
 
        const fetchEnrollmentRequests = async () => {
            try {
                const response = await axios.get('https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/EnrolledPlaylistIds', {
                    params: {
                        userEmail: mail
                    }
                });
               
                const requestDetails = await Promise.all(
                    response.data.map(async (playlistId) => {
                        try {
                            const playlistResponse = await axios.get(`https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/Playlist/${playlistId}`);
                            const userResponse = await axios.get(`https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/UserByPlaylist/${playlistId}`);
                           
                            return {
                                playlistId: playlistId,
                                playlistName: playlistResponse.data.name,
                                user: userResponse.data
                            };
                        } catch (detailError) {
                            console.error(`Error fetching details for playlist ${playlistId}:`, detailError);
                            return null;
                        }
                    })
                );
       
                setEnrollmentRequests(requestDetails.filter(request => request !== null));
            } catch (error) {
                console.error('Error fetching enrollment requests:', error);
            }
        };
 
        const fetchAllEnrollments = async () => {
            try {
              
                const pendingResponse = await axios.get('https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/enrolleds/pending');
                const pendingData = pendingResponse.data;
               
              
                const approvedResponse = await axios.get('https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/enrolleds/approved');
                const approvedData = approvedResponse.data;
               
               
                const groupedPending = pendingData.reduce((acc, item) => {
                    if (!acc[item.userId]) {
                        acc[item.userId] = [];
                    }
                    acc[item.userId].push({...item, status: 'pending'});
                    return acc;
                }, {});
               
                
                const groupedApproved = approvedData.reduce((acc, item) => {
                    if (!acc[item.userId]) {
                        acc[item.userId] = [];
                    }
                    acc[item.userId].push({...item, status: 'approved'});
                    return acc;
                }, {});
               
             
                const combined = {};
               
               
                Object.keys(groupedPending).forEach(userId => {
                    if (!combined[userId]) {
                        combined[userId] = [];
                    }
                    combined[userId] = [...combined[userId], ...groupedPending[userId]];
                });
               
              
                Object.keys(groupedApproved).forEach(userId => {
                    if (!combined[userId]) {
                        combined[userId] = [];
                    }
                    combined[userId] = [...combined[userId], ...groupedApproved[userId]];
                });
               
                setGroupedPendingEnrollments(groupedPending);
                setGroupedApprovedEnrollments(groupedApproved);
                setAllEnrollments(combined);
               
              
                const playlistsResponse = await axios.get('https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/playlists');
                const playlistsData = playlistsResponse.data.reduce((acc, playlist) => {
                    acc[playlist.playlistId] = playlist.title;
                    return acc;
                }, {});
                setPlaylists(playlistsData);
            } catch (error) {
                console.error('Error fetching enrollments:', error);
            }
        };
 
        fetchUsers();
        fetchEnrollmentRequests();
        fetchAllEnrollments();
    }, [mail]);
 
    const handleDelete = (userid) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            axios.delete(`https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/Users/${userid}`)
                .then(() => {
                    alert("Deleted successfully");
                    setUsers(users.filter(user => user.employeeId !== userid));
                })
                .catch(() => alert("Retry"));
        }
    };
 
    const handleEdit = (user) => {
        setIsEdit(true);
        setEditUser(user);
    };
 
    const handleSave = () => {
        axios.patch(`https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/Users/${editUser.employeeId}`, editUser)
            .then(() => {
                alert("Updated successfully");
                setUsers(users.map(user => user.employeeId === editUser.employeeId ? editUser : user));
                setIsEdit(false);
            })
            .catch((err) => {
                console.error("Error updating user:", err.response ? err.response.data : err.message);
                alert("Retry");
            });
    };
 
    const handleAcceptRequest = async (playlistId) => {
        try {
            await axios.post(`https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/AcceptPlaylistRequest/${playlistId}`);
            setEnrollmentRequests(enrollmentRequests.filter(request => request.playlistId !== playlistId));
       
            const updatedEnrollments = await axios.get('https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/enrolleds/approved');
            const approvedData = updatedEnrollments.data;
           
            const groupedApproved = approvedData.reduce((acc, item) => {
                if (!acc[item.userId]) {
                    acc[item.userId] = [];
                }
                acc[item.userId].push({...item, status: 'approved'});
                return acc;
            }, {});
           
            setGroupedApprovedEnrollments(groupedApproved);
  
            const combined = {...allEnrollments};
            Object.keys(groupedApproved).forEach(userId => {
                if (!combined[userId]) {
                    combined[userId] = [];
                }
               
                combined[userId] = combined[userId].filter(item =>
                    !(item.playlistId === playlistId && item.status === 'pending')
                );
             
                const newApproved = groupedApproved[userId].filter(item => item.playlistId === playlistId);
                combined[userId] = [...combined[userId], ...newApproved];
            });
           
            setAllEnrollments(combined);
           
            alert('Playlist request accepted successfully');
        } catch (error) {
            console.error('Error accepting playlist request:', error);
            alert('Failed to accept playlist request');
        }
    };
 
    const handleRejectRequest = async (playlistId) => {
        try {
            await axios.post(`https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/RejectPlaylistRequest/${playlistId}`);
            setEnrollmentRequests(enrollmentRequests.filter(request => request.playlistId !== playlistId));
            alert('Playlist request rejected successfully');
        } catch (error) {
            console.error('Error rejecting playlist request:', error);
            alert('Failed to reject playlist request');
        }
    };
 
    const handleApproveAllPendingEnrollments = async () => {
        try {
            await axios.put('https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/enrolleds/approveAll');

            const approvedResponse = await axios.get('https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/enrolleds/approved');
            const approvedData = approvedResponse.data;
           
            const groupedApproved = approvedData.reduce((acc, item) => {
                if (!acc[item.userId]) {
                    acc[item.userId] = [];
                }
                acc[item.userId].push({...item, status: 'approved'});
                return acc;
            }, {});
           
     
            const updatedAllEnrollments = {...allEnrollments};
            Object.keys(updatedAllEnrollments).forEach(userId => {
                updatedAllEnrollments[userId] = updatedAllEnrollments[userId].map(item => ({
                    ...item,
                    status: 'approved'
                }));
            });
           
            setGroupedApprovedEnrollments(groupedApproved);
            setGroupedPendingEnrollments({}); 
            setAllEnrollments(updatedAllEnrollments);
           
            alert('All enrollments approved successfully');
        } catch (error) {
            console.error('Error approving all enrollments:', error);
            alert('Failed to approve all enrollments');
        }
    };
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditUser({ ...editUser, [name]: value });
    };
 
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
 
  
    const handleNameSearch = (e) => {
        setNameSearchTerm(e.target.value);
    };
   

    const handleEmailSearch = (e) => {
        setEmailSearchTerm(e.target.value);
    };
 

    const handlePlaylistSearch = (e) => {
        setPlaylistSearchTerm(e.target.value);
    };
   
  
    const handleUserSearch = (e) => {
        setUserSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email ? user.email.toLowerCase() : '';
       
        return (
            (nameSearchTerm === '' || fullName.includes(nameSearchTerm.toLowerCase())) &&
            (emailSearchTerm === '' || email.includes(emailSearchTerm.toLowerCase()))
        );
    });
 
    const handleDeclineAllForPlaylist = async (playlistId) => {
        const confirmDelete = window.confirm(`Are you sure you want to decline this playlist (${playlists[playlistId]}) for ALL users?`);
        if (!confirmDelete) return;
 
        try {
          
            const affectedUsers = [];
            Object.keys(allEnrollments).forEach(userId => {
                const hasPlaylist = allEnrollments[userId].some(enrollment => enrollment.playlistId === playlistId);
                if (hasPlaylist) {
                    affectedUsers.push(userId);
                }
            });
 
   
            for (const userId of affectedUsers) {
                const url = `https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/UnEnroll?userEmail=${userId}&playlistId=${playlistId}`;
                await axios.delete(url);
            }
 
            setAllEnrollments(prevData => {
                const updatedData = { ...prevData };
                Object.keys(updatedData).forEach(userId => {
                    updatedData[userId] = updatedData[userId].filter(item => item.playlistId !== playlistId);
                    if (updatedData[userId].length === 0) {
                        delete updatedData[userId];
                    }
                });
                return updatedData;
            });
           
            setGroupedPendingEnrollments(prevData => {
                const updatedData = { ...prevData };
                Object.keys(updatedData).forEach(userId => {
                    updatedData[userId] = updatedData[userId].filter(item => item.playlistId !== playlistId);
                    if (updatedData[userId].length === 0) {
                        delete updatedData[userId];
                    }
                });
                return updatedData;
            });
           
            setGroupedApprovedEnrollments(prevData => {
                const updatedData = { ...prevData };
                Object.keys(updatedData).forEach(userId => {
                    updatedData[userId] = updatedData[userId].filter(item => item.playlistId !== playlistId);
                    if (updatedData[userId].length === 0) {
                        delete updatedData[userId];
                    }
                });
                return updatedData;
            });
           
            alert(`Playlist "${playlists[playlistId]}" has been declined for all users`);
        } catch (error) {
            console.error('Error declining playlist for all users:', error);
            alert('Failed to decline playlist for all users. Please try again.');
        }
    };
 
const handleDecline = async (userEmail, playlistId) => {
    try {
        const url = `https://learningmodule-dac4fyf9dccpcfh7.centralindia-01.azurewebsites.net/api/Qtech/UnEnroll?userEmail=${userEmail}&playlistId=${playlistId}`;
        await axios.delete(url);

        setAllEnrollments(prevData => {
            const updatedData = { ...prevData };
            if (updatedData[userEmail]) {
                updatedData[userEmail] = updatedData[userEmail].filter(item => item.playlistId !== playlistId);
                if (updatedData[userEmail].length === 0) {
                    delete updatedData[userEmail];
                }
            }
            return updatedData;
        });
       
        setGroupedPendingEnrollments(prevData => {
            const updatedData = { ...prevData };
            if (updatedData[userEmail]) {
                updatedData[userEmail] = updatedData[userEmail].filter(item => item.playlistId !== playlistId);
                if (updatedData[userEmail].length === 0) {
                    delete updatedData[userEmail];
                }
            }
            return updatedData;
        });
       
        setGroupedApprovedEnrollments(prevData => {
            const updatedData = { ...prevData };
            if (updatedData[userEmail]) {
                updatedData[userEmail] = updatedData[userEmail].filter(item => item.playlistId !== playlistId);
                if (updatedData[userEmail].length === 0) {
                    delete updatedData[userEmail];
                }
            }
            return updatedData;
        });
       
        alert('Enrollment declined successfully');
    } catch (error) {
        console.error('Error declining request:', error);
        alert('Failed to decline request. Please try again.');
    }
};

const renderUserCard = (details, index) => {
    const isAdmin = details.role === 'Admin';
   
    return (
        <div
            key={index}
            className={`
                bg-white p-4 rounded-lg shadow-lg
                border-l-4 ${isAdmin ? 'border-l-purple-600' : 'border-l-indigo-400'}
                hover:shadow-xl transition-all duration-300 ease-in-out
                flex flex-col items-center text-center
            `}
        >
            <div
                className={`
                    w-16 h-16 flex items-center justify-center rounded-full text-lg font-bold
                    ${isAdmin ? 'bg-purple-600' : 'bg-indigo-400'} text-white shadow-md
                `}
            >
                {details.firstName.charAt(0)}{details.lastName.charAt(0)}
            </div>
            <h3 className="text-lg font-semibold mt-3 text-gray-800">{details.firstName} {details.lastName}</h3>
            <p className="text-gray-500 mt-1 text-sm">{details.email}</p>
            <p className={`text-sm mt-1 px-3 py-1 rounded-full ${isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'} font-medium`}>
                {details.role}
            </p>
            <div className="mt-4 flex gap-3">
                <button
                    onClick={() => handleDelete(details.employeeId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors duration-300 shadow-md"
                >
                    <DeleteIcon fontSize="small" />
                </button>
                <button
                    onClick={() => handleEdit(details)}
                    className="bg-[#A32CC4] hover:bg-purple-800 text-white px-3 py-2 rounded-lg transition-colors duration-300 shadow-md"
                >
                    <EditIcon fontSize="small" />
                </button>
            </div>
        </div>
    );
};

const renderEnrollmentRequestCard = (request, index) => {
    return (
        <div
            key={index}
            className={`
                bg-white p-4 rounded-lg shadow-lg
                border-l-4 border-l-[#A32CC4]
                hover:shadow-xl transition-all duration-300 ease-in-out
                flex flex-col items-center text-center
            `}
        >
            <div
                className={`
                    w-16 h-16 flex items-center justify-center rounded-full text-lg font-bold
                    bg-[#A32CC4] text-white shadow-md
                `}
            >
                {request.user.firstName.charAt(0)}{request.user.lastName.charAt(0)}
            </div>
            <h3 className="text-lg font-semibold mt-3 text-gray-800">
                {request.user.firstName} {request.user.lastName}
            </h3>
            <p className="text-gray-500 mt-1 text-sm">{request.user.email}</p>
            <div className="mt-2 bg-purple-100 p-2 rounded-lg text-sm text-purple-800 font-medium w-full">
                <p className="text-center">Playlist: {request.playlistName}</p>
            </div>
            <div className="mt-4 flex gap-3 w-full justify-center">
                <button
                    onClick={() => handleAcceptRequest(request.playlistId)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md flex items-center gap-1"
                >
                    <CheckIcon fontSize="small" /> Accept
                </button>
                <button
                    onClick={() => handleRejectRequest(request.playlistId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md flex items-center gap-1"
                >
                    <CloseIcon fontSize="small" /> Reject
                </button>
            </div>
        </div>
    );
};


const getAllPlaylistsData = () => {
    const playlistsMap = {};
   
    Object.keys(allEnrollments).forEach(userId => {
        allEnrollments[userId].forEach(enrollment => {
            const playlistId = enrollment.playlistId;
            const playlistTitle = playlists[playlistId] || `Playlist ${playlistId}`;
           
            if (!playlistsMap[playlistId]) {
                playlistsMap[playlistId] = {
                    id: playlistId,
                    title: playlistTitle,
                    userCount: 0,
                    pendingCount: 0,
                    approvedCount: 0
                };
            }
           
            playlistsMap[playlistId].userCount += 1;
            if (enrollment.status === 'pending') {
                playlistsMap[playlistId].pendingCount += 1;
            } else {
                playlistsMap[playlistId].approvedCount += 1;
            }
        });
    });
   
    return Object.values(playlistsMap);
};

const filteredPlaylists = getAllPlaylistsData().filter(playlist =>
    playlist.title.toLowerCase().includes(playlistSearchTerm.toLowerCase())
);

const filteredUserIds = userSearchTerm
    ? Object.keys(allEnrollments).filter(userId =>
        userId.toLowerCase().includes(userSearchTerm.toLowerCase())
      )
    : Object.keys(allEnrollments);

const renderEnrollmentCard = (userId) => {
 
    if (userSearchTerm && !userId.toLowerCase().includes(userSearchTerm.toLowerCase())) {
        return null;
    }

    const userEnrollments = allEnrollments[userId] || [];
   

    const filteredUserEnrollments = playlistSearchTerm
        ? userEnrollments.filter(item => {
            const playlistTitle = playlists[item.playlistId] || '';
            return playlistTitle.toLowerCase().includes(playlistSearchTerm.toLowerCase());
          })
        : userEnrollments;

    if (playlistSearchTerm && filteredUserEnrollments.length === 0) {
        return null;
    }
   
    return (
        <div key={userId} className="bg-white p-6 rounded-lg shadow-lg mb-4 w-full">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">User: {userId}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUserEnrollments.map((item, idx) => (
                    <div key={idx} className="border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-[#A32CC4]">Playlist ID: {item.playlistId}</span>
                            <span className={`px-2 py-1 ${item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} rounded-full text-xs`}>
                                {item.status === 'approved' ? 'Approved' : 'Pending'}
                            </span>
                        </div>
                        <p className="text-gray-700 font-medium mb-2">
                            {playlists[item.playlistId] || 'Loading...'}
                        </p>
                        <div className="mt-auto pt-2">
                            <button
                                onClick={() => handleDecline(userId, item.playlistId)}
                                className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600
                                transition-colors duration-300 text-sm font-medium shadow-md"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const renderPlaylistCard = (playlist) => {
    return (
        <div key={playlist.id} className="bg-white p-6 rounded-lg shadow-lg mb-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-700">{playlist.title}</h3>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {playlist.userCount} user{playlist.userCount !== 1 ? 's' : ''}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        {playlist.pendingCount} pending
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {playlist.approvedCount} approved
                    </span>
                </div>
            </div>
            <button
                onClick={() => handleDeclineAllForPlaylist(playlist.id)}
                className="w-80 mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600
                transition-colors duration-300 font-medium shadow-md flex items-center justify-center gap-2"
            >
                <CloseIcon fontSize="small" /> Decline for all users
            </button>
        </div>
    );
};

return (
    <div className="bg-gray-50 min-h-screen pb-8">
        {isEdit ? (
            <div className="flex flex-col items-center py-8 px-4 max-w-md mx-auto bg-white rounded-lg shadow-lg mt-6 ">
                <h2 className="text-xl font-bold mb-6 text-[#A32CC4]">Edit User</h2>
                <div className="w-full px-4">
                    <label className="block text-gray-700 font-medium mb-2">Select Role</label>
                    <select
                        name="role"
                        value={editUser.role}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>
                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleSave}
                        className="bg-[#A32CC4] text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors duration-300 shadow-md"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={() => setIsEdit(false)}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ) : (
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold text-[#A32CC4] mb-6">User Management</h1>
               
                <div className="flex justify-center mb-6">
                    <div className="inline-flex rounded-md shadow-md" role="group">
                        <button
                            onClick={() => setActiveTab('Users')}
                            className={`
                                px-6 py-3 text-sm font-medium
                                ${activeTab === 'Users'
                                    ? 'bg-[#A32CC4] text-white'
                                    : 'bg-white text-gray-700 hover:bg-purple-50'}
                                 rounded-l-lg transition-colors duration-300
                            `}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('Admins')}
                            className={`
                                px-6 py-3 text-sm font-medium
                                ${activeTab === 'Admins'
                                    ? 'bg-[#A32CC4] text-white'
                                    : 'bg-white text-gray-700 hover:bg-purple-50'}
                                border-t border-b border-r border-gray-200 transition-colors duration-300
                            `}
                        >
                            Admins
                        </button>
                        <button
                            onClick={() => setActiveTab('AllEnrollments')}
                            className={`
                                px-6 py-3 text-sm font-medium
                                ${activeTab === 'AllEnrollments'
                                    ? 'bg-[#A32CC4] text-white'
                                    : 'bg-white text-gray-700 hover:bg-purple-50'}
                                border-t border-b border-r border-gray-200 rounded-r-lg transition-colors duration-300
                            `}
                        >
                            All Enrollments
                        </button>
                    </div>
                </div>

                {(activeTab === 'Users' || activeTab === 'Admins') && (
                    <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-6">
                    
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon fontSize="small" className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={nameSearchTerm}
                                onChange={handleNameSearch}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                       
                     
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon fontSize="small" className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by email..."
                                value={emailSearchTerm}
                                onChange={handleEmailSearch}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                    </div>
                )}

              
                {activeTab === 'AllEnrollments' && (
                    <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-6">
                    
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon fontSize="small" className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by user email..."
                                value={userSearchTerm}
                                onChange={handleUserSearch}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                       
                        
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon fontSize="small" className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by playlist title..."
                                value={playlistSearchTerm}
                                onChange={handlePlaylistSearch}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                    </div>
                )}
               
               
                {activeTab === 'Users' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredUsers
                            .filter(user => user.role === 'User')
                            .map((user, index) => renderUserCard(user, index))}
                    </div>
                )}
               
                {activeTab === 'Admins' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredUsers
                            .filter(user => user.role === 'Admin'  ) 
                            .map((user, index) => renderUserCard(user, index))}
                    </div>
                )}
               
                {activeTab === 'AllEnrollments' && (
                    <div className="container mx-auto">
                     
                        {Object.keys(groupedPendingEnrollments).length > 0 && (
                            <div className="mb-6">
                                <button
                                    onClick={handleApproveAllPendingEnrollments}
                                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600
                                    transition-colors duration-300 font-medium shadow-md flex items-center mx-auto gap-2"
                                >
                                    <CheckIcon fontSize="small" /> Approve All Pending Enrollments
                                </button>
                            </div>
                        )}
                       
                     
                        <div className="flex flex-wrap gap-4 mb-4 justify-center">
                            <button
                                className="px-4 py-2 bg-[#A32CC4] text-white rounded-lg shadow-md"
                                onClick={() => setActiveTab('AllEnrollments')}
                            >
                                View by User
                            </button>
                            <button
                                className="px-4 py-2 bg-white text-[#A32CC4] border border-[#A32CC4] rounded-lg shadow-md hover:bg-purple-50"
                                onClick={() => setActiveTab('AllPlaylistsView')}
                            >
                                View by Playlists
                            </button>
                        </div>
                       
                      
                        <div className="space-y-4">
                            {filteredUserIds.length > 0 ? (
                                filteredUserIds.map(userId => renderEnrollmentCard(userId))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No enrollments found matching your search criteria.
                                </div>
                            )}
                        </div>
                    </div>
                )}
               
                {activeTab === 'AllPlaylistsView' && (
                    <div className="container mx-auto">
                        <div className="flex flex-wrap gap-4 mb-4 justify-center">
                            <button
                                className="px-4 py-2 bg-white text-[#A32CC4] border border-[#A32CC4] rounded-lg shadow-md hover:bg-purple-50"
                                onClick={() => setActiveTab('AllEnrollments')}
                            >
                                View by User
                            </button>
                            <button
                                className="px-4 py-2 bg-[#A32CC4] text-white rounded-lg shadow-md"
                                onClick={() => setActiveTab('AllPlaylistsView')}
                            >
                                View by Playlists
                            </button>
                        </div>
                       
                      
                        <div className="space-y-4">
                            {filteredPlaylists.length > 0 ? (
                                filteredPlaylists.map(playlist => renderPlaylistCard(playlist))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No playlists found matching your search criteria.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
);
};

export default ManagerUsers;
