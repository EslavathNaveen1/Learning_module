import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editUser, setEditUser] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5104/api/Qtech/Users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = (userid) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
        if (confirmDelete) {
            axios.delete(`http://localhost:5104/api/Qtech/Users/${userid}`)
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
        axios.patch(`http://localhost:5104/api/Qtech/Users/${editUser.employeeId}`, editUser)
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditUser({ ...editUser, [name]: value });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {isEdit ? (
                <div className="flex flex-col items-center mt-6">
                    <h2 className="text-lg font-bold mb-4 text-violet-800">Edit Admin</h2>
                    <label className="text-gray-700 font-medium mb-2 text-sm">Select Role</label>
                    <select
                        name="role"
                        value={editUser.role}
                        onChange={handleChange}
                        className="border p-1 w-48 rounded-lg text-sm"
                    >
                        <option value="Admin">Admin</option>
                    </select>
                    <div className="flex gap-3 mt-2">
                        <button onClick={handleSave} className="bg-violet-600 text-white px-3 py-1 rounded-lg hover:bg-violet-700 text-sm">Save</button>
                        <button onClick={() => setIsEdit(false)} className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 text-sm">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="mt-4 px-4">
                    <h2 className="text-xl font-bold mb-4 text-violet-800 text-center">Admins</h2>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                        {filteredUsers.filter(x => x.role === "Admin").map((details, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg shadow border border-gray-200 flex flex-col items-center text-center text-sm">
                                <div className="w-10 h-10 bg-violet-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                                    {details.firstName.charAt(0)}{details.lastName.charAt(0)}
                                </div>
                                <h3 className="text-base font-semibold mt-2">{details.firstName} {details.lastName}</h3>
                                <p className="text-gray-600 mt-1 text-xs">{details.email}</p>
                                <div className="mt-2 flex gap-2">
                                    <button onClick={() => handleDelete(details.employeeId)} className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-xs"><DeleteIcon fontSize="small" /></button>
                                    <button onClick={() => handleEdit(details)} className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-xs"><EditIcon fontSize="small" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default Admin;
