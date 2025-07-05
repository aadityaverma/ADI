const express = require('express')
const { body, validationResult, query } = require('express-validator')
const User = require('../models/User')
const { requireOwnershipOrAdmin, requireActiveStatus } = require('../middleware/auth')

const router = express.Router()

// Get all users (with pagination and filtering)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin'),
  query('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status'),
  query('search').optional().isLength({ min: 1, max: 100 }).withMessage('Search term too long')
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

    // Get users
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
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
    console.error('Get users error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to get users'
    })
  }
})

// Get user by ID
router.get('/:id', requireOwnershipOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User with this ID does not exist'
      })
    }

    res.json({
      user: user.profile
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to get user'
    })
  }
})

// Update user
router.put('/:id', requireOwnershipOrAdmin, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Theme must be either light or dark'),
  body('preferences.notifications')
    .optional()
    .isBoolean()
    .withMessage('Notifications must be a boolean'),
  body('preferences.language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language must be a valid language code')
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

    const user = await User.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User with this ID does not exist'
      })
    }

    const { name, email, preferences } = req.body

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findByEmail(email)
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          error: 'Email Already Taken',
          message: 'This email is already registered to another account'
        })
      }
    }

    // Update user
    const updateData = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (preferences) updateData.preferences = { ...user.preferences, ...preferences }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )

    res.json({
      message: 'User updated successfully',
      user: updatedUser.profile
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to update user'
    })
  }
})

// Delete user (soft delete by changing status)
router.delete('/:id', requireOwnershipOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User with this ID does not exist'
      })
    }

    // Prevent users from deleting themselves unless they're admin
    if (req.user._id.toString() === req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'You cannot delete your own account'
      })
    }

    // Soft delete by setting status to inactive
    await User.findByIdAndUpdate(req.params.id, { status: 'inactive' })

    res.json({
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to delete user'
    })
  }
})

// Get user stats
router.get('/:id/stats', requireOwnershipOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User with this ID does not exist'
      })
    }

    // Calculate account age in days
    const accountAge = Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24))

    // Get basic stats
    const stats = {
      accountAge,
      loginCount: user.loginCount,
      lastLogin: user.lastLogin,
      status: user.status,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    res.json({
      stats
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to get user stats'
    })
  }
})

module.exports = router