import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Torus, useTexture } from '@react-three/drei';
import type { Mesh } from 'three';

/**
 * Renders the actual product packaging as a textured plane in 3D space.
 * Floats and rotates gently for a premium feel.
 */
function ProductPackaging({
  imageUrl,
  autoRotate,
  rotationSpeed,
}: {
  imageUrl: string;
  autoRotate: boolean;
  rotationSpeed: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(imageUrl);

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  // Aspect ratio roughly matches the product bag (portrait)
  return (
    <mesh ref={meshRef} castShadow>
      <planeGeometry args={[2.2, 3, 1, 1]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.1} />
    </mesh>
  );
}

/**
 * Placeholder 3D geometry that represents a product.
 * Used when no product image is available.
 */
function PlaceholderProduct({
  autoRotate,
  rotationSpeed,
  color,
}: {
  autoRotate: boolean;
  rotationSpeed: number;
  color: string;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
      meshRef.current.rotation.x += delta * rotationSpeed * 0.3;
    }
  });

  return (
    <group>
      <Box ref={meshRef} args={[1.4, 1.8, 1.4]} castShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.92}
        />
      </Box>
      <Torus args={[1.2, 0.06, 16, 60]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#7CFFB2" roughness={0.2} metalness={0.6} />
      </Torus>
      <Sphere args={[0.25, 16, 16]} position={[0, 1.05, 0]}>
        <meshStandardMaterial color="#8BC34A" roughness={0.4} metalness={0.2} />
      </Sphere>
    </group>
  );
}

/** Lighting rig for realistic product rendering */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-4, 4, -4]} intensity={0.6} color="#7CFFB2" />
      <pointLight position={[4, -2, 4]} intensity={0.4} color="#FF9800" />
    </>
  );
}

export interface Product3DViewProps {
  /** Path to a .glb/.gltf 3D model. Falls back to placeholder geometry if not provided. */
  modelPath?: string;
  /** Product packaging image to display as a textured 3D plane */
  productImage?: string;
  /** Accent color for the placeholder geometry (used when no productImage) */
  color?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  enableControls?: boolean;
  /** 2D fallback image shown when 3D rendering fails */
  fallbackImage?: string;
  fallbackAlt?: string;
  className?: string;
}

/**
 * Product3DView
 * Renders an interactive 3D product visualization using React Three Fiber.
 * Falls back to a 2D image if WebGL is unavailable or an error occurs.
 * Requirements: 2.3, 4.9
 */
export function Product3DView({
  productImage,
  color = '#2E7D32',
  autoRotate = true,
  rotationSpeed = 0.8,
  enableControls = true,
  fallbackImage,
  fallbackAlt = 'Product image',
  className = '',
}: Product3DViewProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-white/5 rounded-xl ${className}`}
        data-testid="product-3d-fallback"
      >
        {fallbackImage ? (
          <img
            src={fallbackImage}
            alt={fallbackAlt}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div className="text-neutral-cream/40 text-sm font-body p-8 text-center">
            <span className="text-4xl block mb-2" aria-hidden="true">
              📦
            </span>
            3D view unavailable
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-[#0a1628] ${className}`}
      data-testid="product-3d-canvas-wrapper"
    >
      {/* Subtle glow backdrop */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(124,255,178,0.06)_0%,transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />
      <Canvas
        shadows
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        onCreated={({ gl }) => {
          // Detect WebGL context loss
          gl.domElement.addEventListener('webglcontextlost', () => {
            setHasError(true);
          });
        }}
        aria-label="Interactive 3D product view"
      >
        <Lights />
        <Suspense fallback={null}>
          {productImage ? (
            <ProductPackaging
              imageUrl={productImage}
              autoRotate={autoRotate}
              rotationSpeed={rotationSpeed}
            />
          ) : (
            <PlaceholderProduct
              autoRotate={autoRotate}
              rotationSpeed={rotationSpeed}
              color={color}
            />
          )}
        </Suspense>
        {enableControls && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
            autoRotate={false} // manual rotation handled in PlaceholderProduct
          />
        )}
      </Canvas>
    </div>
  );
}

export default Product3DView;
