import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Settings, User, Calendar, Activity } from 'lucide-react'
import ThreeScene from '../components/ThreeScene'
import useAuthStore from '../store/authStore'

function Dashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    loginCount: 0,
    lastLogin: new Date(),
    accountAge: 0,
    activities: []
  })

  useEffect(() => {
    // Mock data for demo
    setStats({
      loginCount: Math.floor(Math.random() * 50) + 10,
      lastLogin: new Date(),
      accountAge: Math.floor(Math.random() * 365) + 30,
      activities: [
        { id: 1, type: 'login', message: 'Logged in successfully', timestamp: new Date() },
        { id: 2, type: 'profile', message: 'Profile updated', timestamp: new Date(Date.now() - 86400000) },
        { id: 3, type: 'view', message: 'Viewed 3D scene', timestamp: new Date(Date.now() - 172800000) }
      ]
    })
  }, [])

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-dark-300 text-lg">
            Explore your personalized dashboard and interact with the 3D environment
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Total Logins</p>
                <p className="text-2xl font-bold text-white">{stats.loginCount}</p>
              </div>
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Account Age</p>
                <p className="text-2xl font-bold text-white">{stats.accountAge} days</p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 text-sm">Last Login</p>
                <p className="text-2xl font-bold text-white">Today</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Scene */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Interactive 3D Scene
            </h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <ThreeScene showText={true} interactive={true} />
            </div>
            <p className="text-dark-300 text-sm mt-4">
              Click and drag to rotate the scene. The sphere responds to your mouse interactions.
            </p>
          </div>

          {/* Activity Feed */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {stats.activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-dark-400 text-xs">
                      {activity.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-dark-700">
              <Link
                to="/profile"
                className="btn-secondary flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Manage Profile</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/profile"
              className="btn-secondary flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>View Profile</span>
            </Link>
            <Link
              to="/settings"
              className="btn-secondary flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <button className="btn-secondary flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard