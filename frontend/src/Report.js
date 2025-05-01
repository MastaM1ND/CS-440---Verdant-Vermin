import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Report() {
    //useState is default
    const [reported_username, setReportedUsername] = useState('');
    const [report_type, setReportType] = useState('');
    const [written_statement, setWrittenStatement] = useState('');
    const [isReportTypeFocused, setIsReportTypeFocused] = useState(false);
    const navigate = useNavigate();

    const handleReportUser = async (e) => {
        e.preventDefault();
        
        if (!report_type || report_type === '') {
            alert('Please select a valid report type.');
            return;
        }
    
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await fetch('http://localhost:3001/report', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'user_id': user.user_id
          },
          body: JSON.stringify(
            { reported_username, report_type, written_statement})
        });
    
        const data = await res.json();
        if (res.ok && data.success) {
          alert('Report Submitted! Returning to Main Menu');
          navigate('/groups', { replace: true });
          window.location.reload();

        } else {
          alert(data.message || 'Report Failed.');
        }
    };

    return (
      <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Report a User</h1>

        <form onSubmit={handleReportUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label htmlFor="reported_user" style={{ fontWeight: 'bold', color: '#555' }}>Enter a username to report</label>
          <input 
          name="reported_user"
          id="reported_users"
          type="text" 
          placeholder="Enter the username of the user you want to report" 
          onChange={e => setReportedUsername(e.target.value)} 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
          />

          <label htmlFor="report_type" style={{ fontWeight: 'bold', color: '#555' }}>Choose a report type:</label>
          <div style={{ position: 'relative' }}>
            <select 
            name="report_type" 
            id="report_types" 
            onFocus={() => setIsReportTypeFocused(true)}
            onBlur={() => setIsReportTypeFocused(false)}
            onChange={e => setReportType(e.target.value)} 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px', backgroundColor: '#fff', appearance: 'none', cursor: 'pointer', width: '100%', color: report_type === '' ? 'gray' : 'black' }}
            >
            <option value="" disabled={isReportTypeFocused}>Select a Report Type</option>
            <option style={{color:'black'}} value="harrassment">Harrassment</option>
            <option style={{color:'black'}} value="spam">Spam</option>
            <option style={{color:'black'}} value="impersonation">Impersonation</option>
            <option style={{color:'black'}} value="other">Other</option>
            </select>
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'gray' }}>▼</span>
          </div>

          <label htmlFor="written_statement" style={{ fontWeight: 'bold', color: '#555' }}>Enter a brief statement of why you're reporting this user:</label>
          <input 
          name="written_statement" 
          type="text" 
          placeholder="Enter a brief statement" 
          max="500" 
          required 
          onChange={e => setWrittenStatement(e.target.value)} 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px'}}
          />

          <button 
          type="submit" 
          style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', backgroundColor: '#007BFF', color: '#fff', fontSize: '16px', cursor: 'pointer' }}
          >
          Report
          </button>
        </form>
      </div>
    );
}

export default Report;