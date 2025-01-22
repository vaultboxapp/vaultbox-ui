import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './sidebar/Sidebar';
import ChannelsPage from './pages/ChannelsPage';
import DirectMessagesPage from './pages/DirectMessagesPage';
import Vaults from './components/Vaults/Vaults';
import ProtectedRoute from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <div className='flex flex-col md:flex-row min-h-screen'>
        <Sidebar />
        <Routes>
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/" element={<ProtectedRoute><div>Overview</div></ProtectedRoute>} />
          <Route path="/channels" element={<ProtectedRoute><ChannelsPage /></ProtectedRoute>} />
          <Route path="/channels/:id" element={<ProtectedRoute><ChannelsPage /></ProtectedRoute>} />
          <Route path="/direct-messages" element={<ProtectedRoute><DirectMessagesPage /></ProtectedRoute>} />
          <Route path="/direct-messages/:id" element={<ProtectedRoute><DirectMessagesPage /></ProtectedRoute>} />
          <Route path="/vaults" element={<ProtectedRoute><Vaults /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;