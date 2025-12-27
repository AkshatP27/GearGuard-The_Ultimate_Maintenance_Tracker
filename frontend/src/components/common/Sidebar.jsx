import { NavLink } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: '??' },
  { name: 'Equipment', path: '/equipment', icon: '??' },
  { name: 'Maintenance', path: '/maintenance', icon: '??' },
  { name: 'Teams', path: '/teams', icon: '??' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
