
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Center } from '@react-three/drei';

interface LetterZProps {
  code: string;
  animationSpeed: number;
}

const FONT_SIZE = 48;
const CANVAS_WIDTH = 1024;

const LetterZ: React.FC<LetterZProps> = ({ code, animationSpeed }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!);
  
  const zShape = useMemo(() => {
    const s = 8;
    const shape = new THREE.Shape();
    shape.moveTo(-s, s);
    shape.lineTo(s, s);
    shape.lineTo(-s, -s);
    shape.lineTo(s, -s);
    shape.lineTo(s, -s - 1.5);
    shape.lineTo(-s, s - 1.5);
    shape.lineTo(s, s - 1.5);
    shape.lineTo(-s, -s - 1.5);
    shape.lineTo(-s, s);
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    steps: 2,
    depth: 2,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.5,
    bevelOffset: 0,
    bevelSegments: 8,
  }), []);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = 2048;
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);
  
  useEffect(() => {
    const canvas = texture.image as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const lines = code.split('\n');
    const lineHeight = FONT_SIZE * 1.3;
    const requiredHeight = lines.length * lineHeight + 40;
    
    if (canvas.height < requiredHeight) {
        canvas.height = Math.pow(2, Math.ceil(Math.log2(requiredHeight)));
    }

    ctx.fillStyle = 'rgba(10, 25, 47, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = `bold ${FONT_SIZE}px 'Roboto Mono', monospace`;
    ctx.fillStyle = '#64ffda';
    
    lines.forEach((line, index) => {
        ctx.fillText(line, 20, (index + 1) * lineHeight);
    });
    
    texture.needsUpdate = true;
  }, [code, texture]);

  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * animationSpeed;
        meshRef.current.rotation.x += delta * (animationSpeed * 0.33);
        meshRef.current.rotation.z += delta * (animationSpeed * 0.13);
    }
    if (texture) {
        texture.offset.y -= delta * 0.03;
    }
  });

  return (
    <Center>
      <mesh ref={meshRef}>
        <extrudeGeometry args={[zShape, extrudeSettings]} />
        <meshPhysicalMaterial 
            ref={materialRef}
            map={texture}
            transmission={0.95} 
            thickness={2.5}
            roughness={0.1}
            ior={1.5}
            metalness={0.05}
            emissive="#00f0c0"
            emissiveMap={texture}
            emissiveIntensity={0.25}
            clearcoat={1}
            clearcoatRoughness={0.1}
            side={THREE.DoubleSide}
        />
      </mesh>
    </Center>
  );
};

export default LetterZ;
