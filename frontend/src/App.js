import React, { useEffect, useState } from 'react';
import { getAllUsers } from './api'; // Replace with the actual path to your api.js

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllUsers();
      setUsers(result);
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
