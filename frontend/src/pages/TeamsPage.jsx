import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import { supabase } from '../services/supabase'

export default function TeamsPage() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('team, technician, company')
        .not('team', 'is', null)
        .not('technician', 'is', null)
        .order('team', { ascending: true })

      if (error) throw error

      // Group by team and get unique entries
      const uniqueTeams = {}
      data?.forEach(item => {
        const key = `${item.team}-${item.technician}-${item.company}`
        if (!uniqueTeams[key]) {
          uniqueTeams[key] = {
            team: item.team,
            technician: item.technician,
            company: item.company || 'N/A'
          }
        }
      })

      setTeams(Object.values(uniqueTeams))
    } catch (error) {
      console.error('Error fetching teams:', error)
      setTeams([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Teams Management</h1>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading teams...</div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No teams found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teams.map((team, index) => (
                <div key={index} className="bg-white rounded-lg shadow hover:shadow-xl transition p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Team Name</p>
                      <p className="text-lg font-bold text-gray-900">{team.team}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Technician</p>
                      <p className="text-base text-gray-800">{team.technician}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Company</p>
                      <p className="text-base text-gray-800">{team.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
