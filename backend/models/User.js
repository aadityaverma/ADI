const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  avatar: {
    type: String,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password
      delete ret.emailVerificationToken
      delete ret.passwordResetToken
      delete ret.passwordResetExpires
      delete ret.__v
      return ret
    }
  }
})

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ status: 1 })
userSchema.index({ createdAt: -1 })

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12)
    this.password = hashedPassword
    next()
  } catch (error) {
    next(error)
  }
})

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw error
  }
}

// Instance method to update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date()
  this.loginCount += 1
  return this.save()
}

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

// Static method to find active users
userSchema.statics.findActiveUsers = function() {
  return this.find({ status: 'active' })
}

// Static method to find users by role
userSchema.statics.findByRole = function(role) {
  return this.find({ role })
}

// Static method to get user stats
userSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        adminUsers: {
          $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
        },
        newUsersThisMonth: {
          $sum: {
            $cond: [
              {
                $gte: [
                  '$createdAt',
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ])
  
  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    newUsersThisMonth: 0
  }
}

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    status: this.status,
    avatar: this.avatar,
    emailVerified: this.emailVerified,
    lastLogin: this.lastLogin,
    loginCount: this.loginCount,
    preferences: this.preferences,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
})

module.exports = mongoose.model('User', userSchema)