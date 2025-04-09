import React, { useEffect, useState } from 'react';

function Groups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/groups')
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error('Error fetching groups:', err));
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Study Group Finder</h1>
      <h2>Available Groups</h2>
      <ul>
        {groups.map(group => (
          <li key={group.group_id}>
            {group.group_name} | Type: {group.group_type} | Max: {group.max_members}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Groups;
