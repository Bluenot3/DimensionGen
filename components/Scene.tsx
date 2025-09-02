
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import LetterZ from './LetterZ';
import BlockZ from './BlockZ';
import TorusKnot from './TorusKnot';
import Sphere from './Sphere';
import Cube from './Cube';
import Pyramid from './Pyramid';
import Zen from './Zen';
import { ShapeType } from '../App';

interface SceneProps {
  code: string;
  shape: ShapeType;
  animationSpeed: number;
  zoomEnabled: boolean;
}

const Scene: React.FC<SceneProps> = ({ code, shape, animationSpeed, zoomEnabled }) => {
  return (
    <Canvas camera={{ position: [0, 0, 25], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, 10]} color="#4a90e2" intensity={2} />
      <Suspense fallback={null}>
        {shape === 'Z' && <LetterZ code={code} animationSpeed={animationSpeed} />}
        {shape === 'BlockZ' && <BlockZ code={code} animationSpeed={animationSpeed} />}
        {shape === 'TorusKnot' && <TorusKnot code={code} animationSpeed={animationSpeed} />}
        {shape === 'Sphere' && <Sphere code={code} animationSpeed={animationSpeed} />}
        {shape === 'Cube' && <Cube code={code} animationSpeed={animationSpeed} />}
        {shape === 'Pyramid' && <Pyramid code={code} animationSpeed={animationSpeed} />}
        {shape === 'ZEN' && <Zen code={code} animationSpeed={animationSpeed} />}
        <Environment preset="city" />
      </Suspense>
      <OrbitControls enableZoom={zoomEnabled} enablePan={false} minDistance={10} maxDistance={50} />
    </Canvas>
  );
};

export default Scene;
