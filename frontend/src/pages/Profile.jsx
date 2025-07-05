import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, Mail, Calendar, Edit3, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { authAPI } from '../utils/api'

function Profile() {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const response = await authAPI.updateProfile(data)
      updateUser(response.data)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
    })
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Profile
          </h1>
          <p className="text-dark-300 text-lg">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Account Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      id="name"
                      type="text"
                      className="input"
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                      })}
                    />
                  ) : (
                    <div className="input bg-dark-700 text-dark-300 cursor-not-allowed">
                      {user?.name}
                    </div>
                  )}
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      id="email"
                      type="email"
                      className="input"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                    />
                  ) : (
                    <div className="input bg-dark-700 text-dark-300 cursor-not-allowed">
                      {user?.email}
                    </div>
                  )}
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Role
                  </label>
                  <div className="input bg-dark-700 text-dark-300 cursor-not-allowed capitalize">
                    {user?.role || 'user'}
                  </div>
                </div>

                {/* Submit Button */}
                {isEditing && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="space-y-6">
            {/* Profile Avatar */}
            <div className="card p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{user?.name}</h3>
              <p className="text-dark-300 text-sm capitalize">{user?.role || 'user'}</p>
            </div>

            {/* Account Details */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Account Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-dark-400" />
                  <div>
                    <p className="text-sm text-dark-300">Email</p>
                    <p className="text-white text-sm">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-dark-400" />
                  <div>
                    <p className="text-sm text-dark-300">Member Since</p>
                    <p className="text-white text-sm">
                      {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-dark-400" />
                  <div>
                    <p className="text-sm text-dark-300">Account Type</p>
                    <p className="text-white text-sm capitalize">{user?.role || 'user'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Security</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary text-left">
                  Change Password
                </button>
                <button className="w-full btn-secondary text-left">
                  Two-Factor Authentication
                </button>
                <button className="w-full btn-secondary text-left">
                  Login History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile