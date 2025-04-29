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
    const [isCourseFocused, setIsCourseFocused] = useState(false);
    const [isGroupTypeFocused, setIsGroupTypeFocused] = useState(false);
    const [isLocationFocused, setIsLocationFocused] = useState(false);
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

    return (
      <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Create a New Group</h1>

        <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label htmlFor="name" style={{ fontWeight: 'bold', color: '#555' }}>Enter a name for your group</label>
          <input 
          name="name"
          id="names"
          type="text" 
          placeholder="Enter a name" 
          onChange={e => setGroupName(e.target.value)} 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
          />

          <label htmlFor="course" style={{ fontWeight: 'bold', color: '#555' }}>Choose a course:</label>
          <div style={{ position: 'relative' }}>
            <select 
            name="course" 
            id="courses" 
            onFocus={() => setIsCourseFocused(true)}
            onBlur={() => setIsCourseFocused(false)}
            onChange={e => setCourse(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', backgroundColor: '#fff', appearance: 'none', cursor: 'pointer', width: '100%', color: course === '' ? 'gray' : 'black' }}
            >
            <option value="" disabled={isCourseFocused}>Select a course</option>
            <option style={{color:'black'}} value="CS440">CS440</option>
            <option style={{color:'black'}} value="CS310">CS310</option>
            <option style={{color:'black'}} value="CS210">CS210</option>
            <option style={{color:'black'}} value="CS110">CS110</option>
            </select>
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'gray' }}>▼</span>
          </div>

          <label htmlFor="group_type" style={{ fontWeight: 'bold', color: '#555' }}>Choose a group type:</label>
          <div style={{ position: 'relative' }}>
            <select 
            name="group_type" 
            id="group_types" 
            onFocus={() => setIsGroupTypeFocused(true)}
            onBlur={() => setIsGroupTypeFocused(false)}
            onChange={e => setGroupType(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', backgroundColor: '#fff', appearance: 'none', cursor: 'pointer', width: '100%', color: group_type === '' ? 'gray' : 'black' }}
            >
            <option value="" disabled={isGroupTypeFocused}>Select a group type</option>
            <option style={{color:'black'}} value="Public">Public</option>
            <option style={{color:'black'}} value="Private">Private</option>
            <option style={{color:'black'}} value="Invite-Only">Invite-Only</option>
            </select>
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'gray' }}>▼</span>
          </div>

          <label htmlFor="location" style={{ fontWeight: 'bold', color: '#555' }}>Choose a meeting location:</label>
          <div style={{ position: 'relative' }}>
            <select 
            name="location" 
            id="locations" 
            onFocus={() => setIsLocationFocused(true)}
            onBlur={() => setIsLocationFocused(false)}
            onChange={e => setLocation(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', backgroundColor: '#fff', appearance: 'none', cursor: 'pointer', width: '100%', color: location === '' ? 'gray' : 'black' }}
            >
            <option value="" disabled={isLocationFocused}>Select a location</option>
            <option style={{color:'black'}} value="EVLB210">Evansdale Library 210</option>
            <option style={{color:'black'}} value="ELC">ELC</option>
            <option style={{color:'black'}} value="LCSEE">LCSEE</option>
            <option style={{color:'black'}} value="DTLB115">Downtown Library 115</option>
            </select>
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'gray' }}>▼</span>
          </div>

          <label htmlFor="time" style={{ fontWeight: 'bold', color: '#555' }}>Set a meeting time:</label>
          <input 
          type="time" 
          id="time" 
          name="time" 
          min="06:00" 
          max="22:00" 
          required 
          onChange={e => setMeetingTime(e.target.value)} 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', color: meeting_time==='' ? 'gray' : 'black'  }}
          />

          <label htmlFor="max_members" style={{ fontWeight: 'bold', color: '#555' }}>Enter a max number of members (Between 2 and 50):</label>
          <input 
          name="max_members" 
          type="number" 
          placeholder="Enter max members" 
          max="50" 
          min="2" 
          required 
          onChange={e => setMaxMembers(e.target.value)} 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px'}}
          />

          <button 
          type="submit" 
          style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', backgroundColor: '#007BFF', color: '#fff', fontSize: '16px', cursor: 'pointer' }}
          >
          Create your Group
          </button>
        </form>
      </div>
    );
}

export default CreateGroup;