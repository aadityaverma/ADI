import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Text, Float, Stars } from '@react-three/drei'
import { useRef, useState } from 'react'
import { Color } from 'three'

function AnimatedSphere() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
      <Sphere
        ref={meshRef}
        args={[1, 100, 200]}
        scale={clicked ? 1.5 : 1}
        onClick={() => setClicked(!clicked)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={hovered ? new Color('#38bdf8') : new Color('#0ea5e9')}
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.1}
        />
      </Sphere>
    </Float>
  )
}

function AnimatedText({ children, position = [0, 0, 0] }) {
  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text
        position={position}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {children}
      </Text>
    </Float>
  )
}

function ThreeScene({ showText = true, interactive = true }) {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} color="#38bdf8" intensity={0.5} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <AnimatedSphere />
        
        {showText && (
          <>
            <AnimatedText position={[0, 2.5, 0]}>React Three.js</AnimatedText>
            <AnimatedText position={[0, -2.5, 0]}>Interactive 3D Web</AnimatedText>
          </>
        )}
        
        {interactive && <OrbitControls enableZoom={false} />}
      </Canvas>
    </div>
  )
}

export default ThreeScene