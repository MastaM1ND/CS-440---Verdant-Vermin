import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔥 Import navigate

function Groups() {
  const [groups, setGroups] = useState([]);
  const [joining, setJoining] = useState(null);
  const navigate = useNavigate(); // 🔥 useNavigate inside Groups

  useEffect(() => {
    fetch('http://localhost:3001/groups')
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error('Error fetching groups:', err));
  }, []);

  const handleJoin = async (groupId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return alert('You must be logged in to join a group.');

    setJoining(groupId);

    try {
      const res = await fetch(`http://localhost:3001/groups/${groupId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('Successfully joined the group!');
        navigate(`/group/${groupId}`); //  Navigate to GroupPage
      } else {
        if (data.message === 'You are already a member of this group.') {
          alert('You are already part of this group.');
          navigate(`/group/${groupId}`); //  Still navigate!
        } else {
          alert(data.message || 'Failed to join group.');
        }
      }
    } catch (err) {
      console.error('Join error:', err);
      alert('Server error.');
    } finally {
      setJoining(null); // Reset joining status after operation
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Study Group Finder</h1>
      <h2>Available Groups</h2>
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {groups.map(group => (
          <li
            key={group.group_id}
            style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <strong>{group.group_name}</strong><br />
            Course: {group.course_name} | Type: {group.group_type} | Members: {group.member_count}/{group.max_members}<br />
            Owner: {group.username} 
            <br />
            <button
              onClick={() => handleJoin(group.group_id)}
              disabled={joining === group.group_id}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#1976d2',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {joining === group.group_id ? 'Joining...' : 'Join'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Groups;
