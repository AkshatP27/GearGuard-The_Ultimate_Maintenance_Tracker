import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'

export default function DashboardPage() {
  const stats = [
    { label: 'Total Equipment', value: '24', icon: '??', color: 'text-blue-600' },
    { label: 'Open Requests', value: '8', icon: '??', color: 'text-yellow-600' },
    { label: 'In Progress', value: '5', icon: '?', color: 'text-orange-600' },
    { label: 'Completed', value: '156', icon: '?', color: 'text-green-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <span className="text-2xl">??</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Hydraulic Press maintenance completed</p>
                  <p className="text-sm text-gray-600">2 hours ago • Team A</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <span className="text-2xl">??</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">New maintenance request created</p>
                  <p className="text-sm text-gray-600">5 hours ago • CNC Machine</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <span className="text-2xl">?</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Forklift inspection passed</p>
                  <p className="text-sm text-gray-600">1 day ago • Team B</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
