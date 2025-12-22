import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CreateRequestPage from './pages/CreateRequestPage'
import BrowseRequestsPage from './pages/BrowseRequestsPage'
import RequestDetailPage from './pages/RequestDetailPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-request" element={<CreateRequestPage />} />
        <Route path="/browse" element={<BrowseRequestsPage />} />
        <Route path="/request/:id" element={<RequestDetailPage />} />
        <Route path="/chat/:requestId" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Layout>
  )
}

export default App

