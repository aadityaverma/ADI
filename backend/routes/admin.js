const express = require('express')
const { body, validationResult, query } = require('express-validator')
const User = require('../models/User')
const { requireAdmin } = require('../middleware/auth')

const router = express.Router()

// Apply admin middleware to all routes
router.use(requireAdmin)

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    const userStats = await User.getStats()
    
    // Additional system stats
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt')
      .lean()

    const activeUsers = await User.countDocuments({ 
      status: 'active', 
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    })

    const stats = {
      ...userStats,
      activeUsers,
      recentUsers,
      systemHealth: {
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development'
      }
    }

    res.json({
      stats
    })
  } catch (error) {
    console.error('Get admin stats error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to get admin statistics'
    })
  }
})

// Get all users with admin privileges
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin'),
  query('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status'),
  query('search').optional().isLength({ min: 1, max: 100 }).withMessage('Search term too long'),
  query('sortBy').optional().isIn(['name', 'email', 'createdAt', 'lastLogin', 'loginCount']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: errors.array()[0].msg
      })
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1

    // Build filter object
    const filter = {}
    if (req.query.role) filter.role = req.query.role
    if (req.query.status) filter.status = req.query.status
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ]
    }

    // Get users with additional fields for admin
    const users = await User.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select('+loginCount +lastLogin +emailVerified')
      .lean()

    // Get total count for pagination
    const total = await User.countDocuments(filter)

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get admin users error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to get users'
    })
  }
})

// Update user role
router.put('/users/:id/role', [
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: errors.array()[0].msg
      })
    }

    const { role } = req.body
    const userId = req.params.id

    // Prevent admin from demoting themselves
    if (userId === req.user._id.toString() && role !== 'admin') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You cannot change your own role'
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User with this ID does not exist'
      })
    }

    // Update user role
    user.role = role
    await user.save()

    res.json({
      message: `User role updated to ${role}`,
      user: user.profile
    })
  } catch (error) {
    console.error('Update user role error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to update user role'
    })
  }
})

// Update user status
router.put('/users/:id/status', [
  body('status')
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Status must be active, inactive, or suspended')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: errors.array()[0].msg
      })
    }

    const { status } = req.body
    const userId = req.params.id

    // Prevent admin from deactivating themselves
    if (userId === req.user._id.toString() && status !== 'active') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You cannot change your own status'
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User with this ID does not exist'
      })
    }

    // Update user status
    user.status = status
    await user.save()

    res.json({
      message: `User status updated to ${status}`,
      user: user.profile
    })
  } catch (error) {
    console.error('Update user status error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to update user status'
    })
  }
})

// Create new user (admin only)
router.post('/users', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Status must be active, inactive, or suspended')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: errors.array()[0].msg
      })
    }

    const { name, email, password, role = 'user', status = 'active' } = req.body

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        error: 'User Already Exists',
        message: 'A user with this email already exists'
      })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      status
    })

    await user.save()

    res.status(201).json({
      message: 'User created successfully',
      user: user.profile
    })
  } catch (error) {
    console.error('Create user error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to create user'
    })
  }
})

// Delete user permanently (admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You cannot delete your own account'
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User with this ID does not exist'
      })
    }

    // Hard delete the user
    await User.findByIdAndDelete(userId)

    res.json({
      message: 'User deleted permanently'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to delete user'
    })
  }
})

// Get system health
router.get('/health', (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      database: 'connected' // In real app, check actual DB connection
    }

    res.json({
      health
    })
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Health check failed'
    })
  }
})

// Get user activity logs (placeholder)
router.get('/logs', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('userId').optional().isMongoId().withMessage('Invalid user ID'),
  query('action').optional().isLength({ min: 1, max: 50 }).withMessage('Invalid action')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: errors.array()[0].msg
      })
    }

    // Mock activity logs for demo
    const logs = [
      {
        id: 1,
        userId: req.query.userId || '507f1f77bcf86cd799439011',
        action: 'login',
        timestamp: new Date(),
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0...'
      },
      {
        id: 2,
        userId: req.query.userId || '507f1f77bcf86cd799439012',
        action: 'profile_update',
        timestamp: new Date(Date.now() - 3600000),
        ip: '192.168.1.2',
        userAgent: 'Mozilla/5.0...'
      }
    ]

    res.json({
      logs,
      pagination: {
        current: 1,
        pages: 1,
        total: logs.length
      }
    })
  } catch (error) {
    console.error('Get logs error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to get activity logs'
    })
  }
})

module.exports = router