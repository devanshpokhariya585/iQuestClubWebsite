import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Chip from './Chip'

/*
  3D stage for the neon processor.
  Bloom makes the pink emissive edges / core / motes glow like signage.
  Transparent canvas so the neo-city page background shows through.
*/
export default function ChipCanvas({ interactive = false, open = false, onToggle, dust = true, scale = 1.05, lift = 0 }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.3, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 4]} intensity={1.0} color="#ffd7f0" />
      <directionalLight position={[-5, 2, -3]} intensity={0.6} color="#ff2d95" />
      <pointLight position={[0, -3, 2]} intensity={0.5} color="#d81ce0" />

      <Suspense fallback={null}>
        <Chip interactive={interactive} open={open} onToggle={onToggle} scale={scale} lift={lift} />
        {dust && (
          <Sparkles count={44} scale={[10, 6, 6]} size={2.6} speed={0.3} color="#ff7ad4" opacity={0.5} />
        )}
      </Suspense>

      <EffectComposer>
        <Bloom mipmapBlur intensity={1.05} luminanceThreshold={0.15} luminanceSmoothing={0.3} radius={0.75} />
      </EffectComposer>
    </Canvas>
  )
}
