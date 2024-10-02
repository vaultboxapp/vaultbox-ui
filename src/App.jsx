import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Sidebar from './sidebar/Sidebar'
import ChannelsPage from './pages/ChannelsPage'
import DirectMessagesPage from './pages/DirectMessagesPage'
import Vaults from './components/Vaults/Vaults'

function App() {
  return (
    <Router>
      <div className='flex flex-col md:flex-row min-h-screen'>
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<div>Overview</div>} />
            <Route path="/search" element={<div>Search</div>} />
            <Route path="/video" element={<div>Video Meeting</div>} />
            <Route path="/channels" element={<ChannelsPage />} />
            <Route path="/channels/:id" element={<ChannelsPage />} />
            <Route path="/direct-messages" element={<DirectMessagesPage />} />
            <Route path="/direct-messages/:id" element={<DirectMessagesPage />} />
            <Route path="/vaults" element={<Vaults />} />
            <Route path="/vaults/:id" element={<Vaults />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App