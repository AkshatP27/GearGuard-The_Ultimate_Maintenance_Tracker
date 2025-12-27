import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import { supabase } from '../services/supabase'
import { useAuth } from '../context/AuthContext'

export default function EquipmentPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [equipmentList, setEquipmentList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [categories, setCategories] = useState([])
  
  // Form state for new maintenance request
  const [formData, setFormData] = useState({
    subject: '',
    maintenance_for: 'Equipment',
    equipment_name: '',
    category: '',
    request_date: new Date().toISOString().split('T')[0],
    maintenance_type: 'Corrective',
    team: '',
    technician: '',
    scheduled_date: '',
    duration_hours: 0,
    priority: 'Medium',
    company: '',
    notes: '',
    instructions: ''
  })

  useEffect(() => {
    fetchEquipment()
    fetchCategories()
  }, [])

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          id,
          subject,
          equipment_name,
          category,
          maintenance_type,
          priority,
          maintenance_for,
          request_date,
          scheduled_date,
          duration_hours,
          team,
          technician,
          company,
          notes,
          instructions,
          created_at,
          updated_at,
          created_by_profile:created_by (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEquipmentList(data || [])
    } catch (error) {
      console.error('Error fetching equipment:', error)
      // Set sample data if error
      setEquipmentList([
        { 
          id: '1', 
          name: 'Samsung Monitor 15"', 
          equipment_type: 'Monitors',
          serial_number: 'MT/125/22778937', 
          status: 'operational', 
          location: 'Admin',
          created_by_profile: { full_name: 'Tejas Modi' },
          manufacturer: 'Samsung',
          created_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Acer Laptop', 
          equipment_type: 'Computers',
          serial_number: 'MT/122/11112222', 
          status: 'operational', 
          location: 'Technician',
          created_by_profile: { full_name: 'Bhavansh P' },
          manufacturer: 'Acer',
          created_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      // Get unique categories
      const { data, error } = await supabase
        .from('equipment')
        .select('category')
      
      if (error) throw error
      
      const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))]
      const categoriesData = uniqueCategories.map(category => ({
        name: category,
        responsible: 'OdooBot',
        company: 'My Company (San Francisco)'
      }))
      
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([
        { name: 'Computers', responsible: 'OdooBot', company: 'My Company (San Francisco)' },
        { name: 'Software', responsible: 'OdooBot', company: 'My Company (San Francisco)' },
        { name: 'Monitors', responsible: 'Mitchell Admin', company: 'My Company (San Francisco)' }
      ])
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('equipment')
        .insert([{
          subject: formData.subject,
          maintenance_for: formData.maintenance_for,
          equipment_name: formData.equipment_name,
          category: formData.category,
          request_date: formData.request_date,
          maintenance_type: formData.maintenance_type,
          team: formData.team || null,
          technician: formData.technician || null,
          scheduled_date: formData.scheduled_date || null,
          duration_hours: parseFloat(formData.duration_hours) || 0,
          priority: formData.priority,
          company: formData.company || null,
          notes: formData.notes || null,
          instructions: formData.instructions || null,
          created_by: user?.id
        }])
        .select()

      if (error) throw error

      alert('Maintenance request created successfully!')
      setShowNewModal(false)
      setFormData({
        subject: '',
        maintenance_for: 'Equipment',
        equipment_name: '',
        category: '',
        request_date: new Date().toISOString().split('T')[0],
        maintenance_type: 'Corrective',
        team: '',
        technician: '',
        scheduled_date: '',
        duration_hours: 0,
        priority: 'Medium',
        company: '',
        notes: '',
        instructions: ''
      })
      fetchEquipment()
    } catch (error) {
      console.error('Error creating maintenance request:', error)
      alert('Error creating maintenance request: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEquipmentClick = (equipment) => {
    setSelectedEquipment(equipment)
    setShowDetailModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return

    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('Equipment deleted successfully!')
      fetchEquipment()
      setShowDetailModal(false)
    } catch (error) {
      console.error('Error deleting equipment:', error)
      alert('Error deleting equipment: ' + error.message)
    }
  }

  const filteredEquipment = equipmentList.filter(item => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      item.name?.toLowerCase().includes(search) ||
      item.equipment_type?.toLowerCase().includes(search) ||
      item.serial_number?.toLowerCase().includes(search) ||
      item.location?.toLowerCase().includes(search)
    )
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      operational: { label: 'Operational', class: 'bg-green-100 text-green-800' },
      under_maintenance: { label: 'Maintenance', class: 'bg-yellow-100 text-yellow-800' },
      out_of_service: { label: 'Out of Service', class: 'bg-red-100 text-red-800' },
      retired: { label: 'Retired', class: 'bg-gray-100 text-gray-800' }
    }
    return statusConfig[status] || statusConfig.operational
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCategoriesModal(true)}
                className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Categories
              </button>
              <button
                onClick={() => setShowNewModal(true)}
                className="px-6 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                New
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Equipment Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Equipment Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Team</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Technician</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Company</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Loading equipment...</td>
                    </tr>
                  ) : filteredEquipment.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No equipment found.</td>
                    </tr>
                  ) : (
                    filteredEquipment.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => handleEquipmentClick(item)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.equipment_name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.created_by_profile?.full_name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.team || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.subject || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.technician || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.category || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.company || 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* New Maintenance Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">New Maintenance Request</h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter maintenance subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Maintenance For *</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="maintenance_for"
                          value="Equipment"
                          checked={formData.maintenance_for === 'Equipment'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Equipment
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="maintenance_for"
                          value="Work Centre"
                          checked={formData.maintenance_for === 'Work Centre'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Work Centre
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Equipment Name *</label>
                    <input
                      type="text"
                      name="equipment_name"
                      required
                      value={formData.equipment_name}
                      onChange={handleInputChange}
                      placeholder="Enter equipment name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <input
                      type="text"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Enter category"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Request Date *</label>
                    <input
                      type="date"
                      name="request_date"
                      required
                      value={formData.request_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Maintenance Type *</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="maintenance_type"
                          value="Corrective"
                          checked={formData.maintenance_type === 'Corrective'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Corrective
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="maintenance_type"
                          value="Preventive"
                          checked={formData.maintenance_type === 'Preventive'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Preventive
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Team</label>
                    <input
                      type="text"
                      name="team"
                      value={formData.team}
                      onChange={handleInputChange}
                      placeholder="Enter team name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Technician</label>
                    <input
                      type="text"
                      name="technician"
                      value={formData.technician}
                      onChange={handleInputChange}
                      placeholder="Enter technician name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled Date</label>
                    <input
                      type="datetime-local"
                      name="scheduled_date"
                      value={formData.scheduled_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      name="duration_hours"
                      value={formData.duration_hours}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notes and Instructions - Full Width */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Additional notes..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions</label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Maintenance instructions..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {loading ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Equipment Detail Modal */}
      {showDetailModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Equipment Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Subject</p>
                <p className="text-lg text-gray-900">{selectedEquipment.subject || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Maintenance For</p>
                <p className="text-lg text-gray-900">{selectedEquipment.maintenance_for || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Equipment Name</p>
                <p className="text-lg text-gray-900">{selectedEquipment.equipment_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Category</p>
                <p className="text-lg text-gray-900">{selectedEquipment.category || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Request Date</p>
                <p className="text-lg text-gray-900">
                  {selectedEquipment.request_date ? new Date(selectedEquipment.request_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Maintenance Type</p>
                <p className="text-lg text-gray-900">{selectedEquipment.maintenance_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Team</p>
                <p className="text-lg text-gray-900">{selectedEquipment.team || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Technician</p>
                <p className="text-lg text-gray-900">{selectedEquipment.technician || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Scheduled Date</p>
                <p className="text-lg text-gray-900">
                  {selectedEquipment.scheduled_date ? new Date(selectedEquipment.scheduled_date).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Duration (hours)</p>
                <p className="text-lg text-gray-900">{selectedEquipment.duration_hours || 0}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Priority</p>
                <p className="text-lg text-gray-900">{selectedEquipment.priority || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Company</p>
                <p className="text-lg text-gray-900">{selectedEquipment.company || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Created By</p>
                <p className="text-lg text-gray-900">{selectedEquipment.created_by_profile?.full_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Created At</p>
                <p className="text-lg text-gray-900">
                  {selectedEquipment.created_at ? new Date(selectedEquipment.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            {selectedEquipment.notes && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-500 mb-1">Notes</p>
                <p className="text-gray-900">{selectedEquipment.notes}</p>
              </div>
            )}

            {selectedEquipment.instructions && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-500 mb-1">Instructions</p>
                <p className="text-gray-900">{selectedEquipment.instructions}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleDelete(selectedEquipment.id)}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Categories Modal */}
      {showCategoriesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Equipment Categories</h2>
              <button
                onClick={() => setShowCategoriesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
                New
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Responsible</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Company</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{category.responsible}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{category.company}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowCategoriesModal(false)}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}