import React, {useEffect, useState} from 'react';
import './GroupInfo.css';

function GroupInfo({ group }) {

    const id = group.group_id; // Extract group ID from the group object
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to track errors
    const [info, setInfo] = useState([]); // State to store group information


    useEffect(() => {
        // Fetch group information on component mount
        const fetchGroupMembers = async () => {
            try {
                const response = await fetch(`http://localhost:3001/groups/${id}/info`);
            if (!response.ok) {
                throw new Error('Failed to fetch group members');
            }
            const data = await response.json();
            setInfo(data.info);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupMembers();
    }, [id]);

    if (loading) {
        return <div>Loading group information...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!info) {
        return <div>No group information available.</div>;
      }

    return (
        <div className="group-info">
            <h3>Group Information</h3>
            <div className="info-item">
                <strong>Group Members:</strong>
                <div className="members-box">
                {info.length > 0 ? (
                    info.map((member, index) => (
                    <div key={index} className="member-item">
                        {member.username} ({member.role || 'Member'})
                    </div>
                    ))
                ) : (
                    <div>No members found.</div>
                )}
                </div>
            </div>
            <div className="info-item">
                <strong>Group Name:</strong> {group.group_name}
            </div>
            <div className="info-item">
                <strong>Course:</strong> {group.course_name}
            </div>
            <div className="info-item">
                <strong>Type:</strong> {group.group_type}
            </div>
            <div className="info-item">
                <strong>Max Members:</strong> {group.max_members}
            </div>
            <div className="info-item">
                <strong>Meeting Time:</strong> {group.meeting_time}
            </div>
            <div className="info-item">
                <strong>Location:</strong> {group.location}
            </div>
        </div>
    );
}

export default GroupInfo;