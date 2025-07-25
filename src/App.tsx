import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { OrbitControls } from '@react-three/drei'
import PortfolioUI from './components/PortfolioUI' 
import './App.css'

import { Canvas } from '@react-three/fiber'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 1.6, 0], fov: 60 }}>
        <color attach="background" args={['#505050']} />
        <PortfolioUI />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
