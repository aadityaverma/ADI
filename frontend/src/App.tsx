import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Scene from './pages/Scene'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'

function AppRoutes() {
  const { token } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/scene"
        element={
          <PrivateRoute>
            <Scene />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to={token ? '/scene' : '/login'} />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
