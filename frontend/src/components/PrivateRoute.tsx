import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { type ReactNode } from 'react'

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth()
  if (!token) {
    return <Navigate to="/login" />
  }
  return <>{children}</>
}

export default PrivateRoute