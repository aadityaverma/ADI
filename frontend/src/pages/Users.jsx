import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowLeft,
  Shield,
  User,
  MoreHorizontal
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adminAPI } from '../utils/api'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showActions, setShowActions] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Mock data for demo - in real app, this would come from API
      setUsers([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          status: 'active',
          createdAt: new Date('2023-01-15'),
          lastLogin: new Date('2023-12-01')
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'admin',
          status: 'active',
          createdAt: new Date('2023-02-20'),
          lastLogin: new Date('2023-12-02')
        },
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'user',
          status: 'inactive',
          createdAt: new Date('2023-03-10'),
          lastLogin: new Date('2023-11-15')
        },
        {
          id: 4,
          name: 'Alice Brown',
          email: 'alice@example.com',
          role: 'user',
          status: 'active',
          createdAt: new Date('2023-04-05'),
          lastLogin: new Date('2023-12-01')
        },
        {
          id: 5,
          name: 'Charlie Wilson',
          email: 'charlie@example.com',
          role: 'admin',
          status: 'active',
          createdAt: new Date('2023-05-12'),
          lastLogin: new Date('2023-12-02')
        }
      ])
    } catch (error) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      // Mock API call
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
      toast.success(`User role updated to ${newRole}`)
    } catch (error) {
      toast.error('Failed to update user role')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Mock API call
        setUsers(users.filter(user => user.id !== userId))
        toast.success('User deleted successfully')
      } catch (error) {
        toast.error('Failed to delete user')
      }
    }
  }

  const handleToggleStatus = async (userId) => {
    try {
      // Mock API call
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      ))
      toast.success('User status updated')
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/admin"
                className="inline-flex items-center space-x-2 text-dark-300 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Admin Dashboard</span>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center">
                <UsersIcon className="w-8 h-8 mr-3 text-primary-500" />
                User Management
              </h1>
              <p className="text-dark-300 text-lg">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="input min-w-[120px]"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button className="btn-secondary flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-800 border-b border-dark-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-dark-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-800 divide-y divide-dark-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-dark-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-sm bg-dark-700 border border-dark-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          user.status === 'active'
                            ? 'bg-green-900 text-green-200 hover:bg-green-800'
                            : 'bg-red-900 text-red-200 hover:bg-red-800'
                        }`}
                      >
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                          className="text-dark-400 hover:text-white transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {showActions === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-dark-700 rounded-lg shadow-lg py-2 z-10">
                            <button
                              onClick={() => {
                                setShowActions(null)
                                // Handle edit
                              }}
                              className="flex items-center space-x-2 px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-600 transition-colors w-full text-left"
                            >
                              <Edit3 className="w-4 h-4" />
                              <span>Edit User</span>
                            </button>
                            <button
                              onClick={() => {
                                setShowActions(null)
                                handleDeleteUser(user.id)
                              }}
                              className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-dark-600 transition-colors w-full text-left"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete User</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <UsersIcon className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <User className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Admins</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">New This Month</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => {
                    const now = new Date()
                    const created = new Date(u.createdAt)
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
              <Plus className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users