const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'No token provided'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    
    // Get user from database
    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'User not found'
      })
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'Account is not active'
      })
    }

    // Add user to request object
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'Invalid token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Access Denied',
        message: 'Token expired'
      })
    }

    return res.status(500).json({
      error: 'Server Error',
      message: 'Token verification failed'
    })
  }
}

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Admin privileges required'
    })
  }
  next()
}

// Middleware to check if user owns the resource or is admin
const requireOwnershipOrAdmin = (req, res, next) => {
  const userId = req.params.id || req.params.userId
  
  if (req.user.role === 'admin' || req.user._id.toString() === userId) {
    return next()
  }
  
  return res.status(403).json({
    error: 'Access Denied',
    message: 'You can only access your own resources'
  })
}

// Middleware to validate user status
const requireActiveStatus = (req, res, next) => {
  if (req.user.status !== 'active') {
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Account is not active'
    })
  }
  next()
}

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    const user = await User.findById(decoded.userId)
    
    if (user && user.status === 'active') {
      req.user = user
    }
    
    next()
  } catch (error) {
    // Continue without authentication if token is invalid
    next()
  }
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnershipOrAdmin,
  requireActiveStatus,
  optionalAuth
}