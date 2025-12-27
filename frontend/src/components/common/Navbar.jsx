import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">??</span>
            <span className="text-xl font-bold text-gray-900">GearGuard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{user?.email}</span>
            <button onClick={() => signOut().then(() => navigate('/login'))} className="text-sm text-red-600 hover:text-red-700 font-medium">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
