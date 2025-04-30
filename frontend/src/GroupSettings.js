import React, { useState } from 'react';
import './GroupSettings.css';

function GroupSettings({ group }) {
  const [groupName, setGroupName] = useState(group.group_name);
  const [meetingTime, setMeetingTime] = useState(group.meeting_time);
  const [location, setLocation] = useState(group.location);

  const user = JSON.parse(localStorage.getItem('user'));

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:3001/groups/${group.group_id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_name: groupName, meeting_time: meetingTime, location, user_id: user.user_id, group_id: group.group_id }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Group settings updated successfully!');
        window.location.reload();
      } else {
        alert('Failed to update group settings.');
      }
    } catch (err) {
      console.error('Error updating group settings:', err);
    }
  };

  return (
    <div className="group-settings">
      <h3>Group Settings</h3>
      <form className="settings-form">
        <label htmlFor="groupName">Group Name:</label>
        <input
          id="groupName"
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
        />

        <label htmlFor="meetingTime">Meeting Time:</label>
        <input
          id="meetingTime"
          type="time"
          value={meetingTime}
          onChange={(e) => setMeetingTime(e.target.value)}
        />

        <label htmlFor="location">Location:</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />

        <button type="button" onClick={handleSave}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default GroupSettings;