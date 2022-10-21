import React, { Suspense, useRef, useState } from 'react';
import { Canvas, MeshProps, useFrame } from '@react-three/fiber';
import Box from '../components/Box';
import Ocean from '../components/Ocean';
import { OrbitControls, Sky } from '@react-three/drei';

function Three() {
  return (
    <div className="App">
      <h1>Havbouye</h1>
      <Canvas
        style={{ height: '500px' }}
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
      ,
    </div>
  );
}

export default Three;
