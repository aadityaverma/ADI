import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Login action
      login: (userData, token) => {
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      // Update user data
      updateUser: (userData) => {
        set({ user: userData })
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },

      // Initialize auth state
      initialize: () => {
        const { token } = get()
        if (token) {
          set({ isAuthenticated: true })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore