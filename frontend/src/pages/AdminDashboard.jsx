import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Activity, 
  Shield, 
  TrendingUp, 
  Server, 
  AlertTriangle,
  BarChart3,
  Settings
} from 'lucide-react'
import { adminAPI } from '../utils/api'
import ThreeScene from '../components/ThreeScene'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalSessions: 0,
    serverHealth: 'good',
    systemLoad: 0,
    storage: 0,
    uptime: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentUsers, setRecentUsers] = useState([])

  useEffect(() => {
    fetchStats()
    fetchRecentUsers()
  }, [])

  const fetchStats = async () => {
    try {
      // Mock data for demo - in real app, this would come from API
      setStats({
        totalUsers: 1248,
        activeUsers: 892,
        newUsers: 156,
        totalSessions: 3421,
        serverHealth: 'good',
        systemLoad: 23,
        storage: 67,
        uptime: 99.9
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentUsers = async () => {
    try {
      // Mock data for demo
      setRecentUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: new Date() },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: new Date(Date.now() - 86400000) },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'admin', createdAt: new Date(Date.now() - 172800000) },
      ])
    } catch (error) {
      console.error('Failed to fetch recent users:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading admin dashboard...</p>
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
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center">
                <Shield className="w-8 h-8 mr-3 text-primary-500" />
                Admin Dashboard
              </h1>
              <p className="text-dark-300 text-lg">
                Manage your system and monitor performance
              </p>
            </div>
            <div className="flex space-x-4">
              <Link to="/admin/users" className="btn-primary flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Manage Users</span>
              </Link>
              <button className="btn-secondary flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                <p className="text-green-400 text-sm">+{stats.newUsers} this month</p>
              </div>
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
                <p className="text-blue-400 text-sm">Online now</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Total Sessions</p>
                <p className="text-3xl font-bold text-white">{stats.totalSessions}</p>
                <p className="text-purple-400 text-sm">All time</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">System Health</p>
                <p className="text-3xl font-bold text-green-400">Good</p>
                <p className="text-green-400 text-sm">{stats.uptime}% uptime</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Monitor */}
          <div className="lg:col-span-2">
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                System Monitor
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-dark-300 mb-2">
                    <span>CPU Usage</span>
                    <span>{stats.systemLoad}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.systemLoad}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-dark-300 mb-2">
                    <span>Storage</span>
                    <span>{stats.storage}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.storage}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-dark-300 mb-2">
                    <span>Memory</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: '45%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive 3D Scene */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4">System Visualization</h2>
              <div className="h-64 rounded-lg overflow-hidden">
                <ThreeScene showText={false} interactive={true} />
              </div>
            </div>
          </div>

          {/* Recent Users & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Users */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Recent Users
              </h2>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm">{user.name}</p>
                        <p className="text-dark-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-900 text-purple-200' 
                        : 'bg-blue-900 text-blue-200'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/admin/users"
                className="block mt-4 text-center text-primary-400 hover:text-primary-300 text-sm"
              >
                View All Users
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/admin/users"
                  className="w-full btn-secondary flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Manage Users</span>
                </Link>
                <button className="w-full btn-secondary flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>View Analytics</span>
                </button>
                <button className="w-full btn-secondary flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>System Settings</span>
                </button>
                <button className="w-full btn-secondary flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Security Logs</span>
                </button>
              </div>
            </div>

            {/* Alerts */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                System Alerts
              </h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="text-white text-sm">System backup completed</p>
                    <p className="text-dark-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  <div>
                    <p className="text-white text-sm">High CPU usage detected</p>
                    <p className="text-dark-400 text-xs">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="text-white text-sm">New user registered</p>
                    <p className="text-dark-400 text-xs">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard