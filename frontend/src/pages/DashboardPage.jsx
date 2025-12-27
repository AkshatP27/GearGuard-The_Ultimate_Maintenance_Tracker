import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'

export default function DashboardPage() {
  const stats = [
    { 
      label: 'Total Equipment', 
      value: '24', 
      change: '+2 this month',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Pending Tasks', 
      value: '8',
      change: '3 overdue',
      changeType: 'warning',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      label: 'In Progress', 
      value: '5',
      change: 'On track',
      changeType: 'normal',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600'
    },
    { 
      label: 'Completed', 
      value: '156',
      change: '+12 this week',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'completed',
      title: 'Hydraulic Press maintenance completed',
      timestamp: '2 hours ago',
      user: 'Team A',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'bg-green-100 text-green-600'
    },
    {
      id: 2,
      type: 'created',
      title: 'New maintenance request created',
      timestamp: '5 hours ago',
      user: 'CNC Machine',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      iconBg: 'bg-blue-100 text-blue-600'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Equipment inspection overdue',
      timestamp: '1 day ago',
      user: 'Conveyor Belt #3',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      iconBg: 'bg-yellow-100 text-yellow-600'
    }
  ]

  const upcomingTasks = [
    { id: 1, title: 'Replace hydraulic fluid', equipment: 'Press #2', dueDate: 'Tomorrow', priority: 'high' },
    { id: 2, title: 'Inspect conveyor belts', equipment: 'Line A', dueDate: 'Dec 30', priority: 'medium' },
    { id: 3, title: 'Calibrate sensors', equipment: 'Robot Arm #4', dueDate: 'Jan 2', priority: 'low' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your equipment.</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 font-medium mb-2">{stat.label}</p>
                <p className={`text-xs ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'warning' ? 'text-red-600' : 
                  'text-gray-500'
                }`}>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className={`p-2 rounded-lg ${activity.iconBg}`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.timestamp} • {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Tasks</h2>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm mb-1">{task.title}</p>
                        <p className="text-xs text-gray-600">{task.equipment}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Due: {task.dueDate}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition">
                View All Tasks
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
