
import { OrbitControls, ScrollControls } from '@react-three/drei'
import PortfolioUI from './components/PortfolioUI' 
import './App.css'

import { Canvas } from '@react-three/fiber'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
                   <Canvas camera={{ position: [0, 2, 9], fov: 45 }}>
        <color attach="background" args={['#505050']} />
        <ScrollControls pages={8} damping={0.25}>
          <PortfolioUI />
        </ScrollControls>
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={0}
          dampingFactor={0.1}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  )
}
