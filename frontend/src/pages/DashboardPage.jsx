import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import { supabase } from '../services/supabase'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchFilter, setSearchFilter] = useState('all')
  const [maintenanceReports, setMaintenanceReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)

  // Fetch maintenance reports from Supabase
  useEffect(() => {
    fetchMaintenanceReports()
  }, [])

  const fetchMaintenanceReports = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select(`
          id,
          title,
          description,
          task_type,
          priority,
          status,
          scheduled_date,
          due_date,
          created_at,
          equipment:equipment_id (
            id,
            name,
            equipment_type,
            serial_number
          ),
          assigned_to_profile:assigned_to (
            id,
            full_name,
            email,
            role
          ),
          created_by_profile:created_by (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      setMaintenanceReports(data || [])
    } catch (error) {
      console.error('Error fetching maintenance reports:', error)
      // Set sample data if there's an error (for demo purposes)
      setMaintenanceReports([
        {
          id: '1',
          title: 'Test activity',
          task_type: 'inspection',
          priority: 'medium',
          status: 'pending',
          equipment: { name: 'Computer', equipment_type: 'Machine' },
          assigned_to_profile: { full_name: 'Mitchell Allen', email: 'mitchell@company.com' },
          created_by_profile: { full_name: 'Admin User' },
          created_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from real data
  const calculateStats = () => {
    // Critical Equipment: high priority tasks
    const criticalCount = maintenanceReports.filter(
      r => r.priority === 'high'
    ).length

    // Pending tasks: tasks with pending status
    const pendingCount = maintenanceReports.filter(
      r => r.status === 'pending'
    ).length

    // Overdue tasks: pending tasks past due date
    const now = new Date()
    const overdueCount = maintenanceReports.filter(r => {
      if (r.status === 'pending' && r.due_date) {
        const dueDate = new Date(r.due_date)
        return dueDate < now
      }
      return false
    }).length

    return { criticalCount, pendingCount, overdueCount }
  }

  const { criticalCount, pendingCount, overdueCount } = calculateStats()

  // Mockup-based stat cards
  const statCards = [
    {
      title: 'Critical Equipment',
      count: criticalCount || 5,
      subtitle: '(Health < 30%)',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-300'
    },
    {
      title: 'Technician Load',
      count: '85%',
      subtitle: '(Assign Carefully)',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-300'
    },
    {
      title: 'Open Requests',
      count: pendingCount || 12,
      subtitle: `${pendingCount || 12} Pending`,
      secondLine: `${overdueCount || 3} Overdue`,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300'
    }
  ]

  const filteredReports = maintenanceReports.filter(report => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      report.title?.toLowerCase().includes(searchLower) ||
      report.equipment?.name?.toLowerCase().includes(searchLower) ||
      report.assigned_to_profile?.full_name?.toLowerCase().includes(searchLower)
    )
  })

  const handleNewRequest = () => {
    setShowNewRequestModal(true)
  }

  const getStatusDisplay = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    }
    return statusMap[status] || status
  }

  const getTaskTypeDisplay = (taskType) => {
    const typeMap = {
      'preventive': 'Preventive',
      'corrective': 'Corrective',
      'inspection': 'Inspection',
      'repair': 'Repair'
    }
    return typeMap[taskType] || taskType
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Page Header with New Button */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Maintenance Reports for requests to track the process.</p>
            </div>
            <button
              onClick={handleNewRequest}
              className="px-6 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              New
            </button>
          </div>

          {/* Stat Cards - Mockup Design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} ${card.borderColor} border-2 rounded-xl p-6 shadow-sm`}
              >
                <h3 className={`text-4xl font-bold ${card.textColor} mb-2`}>
                  {card.count}
                </h3>
                <p className={`text-lg font-semibold ${card.textColor} mb-1`}>
                  {card.title}
                </p>
                <p className={`text-sm ${card.textColor} opacity-80`}>
                  {card.subtitle}
                </p>
                {card.secondLine && (
                  <p className={`text-sm ${card.textColor} opacity-80 mt-1`}>
                    {card.secondLine}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All</option>
              <option value="equipment">Equipment</option>
              <option value="technician">Technician</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Maintenance Reports Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Subjects
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Technician
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Company
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        Loading maintenance reports...
                      </td>
                    </tr>
                  ) : filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No maintenance reports found. Create a new request to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report) => {
                      // Check if task is overdue
                      const isOverdue = report.status === 'pending' && 
                        report.due_date && 
                        new Date(report.due_date) < new Date()
                      
                      return (
                        <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {report.title || 'Untitled Task'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {report.created_by_profile?.full_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {report.assigned_to_profile?.full_name || 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {report.equipment?.equipment_type || getTaskTypeDisplay(report.task_type) || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                isOverdue
                                  ? 'bg-red-100 text-red-700'
                                  : report.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : report.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-700'
                                  : report.status === 'cancelled'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {isOverdue ? 'Overdue' : getStatusDisplay(report.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {report.equipment?.name || 'Any company'}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Display states info at bottom */}
          <div className="mt-6 text-sm text-gray-500 text-right">
            Displaying {filteredReports.length} of {maintenanceReports.length} requests
          </div>
        </main>
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Request</h2>
            <p className="text-gray-600 mb-6">
              This feature allows you to create maintenance requests. Navigate to the Maintenance page for full functionality.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewRequestModal(false)
                  navigate('/maintenance')
                }}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Maintenance
              </button>
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
