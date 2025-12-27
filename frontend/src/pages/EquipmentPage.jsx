import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'

export default function EquipmentPage() {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const equipment = [
    { 
      id: 1, 
      name: 'Hydraulic Press', 
      type: 'Machinery',
      serialNumber: 'HP-2024-001', 
      status: 'operational', 
      location: 'Factory Floor A',
      lastMaintenance: '2024-12-15',
      nextMaintenance: '2025-01-15'
    },
    { 
      id: 2, 
      name: 'CNC Machine', 
      type: 'Machinery',
      serialNumber: 'CNC-2024-002', 
      status: 'under_maintenance', 
      location: 'Workshop B',
      lastMaintenance: '2024-12-20',
      nextMaintenance: '2025-01-20'
    },
    { 
      id: 3, 
      name: 'Forklift #1', 
      type: 'Vehicle',
      serialNumber: 'FK-2024-003', 
      status: 'operational', 
      location: 'Warehouse',
      lastMaintenance: '2024-11-30',
      nextMaintenance: '2024-12-30'
    },
    { 
      id: 4, 
      name: 'Lathe Machine', 
      type: 'Machinery',
      serialNumber: 'LM-2024-004', 
      status: 'operational', 
      location: 'Workshop A',
      lastMaintenance: '2024-12-10',
      nextMaintenance: '2025-01-10'
    },
    { 
      id: 5, 
      name: 'Welding Robot', 
      type: 'Machinery',
      serialNumber: 'WR-2024-005', 
      status: 'out_of_service', 
      location: 'Factory Floor B',
      lastMaintenance: '2024-12-01',
      nextMaintenance: 'TBD'
    },
    { 
      id: 6, 
      name: 'Conveyor Belt System', 
      type: 'Machinery',
      serialNumber: 'CB-2024-006', 
      status: 'operational', 
      location: 'Assembly Line',
      lastMaintenance: '2024-12-18',
      nextMaintenance: '2025-01-18'
    },
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      operational: { label: 'Operational', class: 'bg-green-100 text-green-800 border-green-200' },
      under_maintenance: { label: 'Maintenance', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      out_of_service: { label: 'Out of Service', class: 'bg-red-100 text-red-800 border-red-200' },
      retired: { label: 'Retired', class: 'bg-gray-100 text-gray-800 border-gray-200' },
    }
    return statusConfig[status] || statusConfig.operational
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Machinery':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'Vehicle':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Equipment Management</h1>
              <p className="text-gray-600">Manage and monitor all equipment</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
              + Add Equipment
            </button>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="operational">Operational</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="out_of_service">Out of Service</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-2 px-3 rounded-md transition ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-2 px-3 rounded-md transition ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Equipment Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment.map((item) => {
                const statusBadge = getStatusBadge(item.status)
                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-blue-600">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.type}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Serial Number:</span>
                        <span className="font-medium text-gray-900">{item.serialNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-900">{item.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded border ${statusBadge.class}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Next Maintenance:</span>
                          <span className="font-medium">{item.nextMaintenance}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 py-2 px-3 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium">
                        View Details
                      </button>
                      <button className="py-2 px-3 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Equipment</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Serial Number</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Next Maintenance</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {equipment.map((item) => {
                    const statusBadge = getStatusBadge(item.status)
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-blue-600">
                              {getTypeIcon(item.type)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.serialNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.location}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusBadge.class}`}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.nextMaintenance}</td>
                        <td className="px-6 py-4 text-right text-sm">
                          <button className="text-blue-600 hover:text-blue-700 font-medium">View</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}