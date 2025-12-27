import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'

export default function TeamsPage() {
  const teams = [
    { id: 1, name: 'Mechanical Team', members: 5, activeTasks: 3, completedTasks: 42, icon: '??' },
    { id: 2, name: 'Electrical Team', members: 4, activeTasks: 2, completedTasks: 38, icon: '?' },
    { id: 3, name: 'Hydraulics Team', members: 3, activeTasks: 4, completedTasks: 29, icon: '??' },
    { id: 4, name: 'Assembly Team', members: 6, activeTasks: 5, completedTasks: 51, icon: '???' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Teams Management</h1>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md">
              + Add Team
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow hover:shadow-xl transition p-6">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">{team.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Members</span>
                    <span className="font-semibold text-gray-900">{team.members}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Tasks</span>
                    <span className="font-semibold text-orange-600">{team.activeTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">{team.completedTasks}</span>
                  </div>
                </div>

                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium">
                  Manage Team
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
