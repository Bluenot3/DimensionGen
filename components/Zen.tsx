import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Center } from '@react-three/drei';

interface ZenProps {
  code: string;
  animationSpeed: number;
}

const FONT_SIZE = 48;
const CANVAS_WIDTH = 2048;

const Zen: React.FC<ZenProps> = ({ code, animationSpeed }) => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const { zShape, eShape, nShape } = useMemo(() => {
    const s = 4; // half-width/height of a letter
    const thickness = 2; // stroke thickness of the letters
    const midBarHeight = thickness * 0.5;

    // Z Shape - A proper block letter Z defined by a continuous, non-intersecting outline
    const zShape = new THREE.Shape();
    zShape.moveTo( s, s ); // 1. top-right outer
    zShape.lineTo( -s, s ); // 2. top-left outer
    zShape.lineTo( -s, s - thickness ); // 3. top-left inner
    zShape.lineTo( s - thickness, -s + thickness ); // 4. top of diagonal
    zShape.lineTo( -s, -s + thickness ); // 5. bottom-left inner
    zShape.lineTo( -s, -s ); // 6. bottom-left outer
    zShape.lineTo( s, -s ); // 7. bottom-right outer
    zShape.lineTo( s, -s + thickness ); // 8. bottom-right inner
    zShape.lineTo( -s + thickness, s - thickness ); // 9. bottom of diagonal
    zShape.lineTo( s, s - thickness ); // 10. top-right inner
    zShape.closePath(); // 11. closes back to start

    // E Shape - A proper block letter E defined by a continuous, non-intersecting outline
    const eShape = new THREE.Shape();
    eShape.moveTo(-s, -s);
    eShape.lineTo(s, -s);
    eShape.lineTo(s, -s + thickness);
    eShape.lineTo(-s + thickness, -s + thickness);
    eShape.lineTo(-s + thickness, -midBarHeight);
    eShape.lineTo(s, -midBarHeight);
    eShape.lineTo(s, midBarHeight);
    eShape.lineTo(-s + thickness, midBarHeight);
    eShape.lineTo(-s + thickness, s - thickness);
    eShape.lineTo(s, s - thickness);
    eShape.lineTo(s, s);
    eShape.lineTo(-s, s);
    eShape.closePath();

    // N Shape - A proper block letter N defined by a continuous, non-intersecting outline
    const nShape = new THREE.Shape();
    nShape.moveTo(-s, -s); // 1. bottom-left outer
    nShape.lineTo(-s, s); // 2. up to top-left outer
    nShape.lineTo(-s + thickness, s); // 3. right to top-left inner
    nShape.lineTo(s - thickness, -s + thickness); // 4. This is the top edge of the diagonal bar.
    nShape.lineTo(s - thickness, s); // 5. up to top-right inner
    nShape.lineTo(s, s); // 6. right to top-right outer
    nShape.lineTo(s, -s); // 7. down to bottom-right outer
    nShape.lineTo(s - thickness, -s); // 8. left to bottom-right inner
    nShape.lineTo(-s + thickness, s - thickness); // 9. This is the bottom edge of the diagonal bar.
    nShape.lineTo(-s + thickness, -s); // 10. down to bottom-left inner
    nShape.closePath(); // 11. connects to start (bottom-left outer)

    return { zShape, eShape, nShape };
  }, []);

  const extrudeSettings = useMemo(() => ({
    steps: 2,
    depth: 2,
    bevelEnabled: true,
    bevelThickness: 0.4,
    bevelSize: 0.4,
    bevelOffset: 0,
    bevelSegments: 8,
  }), []);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = 4096;
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);
  
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
      map: texture,
      transmission: 0.95,
      thickness: 2.5,
      roughness: 0.05,
      ior: 1.5,
      metalness: 0.1,
      emissive: "#00f0c0",
      emissiveMap: texture,
      emissiveIntensity: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide
  }), [texture]);
  
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
    if (groupRef.current) {
        groupRef.current.rotation.y += delta * animationSpeed;
        groupRef.current.rotation.x += delta * (animationSpeed * 0.33);
        groupRef.current.rotation.z += delta * (animationSpeed * 0.15);
    }
    if (texture) {
        texture.offset.y -= delta * 0.03;
    }
  });

  return (
    <Center>
      <group ref={groupRef}>
        <mesh position={[-9.5, 0, 0]} material={material}>
          <extrudeGeometry args={[zShape, extrudeSettings]} />
        </mesh>
        <mesh position={[0, 0, 0]} material={material}>
          <extrudeGeometry args={[eShape, extrudeSettings]} />
        </mesh>
        <mesh position={[9.5, 0, 0]} material={material}>
          <extrudeGeometry args={[nShape, extrudeSettings]} />
        </mesh>
      </group>
    </Center>
  );
};

export default Zen;
