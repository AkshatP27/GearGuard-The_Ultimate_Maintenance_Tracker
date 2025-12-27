import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import EquipmentPage from './pages/EquipmentPage'
import MaintenancePage from './pages/MaintenancePage'
import TeamsPage from './pages/TeamsPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/equipment" element={<EquipmentPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/teams" element={<TeamsPage />} />
      </Routes>
    </Router>
  )
}

export default App
