import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function CreateGroup() {
    //useState is default
    const [group_name, setGroupName] = useState('');
    const [course, setCourse] = useState('');
    const [group_type, setGroupType] = useState('');
    const [max_members, setMaxMembers] = useState('');
    const [location, setLocation] = useState('');
    const [meeting_time, setMeetingTime] = useState('');
    const navigate = useNavigate();

    const handleCreateGroup = async (e) => {
        e.preventDefault();

        //dropdown validation
        if (!course || course === '') {
            alert('Please select a valid course.');
            return;
        }
        if (!group_type || group_type === '') {
        alert('Please select a valid group type.');
        return;
        }
    
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await fetch('http://localhost:3001/create_group', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'user_id': user.user_id
          },
          body: JSON.stringify(
            { group_name, course, group_type, max_members, meeting_time, location })
        });
    
        const data = await res.json();
        if (data.success) {
          alert('Group Created! Returning to Main Menu');
          navigate('/groups'); // ✅ This is what redirects to login
        } else {
          alert(data.message || 'Group Creation Failed.');
        }
      };

    return(
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
            <h1>Create a new group</h1>

            <form onSubmit={handleCreateGroup}>
                <p>Enter a name for your group</p>
                <input type="text" placeholder="Enter a name" onChange={e => setGroupName(e.target.value)}/><br/><br/>
        
                <label for="course">Choose a course: </label>
                <select name="course" id="courses" onChange={e => setCourse(e.target.value)}>
                    <option value="">Select a course</option>
                    <option value="CS440">CS440</option>
                    <option value="CS310">CS310</option>
                    <option value="CS210">CS210</option>
                    <option value="CS110">CS110</option>
                </select><br/><br/>
        
                <label for="group_type">Choose a group type: </label>
                <select name="group_type" id="group_types" onChange={e => setGroupType(e.target.value)}>
                    <option value="">Select a group type</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                    <option value="Invite-Only">Invite-Only</option>
                </select><br/><br/>

                        
                <label for="location">Choose a meeting location: </label>
                <select name="location" id="locations" onChange={e => setLocation(e.target.value)}>
                    <option value="">Select a location</option>
                    <option value="EVLB210">Evansdale Library 210</option>
                    <option value="ELC">ELC</option>
                    <option value="LCSEE">LCSEE</option>
                    <option value="DTLB115">Downtown Library 115</option>
                </select><br/><br/>

                <label for="time">Set a meeting time: </label>
                <input type="time" id="time" name="time" 
                       min="06:00" max="22:00" required
                       onChange={e => setMeetingTime(e.target.value)}/><br/><br/>
        
                <label for="max_members">Enter a max number of members (Maximum = 50) </label>
                <input name="max_members" type="number" placeholder="Enter max members" 
                    onChange={e => setMaxMembers(e.target.value)}/><br/><br/>
                <button type="submit">Create your Group</button>
            </form>
        </div>
    );
}

export default CreateGroup;