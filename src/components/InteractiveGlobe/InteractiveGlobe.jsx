"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Create random points for stars background
function generateStars(count = 1000) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  return positions;
}

// Stars component
function Stars() {
  const ref = useRef();
  const positions = generateStars(800);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#666666"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

// Globe component
function Globe({ rotation }) {
  const globeRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (globeRef.current) {
      // Apply rotation from props (controlled by GSAP)
      globeRef.current.rotation.y = rotation;

      // Add subtle hover animation
      if (hovered) {
        globeRef.current.scale.setScalar(1.1);
      } else {
        globeRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group>
      {/* Main Globe */}
      <Sphere
        ref={globeRef}
        args={[1, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color="#666666"
          wireframe={true}
          transparent={true}
          opacity={0.8}
        />
      </Sphere>

      {/* Inner glow */}
      <Sphere args={[0.95, 32, 32]}>
        <meshBasicMaterial
          color="#666666"
          transparent={true}
          opacity={0.2}
        />
      </Sphere>

      {/* Outer glow */}
      <Sphere args={[1.1, 32, 32]}>
        <meshBasicMaterial
          color="#999999"
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

const InteractiveGlobe = ({ className = "", rotation = 0 }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder while mounting to avoid hydration issues
    return (
      <div className={className} style={{ width: "100%", height: "100%" }}>
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent"
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            border: "1px solid #666666",
            borderRadius: "50%",
            opacity: 0.6
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <Stars />
        <Globe rotation={rotation} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default InteractiveGlobe;