import React, { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import JitsiMeetComponent from '@/components/JitsiMeetComponent';
import axios from 'axios';

const VideoMeeting = () => {
  const { user } = useAuth();
  const [roomName, setRoomName] = useState('');
  const [inputRoomName, setInputRoomName] = useState(''); // User input for creating/joining a meeting
  const [jwtToken, setJwtToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to fetch Jitsi token
  const fetchToken = async (room) => {
    setLoading(true);
    try {
      console.log(`Fetching token for room: ${room}`);
      const response = await axios.post(
        'http://localhost:5000/api/auth/jitsi-token',
        { room },  // Send room inside the body
        { withCredentials: true }
      );
      
      
      console.log('API Response:', response.data);

      if (!response.data.token) {
        throw new Error('Token not received');
      }

      setJwtToken(response.data.token);
      setRoomName(room); // Set roomName only after token is retrieved
    } catch (error) {
      console.error('Error fetching Jitsi token:', error.response?.data || error.message);
      alert('Failed to retrieve meeting token. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle meeting creation
  const handleCreateMeeting = () => {
    if (!inputRoomName.trim()) {
      alert('Please enter a valid room name.');
      return;
    }
    fetchToken(inputRoomName.trim()); // Fetch token first
  };

  // Handle joining an existing meeting
  const handleJoinMeeting = () => {
    if (!inputRoomName.trim()) {
      alert('Please enter a valid meeting link.');
      return;
    }
    fetchToken(inputRoomName.trim()); // Fetch token first
  };

  const handleMeetingEnd = () => {
    setRoomName('');
    setJwtToken('');
    setInputRoomName('');
    navigate(-1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Video Meeting</h1>

      {roomName && jwtToken ? (
        <JitsiMeetComponent roomName={roomName} user={user} jwtToken={jwtToken} onMeetingEnd={handleMeetingEnd} />
      ) : (
        <div>
          <input
            type="text"
            className="p-2 border rounded-lg w-full"
            placeholder="Enter Room Name"
            value={inputRoomName}
            onChange={(e) => setInputRoomName(e.target.value)}
          />
          {user.role === 'admin' && (
            <button
              className="p-4 bg-blue-600 text-white rounded-lg mt-2 w-full"
              onClick={handleCreateMeeting}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Meeting'}
            </button>
          )}
          <button
            className="p-4 bg-green-600 text-white rounded-lg mt-2 w-full"
            onClick={handleJoinMeeting}
            disabled={loading}
          >
            {loading ? 'Joining...' : 'Join Meeting'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoMeeting;
