
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Center } from '@react-three/drei';

interface SphereProps {
  code: string;
  animationSpeed: number;
}

const FONT_SIZE = 40; // Smaller for better fit on sphere
const CANVAS_WIDTH = 2048; // Higher res for clarity
const CANVAS_HEIGHT = 4096;

const Sphere: React.FC<SphereProps> = ({ code, animationSpeed }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const codeTextureRef = useRef<THREE.CanvasTexture>(null!);
  const alphaTextureRef = useRef<THREE.CanvasTexture>(null!);
  const totalLinesRef = useRef(0);
  const animationStartTimeRef = useRef(0);

  // Memoize textures so they are not recreated on re-renders
  useMemo(() => {
    const codeCanvas = document.createElement('canvas');
    codeCanvas.width = CANVAS_WIDTH;
    codeCanvas.height = CANVAS_HEIGHT;
    codeTextureRef.current = new THREE.CanvasTexture(codeCanvas);

    const alphaCanvas = document.createElement('canvas');
    alphaCanvas.width = 1; // Alpha map can be 1px wide
    alphaCanvas.height = CANVAS_HEIGHT;
    alphaTextureRef.current = new THREE.CanvasTexture(alphaCanvas);
  }, []);

  useEffect(() => {
    const codeTexture = codeTextureRef.current;
    if (!codeTexture) return;

    const canvas = codeTexture.image as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const lines = code.split('\n');
    const oldTotalLines = totalLinesRef.current;
    totalLinesRef.current = lines.length;

    // If the code changes substantially (like a new prompt), reset the animation
    if (Math.abs(lines.length - oldTotalLines) > 50) {
      animationStartTimeRef.current = 0; // Will be reset in useFrame
    }

    const lineHeight = FONT_SIZE * 1.3;
    
    ctx.fillStyle = 'rgba(10, 25, 47, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = `bold ${FONT_SIZE}px 'Roboto Mono', monospace`;
    ctx.fillStyle = '#64ffda';
    
    lines.forEach((line, index) => {
        ctx.fillText(line, 20, (index + 1) * lineHeight);
    });
    
    codeTexture.needsUpdate = true;
  }, [code]);

  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * animationSpeed;
        meshRef.current.rotation.x += delta * (animationSpeed * 0.33);
    }
    
    // Animation logic for the alpha map reveal
    const alphaTexture = alphaTextureRef.current;
    if (!alphaTexture) return;
    
    if (animationStartTimeRef.current === 0) {
      animationStartTimeRef.current = state.clock.elapsedTime;
    }

    const canvas = alphaTexture.image as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    const totalAnimationLines = Math.max(1, totalLinesRef.current + 30); // Add buffer for looping
    const linesPerSecond = 10;
    const elapsedTime = state.clock.elapsedTime - animationStartTimeRef.current;
    const progress = (elapsedTime * linesPerSecond % totalAnimationLines) / totalAnimationLines;

    const revealEnd = progress;
    const revealStart = Math.max(0, revealEnd - 0.2); // 20% height for the gradient

    gradient.addColorStop(0, 'white');
    gradient.addColorStop(revealStart, 'white');
    gradient.addColorStop(revealEnd, 'black');
    gradient.addColorStop(1, 'black');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    alphaTexture.needsUpdate = true;
  });

  return (
    <Center>
      <mesh ref={meshRef}>
        <sphereGeometry args={[7, 64, 64]} />
        <meshPhysicalMaterial 
            map={codeTextureRef.current}
            alphaMap={alphaTextureRef.current}
            transparent={true}
            transmission={0.95} 
            thickness={2.5}
            roughness={0.05}
            ior={1.5}
            metalness={0.1}
            emissive="#00f0c0"
            emissiveMap={codeTextureRef.current}
            emissiveIntensity={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            side={THREE.DoubleSide}
        />
      </mesh>
    </Center>
  );
};

export default Sphere;
