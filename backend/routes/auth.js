const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const rateLimit = require('express-rate-limit')
const User = require('../models/User')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again later'
  }
})

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// Register new user
router.post('/register', [
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
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: errors.array()[0].msg,
        details: errors.array()
      })
    }

    const { name, email, password } = req.body

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
      password
    })

    await user.save()

    // Update login info
    await user.updateLastLogin()

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      message: 'User registered successfully',
      user: user.profile,
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to register user'
    })
  }
})

// Login user
router.post('/login', authLimiter, [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
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

    const { email, password } = req.body

    // Find user and include password
    const user = await User.findByEmail(email).select('+password')
    if (!user) {
      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Email or password is incorrect'
      })
    }

    // Check password
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid Credentials',
        message: 'Email or password is incorrect'
      })
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({
        error: 'Account Inactive',
        message: 'Your account is not active. Please contact support.'
      })
    }

    // Update login info
    await user.updateLastLogin()

    // Generate token
    const token = generateToken(user._id)

    res.json({
      message: 'Login successful',
      user: user.profile,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to login'
    })
  }
})

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user.profile
    })
  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to get profile'
    })
  }
})

// Update user profile
router.put('/profile', authenticateToken, [
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

    const { name, email, preferences } = req.body

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findByEmail(email)
      if (existingUser) {
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
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    )

    res.json({
      message: 'Profile updated successfully',
      user: user.profile
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to update profile'
    })
  }
})

// Change password
router.put('/password', authenticateToken, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
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

    const { currentPassword, newPassword } = req.body

    // Get user with password
    const user = await User.findById(req.user._id).select('+password')
    
    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword)
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid Password',
        message: 'Current password is incorrect'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      message: 'Password updated successfully'
    })
  } catch (error) {
    console.error('Password change error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to change password'
    })
  }
})

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Logout successful'
  })
})

// Refresh token
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    const newToken = generateToken(req.user._id)
    
    res.json({
      message: 'Token refreshed',
      token: newToken
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to refresh token'
    })
  }
})

// Forgot password (placeholder)
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: errors.array()[0].msg
      })
    }

    const { email } = req.body

    // Check if user exists
    const user = await User.findByEmail(email)
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({
        message: 'If an account with this email exists, you will receive a password reset link'
      })
    }

    // TODO: Implement email sending logic here
    // For now, just return success message
    res.json({
      message: 'If an account with this email exists, you will receive a password reset link'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to process forgot password request'
    })
  }
})

// Reset password (placeholder)
router.post('/reset-password', [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: errors.array()[0].msg
      })
    }

    // TODO: Implement password reset logic here
    res.json({
      message: 'Password reset functionality will be implemented'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to reset password'
    })
  }
})

module.exports = router