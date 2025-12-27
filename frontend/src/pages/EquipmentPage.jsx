import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'

export default function EquipmentPage() {
  const [equipment] = useState([
    { id: 1, name: 'Hydraulic Press', serialNumber: 'HP-2024-001', status: 'operational', location: 'Factory Floor A' },
    { id: 2, name: 'CNC Machine', serialNumber: 'CNC-2024-002', status: 'maintenance', location: 'Workshop B' },
    { id: 3, name: 'Forklift', serialNumber: 'FK-2024-003', status: 'operational', location: 'Warehouse' },
    { id: 4, name: 'Lathe Machine', serialNumber: 'LM-2024-004', status: 'operational', location: 'Workshop A' },
    { id: 5, name: 'Welding Robot', serialNumber: 'WR-2024-005', status: 'repair', location: 'Factory Floor B' },
    { id: 6, name: 'Conveyor Belt', serialNumber: 'CB-2024-006', status: 'operational', location: 'Assembly Line' },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'repair':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md">
              + Add Equipment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-xl transition p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.serialNumber}</p>
                    <p className="text-xs text-gray-500 mt-1">?? {item.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                    View Details
                  </button>
                  <button className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
