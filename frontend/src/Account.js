import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';

function Account() {


    const user = JSON.parse(localStorage.getItem('user'));
    const user_id = user.user_id;
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchGroups = async () => {
            try {
                const response = await fetch(`http://localhost:3001/user-groups/${user_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch groups');
                }
                const data = await response.json();
                setGroups(data);
            } catch (err) {
                console.error('Fetch groups error: ', err);
                alert('Server error - fetch groups.');
            }
        };

        fetchGroups();
    }, [user_id]);

    const handleLeaveGroup = async (groupId) => {

        if (!window.confirm('Are you sure you want to leave this group?')) return;

        try {
            const response = await fetch(`http://localhost:3001/user-groups/${user_id}/leave`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ group_id: groupId })
              });
            if (!response.ok) {
                throw new Error('Failed to leave group!');
            }
            const data = await response.json();
            if (data.success) {
                alert('Successfully left the group!');
                window.location.reload(); // Reload the page to reflect changes
            } else {
                alert(data.message || 'Failed to leave group!');
            }
        } catch (err) {
            console.error('leave group error', err);
            alert('Failed to leave group!');
        }
    };

    const handleDeleteGroup = async (groupId) => {

        if (!window.confirm('Are you sure you want to delete this group?')) return;

        try {
            const response = await fetch(`http://localhost:3001/user-groups/${user_id}/delete`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ group_id: groupId })
              });
            if (!response.ok) {
                throw new Error('Failed to leave group!');
            }
            const data = await response.json();
            if (data.success) {
                alert('Successfully deleted the group!');
                window.location.reload(); // Reload the page to reflect changes
            } else {
                alert(data.message || 'Failed to delete group!');
            }
        } catch (err) {
            console.error('delete group error', err);
            alert('Failed to delete group!');
        }
    };

    const handleLogout = () => {

        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="account-page">
            <div className="account-header">
                <h1>Your Account</h1>
                <p>{user.email}</p>
            </div>

            <h2>Your Study Groups</h2>
            <ul className="group-list">
                {groups.length > 0 ? (
                    groups.map(group => (
                        <li key={group.group_id} className="group-item">
                            <h3>{group.group_name}</h3>
                            <p><strong>Course:</strong> {group.course_name}</p>
                            <div className="button-container">
                                <button onClick={() => navigate(`/group/${group.group_id}`)}>Enter Group</button>
                                {group.role === "creator" ? (
                                    <button onClick={() => handleDeleteGroup(group.group_id)}>Delete Group</button>
                                ) : (
                                    <button onClick={() => handleLeaveGroup(group.group_id)}>Leave Group</button>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <p>You haven't joined any groups yet.</p>
                )}
            </ul>

            <button className="logout-button" onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
}

export default Account;