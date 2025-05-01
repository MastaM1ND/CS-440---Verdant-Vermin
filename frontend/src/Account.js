import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';

function Account() {

    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        setUser(user);

        const fetchGroups = async () => {

            try {

                const res = await fetch(`http://localhost:3001/user-groups/${user.user_id}`);
                const data = await res.json();

                if (res.ok) {
                    setGroups(Array.isArray(data) ? data : (data.groups || []));
                } else {
                    alert(data.message || 'Failed to fetch groups!');
                }
            } catch (e) {
                console.error('Fetch group error: ', e);
                alert('Server error - fetch group.');
            }
        };

        fetchGroups();
    }, [navigate]);

    const handleLeaveGroup = async (groupId) => {

        try {

            const res = await fetch(`http://localhost:3001/groups/${groupId}/leave`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.user_id })
            });

            if (res.ok) {

                setGroups(prev => prev.filter(g => g.id !== groupId));

            } else {

                const data = await res.json();
                alert(data.message || 'Failed to leave group!');
            }
        } catch (e) {
            console.error('Leave group error: ', e);
            alert('Server error - leave group.');
        }
    };

    const handleDeleteGroup = async (groupId) => {

        if (!window.confirm('Are you sure you want to delete this group?')) return;

        try {

            const res = await fetch(`http://localhost:3001/groups/${groupId}`, {
                method: 'DELETE'
            });

            if (res.ok) {

                setGroups(prev => prev.filter(g => g.id !== groupId));
            } else {

                const data = await res.json();
                alert(data.message || 'Failed to delete group!');
            }

        } catch (e) {
            console.error('Delete group error: ', e);
            alert('Server error - delete group');
        }
    };

    const handleLogout = () => {

        localStorage.removeItem('user');
        navigate('/signup');
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
                        <li key={group.id} className="group-item">
                            <h3>{group.name}</h3>
                            <p><strong>Course:</strong> {group.course_code}</p>
                            <p>{group.description}</p>
                            {group.created_by === user.user_id ? (
                                <button onClick={() => handleDeleteGroup(group.id)}>Delete Group</button>
                            ) : (
                                <button onClick={() => handleLeaveGroup(group.id)}>Leave Group</button>
                            )}
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