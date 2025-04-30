import axios from 'axios';
import { useEffect, useState } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-4 px-4">
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {filteredUsers.filter(x => x.role === "User").map((details, index) => (
          <div 
            key={index} 
            className="bg-white p-4 rounded-lg shadow-md border border-purple-100 flex flex-col items-center text-center text-sm hover:shadow-lg transition-all duration-200"
          >
            <div className="w-12 h-12 bg-purple-600 text-white flex items-center justify-center rounded-full text-lg font-bold mb-2">
              {details.firstName.charAt(0)}{details.lastName.charAt(0)}
            </div>
            <h3 className="text-base font-semibold mt-1 text-purple-900">{details.firstName} {details.lastName}</h3>
            <p className="text-purple-600 mt-1 text-xs text-wrap">{details.email}</p>
            <div className="mt-2 px-3 py-1 bg-yellow-100 rounded-full">
              <p className="text-yellow-700 text-xs font-medium">Role: {details.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;