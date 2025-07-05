import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Scene = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <button
        onClick={handleLogout}
        style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}
      >
        Logout
      </button>
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default Scene