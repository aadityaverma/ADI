import { Link } from 'react-router-dom'
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react'
import ThreeScene from '../components/ThreeScene'

function NotFound() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* 3D Scene Background */}
        <div className="absolute inset-0 opacity-30">
          <ThreeScene showText={false} interactive={false} />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="mb-8">
            <AlertTriangle className="w-24 h-24 mx-auto mb-6 text-red-500" />
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-dark-300 mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound