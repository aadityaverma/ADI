import { Link } from 'react-router-dom'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import ThreeScene from '../components/ThreeScene'
import useAuthStore from '../store/authStore'

function Home() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Three.js Background */}
        <div className="absolute inset-0 z-0">
          <ThreeScene showText={false} interactive={true} />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-dark-900/30 z-10" />
        
        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary-400 mr-2" />
            <span className="text-primary-400 font-semibold tracking-wide uppercase">
              Welcome to the Future
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent leading-tight">
            Interactive 3D Web Experience
          </h1>
          
          <p className="text-xl md:text-2xl text-dark-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Built with React Three.js, featuring modern authentication, 
            admin capabilities, and stunning 3D visualizations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
                >
                  <Play className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/profile"
                  className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
                >
                  <span>View Profile</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
                >
                  <Play className="w-5 h-5" />
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Powerful Features
            </h2>
            <p className="text-xl text-dark-300 max-w-2xl mx-auto">
              Everything you need for a modern web application with 3D capabilities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">3D Visualization</h3>
              <p className="text-dark-300">
                Stunning Three.js scenes with interactive elements, animations, and modern visual effects.
              </p>
            </div>
            
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">User Authentication</h3>
              <p className="text-dark-300">
                Secure JWT-based authentication with role-based access control and profile management.
              </p>
            </div>
            
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Admin Dashboard</h3>
              <p className="text-dark-300">
                Comprehensive admin interface for user management, analytics, and system monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-900/20 to-primary-800/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users already exploring the future of web development.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home