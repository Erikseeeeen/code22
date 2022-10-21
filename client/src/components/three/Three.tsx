import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Box from './Box';
import Ocean from './Ocean';
import { OrbitControls, Sky } from '@react-three/drei';

function Three() {
  return (
    <Canvas
      style={{ height: '100%' }}
      camera={{ position: [0, 1, 10], fov: 55, near: 1, far: 20000 }}
    >
      <pointLight position={[100, 100, 100]} />
      <pointLight position={[-100, -100, -100]} />
      <Suspense fallback={null}>
        <Ocean />
        <Box />
      </Suspense>
      <Sky sunPosition={[500, 150, -1000]} turbidity={0.1} />
      <OrbitControls />
    </Canvas>
  );
}

export default Three;
