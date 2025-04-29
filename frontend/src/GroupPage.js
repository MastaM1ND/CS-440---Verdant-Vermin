import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './GroupPage.css';

function GroupPage() {
  const { id } = useParams(); // groupId from URL
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3001/groups/${id}`)
      .then(res => res.json())
      .then(data => setGroup(data.group))
      .catch(err => console.error('Error fetching group:', err));

    fetch(`http://localhost:3001/groups/${id}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data.messages))
      .catch(err => console.error('Error fetching messages:', err));
  }, [id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const res = await fetch(`http://localhost:3001/groups/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, content: newMessage })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages(prev => [...prev, { content: newMessage, sender: user.email, timestamp: new Date() }]);
        setNewMessage('');
      } else {
        alert('Failed to send message.');
      }
    } catch (err) {
      console.error('Message send error:', err);
    }
  };

  if (!group) return <div>Loading group...</div>;

  return (
    <div className="group-page">
      <div className="group-header">
        <h2>{group.group_name}</h2>
        <p>Type: {group.group_type}</p>
        <p>Max Members: {group.max_members}</p>
      </div>

      <div className="messages-section">
        <h3>Messages</h3>
        <div className="messages-list">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.sender || 'User'}:</strong> {msg.content}
              <br />
              <small>{new Date(msg.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>

        <form className="send-message-form" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default GroupPage;
