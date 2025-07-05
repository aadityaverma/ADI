import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, Settings, LogOut, Shield } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../store/authStore'
import { authAPI } from '../utils/api'
import toast from 'react-hot-toast'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      logout()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      logout()
      toast.success('Logged out successfully')
      navigate('/')
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-800/95 backdrop-blur-sm border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-white">React 3D</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-dark-300 hover:text-white transition-colors">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-dark-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                {isAdmin() && (
                  <Link to="/admin" className="text-dark-300 hover:text-white transition-colors flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="text-dark-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">{user?.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-700 rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-600 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-dark-700 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-800 border-t border-dark-700">
              <Link
                to="/"
                className="block px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar