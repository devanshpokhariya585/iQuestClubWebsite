import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, useTexture } from '@react-three/drei'
import * as THREE from 'three'

const { lerp } = THREE.MathUtils
const PINK = '#ff2d95'
const NEON = '#ff7ad4'
const WHITE = '#ffffff'

// small emissive bar used for circuit traces / fins
function Trace({ position, args, color = NEON, intensity = 1.4 }) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#1a0a1e" emissive={color} emissiveIntensity={intensity} toneMapped={false} />
    </mesh>
  )
}

// one lid (top face detailed). sign = -1 (left) or +1 (right)
function LidContent({ sign }) {
  const fins = [-0.9, -0.45, 0, 0.45, 0.9]
  return (
    <group>
      {/* main lid body */}
      <mesh>
        <boxGeometry args={[1.5, 0.3, 3.0]} />
        <meshStandardMaterial color="#120814" metalness={0.9} roughness={0.25} emissive="#2a0620" emissiveIntensity={0.5} />
        <Edges scale={1.01} threshold={15} color={PINK} />
      </mesh>
      {/* recessed inset panel */}
      <mesh position={[sign * 0.12, 0.155, 0]}>
        <boxGeometry args={[1.05, 0.04, 2.5]} />
        <meshStandardMaterial color="#0d0510" metalness={0.8} roughness={0.4} />
        <Edges threshold={15} color={NEON} />
      </mesh>
      {/* heat fins */}
      {fins.map((z) => (
        <Trace key={z} position={[sign * 0.12, 0.185, z]} args={[0.85, 0.012, 0.03]} color={PINK} intensity={0.9} />
      ))}
      {/* an L-shaped signal trace toward the seam */}
      <Trace position={[sign * 0.55, 0.185, -1.1]} args={[0.4, 0.012, 0.02]} />
      <Trace position={[sign * 0.36, 0.185, -0.75]} args={[0.02, 0.012, 0.75]} />
      {/* pad node */}
      <mesh position={[sign * 0.36, 0.185, -0.4]}>
        <boxGeometry args={[0.08, 0.03, 0.08]} />
        <meshStandardMaterial color="#1a0a1e" emissive={WHITE} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </group>
  )
}

function usePins() {
  return useMemo(() => {
    const pins = []
    const n = 10
    const span = 2.9
    for (let i = 0; i < n; i++) {
      const p = -span / 2 + (span / (n - 1)) * i
      pins.push([-2.02, -0.1, p])
      pins.push([2.02, -0.1, p])
      pins.push([p, -0.1, -2.02])
      pins.push([p, -0.1, 2.02])
    }
    return pins
  }, [])
}

function useMotes() {
  return useMemo(() => {
    const n = 46
    const arr = new Float32Array(n * 3)
    const seed = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 1.0
      arr[i * 3 + 1] = Math.random() * 1.6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 1.0
      seed[i] = Math.random()
    }
    return { n, arr, seed }
  }, [])
}

export default function Chip({ open = false, interactive = false, onToggle, scale = 1.05, lift = 0 }) {
  const outer = useRef()
  const left = useRef()
  const right = useRef()
  const core = useRef()
  const coreMat = useRef()
  const coreInner = useRef()
  const coreLight = useRef()
  const crown = useRef()
  const ringA = useRef()
  const ringB = useRef()
  const ringAMat = useRef()
  const ringBMat = useRef()
  const motes = useRef()
  const motesMat = useRef()
  const pulse = useRef()
  const logoMesh = useRef()
  const logoMat = useRef()
  const t = useRef(0)

  const pins = usePins()
  const { n: moteCount, arr: motePos, seed: moteSeed } = useMotes()
  const logoTex = useTexture('/logo.png')

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    const time = state.clock.elapsedTime
    t.current = lerp(t.current, open ? 1 : 0, 0.09)
    const tt = t.current

    if (left.current) {
      left.current.position.x = lerp(-0.8, -2.5, tt)
      left.current.position.y = lerp(0.16, 0.95, tt)
      left.current.rotation.z = tt * 0.55
    }
    if (right.current) {
      right.current.position.x = lerp(0.8, 2.5, tt)
      right.current.position.y = lerp(0.16, 0.95, tt)
      right.current.rotation.z = -tt * 0.55
    }

    const glow = 0.6 + Math.sin(time * 2.6) * 0.18
    if (coreMat.current) coreMat.current.emissiveIntensity = lerp(0.7, 3.4 + glow, tt)
    if (coreInner.current) coreInner.current.material.emissiveIntensity = lerp(1.0, 5.5, tt)
    if (coreLight.current) coreLight.current.intensity = lerp(1.6, 20, tt)
    if (core.current) core.current.scale.setScalar(lerp(0.92, 1.08, tt))
    if (crown.current) crown.current.rotation.y += d * (0.6 + tt * 1.2)

    if (ringAMat.current) ringAMat.current.opacity = lerp(0.14, 0.85, tt)
    if (ringBMat.current) ringBMat.current.opacity = lerp(0.1, 0.6, tt)
    if (ringA.current) { ringA.current.rotation.z += d * 0.5; ringA.current.scale.setScalar(lerp(0.95, 1.1, tt)) }
    if (ringB.current) { ringB.current.rotation.z -= d * 0.85; ringB.current.scale.setScalar(lerp(0.8, 0.95, tt)) }

    // traveling data pulse along the front edge
    if (pulse.current) {
      pulse.current.position.x = ((time * 1.2) % 2.8) - 1.4
    }

    // logo panel on the core: fades + scales in when open (no spin)
    if (logoMat.current) logoMat.current.opacity = Math.max(0, tt * 1.1 - 0.1)
    if (logoMesh.current) logoMesh.current.scale.setScalar(lerp(0.6, 1, tt))

    // rising motes when open
    if (motes.current) {
      const p = motes.current.geometry.attributes.position.array
      for (let i = 0; i < moteCount; i++) {
        p[i * 3 + 1] += d * (0.4 + moteSeed[i] * 0.6)
        if (p[i * 3 + 1] > 1.8) p[i * 3 + 1] = 0
      }
      motes.current.geometry.attributes.position.needsUpdate = true
      if (motesMat.current) motesMat.current.opacity = tt * 0.9
    }

    // FACE-FORWARD MOTION: no full spin. Slow sway + mouse parallax, top face toward camera.
    if (outer.current) {
      outer.current.position.y = lift + Math.sin(time * 1.0) * 0.07
      const swayY = Math.sin(time * 0.45) * 0.28
      const targetY = swayY + state.pointer.x * 0.3
      const targetX = 0.4 + state.pointer.y * 0.14 // positive => top face tilts toward the camera
      outer.current.rotation.y = lerp(outer.current.rotation.y, targetY, 0.05)
      outer.current.rotation.x = lerp(outer.current.rotation.x, targetX, 0.05)
    }
  })

  const handleClick = (e) => {
    if (!interactive) return
    e.stopPropagation()
    onToggle?.()
  }

  return (
    <group ref={outer} onClick={handleClick} scale={scale}>
      {/* substrate */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[3.7, 0.22, 3.7]} />
        <meshStandardMaterial color="#0d0712" metalness={0.7} roughness={0.35} />
        <Edges scale={1.001} threshold={15} color={PINK} />
      </mesh>

      {/* etched border trace on substrate top */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[3.0, 0.02, 3.0]} />
        <meshBasicMaterial color={NEON} transparent opacity={0.22} toneMapped={false} />
      </mesh>

      {/* traveling data pulse */}
      <mesh ref={pulse} position={[0, -0.02, 1.62]}>
        <boxGeometry args={[0.14, 0.03, 0.05]} />
        <meshBasicMaterial color={WHITE} toneMapped={false} />
      </mesh>

      {/* corner nodes + SMD parts */}
      {[[-1.65, -1.65], [1.65, -1.65], [-1.65, 1.65], [1.65, 1.65]].map(([x, z], i) => (
        <mesh key={`c${i}`} position={[x, -0.02, z]}>
          <boxGeometry args={[0.2, 0.06, 0.2]} />
          <meshStandardMaterial color="#1a0a1e" emissive={PINK} emissiveIntensity={1.7} toneMapped={false} />
        </mesh>
      ))}
      {[[-1.4, 1.5], [1.4, 1.5], [0, -1.6]].map(([x, z], i) => (
        <mesh key={`s${i}`} position={[x, -0.05, z]}>
          <boxGeometry args={[0.3, 0.08, 0.14]} />
          <meshStandardMaterial color="#160812" metalness={0.5} roughness={0.6} />
          <Edges threshold={15} color={NEON} />
        </mesh>
      ))}

      {/* neon pins */}
      {pins.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.07, 0.14, 0.18]} />
          <meshStandardMaterial color="#2a0d24" emissive={NEON} emissiveIntensity={1.1} metalness={0.6} roughness={0.4} toneMapped={false} />
        </mesh>
      ))}

      {/* CORE */}
      <group ref={core} position={[0, 0.04, 0]}>
        <mesh>
          <boxGeometry args={[1.2, 0.5, 1.2]} />
          <meshStandardMaterial ref={coreMat} color="#2a0722" emissive={PINK} emissiveIntensity={0.7} roughness={0.2} metalness={0.1} />
          <Edges scale={1.02} threshold={15} color={NEON} />
        </mesh>
        {/* bright inner */}
        <mesh ref={coreInner} scale={0.55}>
          <boxGeometry args={[1.2, 0.5, 1.2]} />
          <meshStandardMaterial color={WHITE} emissive={WHITE} emissiveIntensity={1} toneMapped={false} />
        </mesh>
        {/* grid pattern on core top */}
        {[-0.3, 0, 0.3].map((o) => (
          <group key={o}>
            <Trace position={[o, 0.27, 0]} args={[0.015, 0.01, 0.9]} color={WHITE} intensity={1.2} />
            <Trace position={[0, 0.27, o]} args={[0.9, 0.01, 0.015]} color={WHITE} intensity={1.2} />
          </group>
        ))}
        {/* spinning crown ring */}
        <mesh ref={crown} position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.02, 10, 40]} />
          <meshBasicMaterial color={PINK} toneMapped={false} />
        </mesh>
      </group>
      <pointLight ref={coreLight} position={[0, 0.5, 0]} color={NEON} intensity={1.6} distance={9} />

      {/* logo panel — small, static, propped on the pink core (3D, sways with the chip) */}
      <mesh ref={logoMesh} position={[0, 0.6, 0.1]} rotation={[-0.22, 0, 0]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshBasicMaterial
          ref={logoMat}
          map={logoTex}
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* rising motes */}
      <points ref={motes} position={[0, 0.1, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={moteCount} array={motePos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial ref={motesMat} color={NEON} size={0.07} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </points>

      {/* LIDS */}
      <group ref={left} position={[-0.8, 0.16, 0]}>
        <LidContent sign={-1} />
      </group>
      <group ref={right} position={[0.8, 0.16, 0]}>
        <LidContent sign={1} />
      </group>

      {/* aura rings */}
      <mesh ref={ringA} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <torusGeometry args={[2.85, 0.015, 12, 90]} />
        <meshBasicMaterial ref={ringAMat} color={PINK} transparent opacity={0.14} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <torusGeometry args={[2.4, 0.01, 12, 90]} />
        <meshBasicMaterial ref={ringBMat} color={NEON} transparent opacity={0.1} toneMapped={false} />
      </mesh>
    </group>
  )
}
