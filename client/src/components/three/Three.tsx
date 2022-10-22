import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import BuoyModel from './BuoyModel';
import Ocean from './Ocean';
import { OrbitControls, Sky } from '@react-three/drei';

function Three() {

  const [submerged, setSubmerged] = useState(false);

  const submergedCameraHeight = 0;
  const submergedBuoyHeight = -2;
  const surfacedCameraHeight = 2;
  const surfacedBuoyHeight = -0.025;

  const cameraHeight = (submerged: boolean) => submerged ? submergedCameraHeight : surfacedCameraHeight
  const buoyHeight = (submerged: boolean) => submerged ? submergedBuoyHeight : surfacedBuoyHeight

  return (
    <>
    {submerged ? <div style={{ zIndex: 300, position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none'}}>
      <img style={{ opacity: 0.7, width: '100%', height: '100%'}} src="/underwater.jpeg"></img>
    </div> : <div style={{ zIndex: 300, position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', backgroundColor: "rgba(0,0,0,0.3)"}}>
    </div> }
    <Canvas
      style={{ height: '100%', borderRadius: '0.5em' }}
      camera={{ position: [0, cameraHeight(submerged), 10], fov: 55, near: 1, far: 20000 }}
    >
      <pointLight position={[100, 150, -100]} intensity={0.4} />
      <Suspense fallback={null}>
        <Ocean />
        <BuoyModel buoyHeight={buoyHeight(submerged)} submerged={submerged}/>
      </Suspense>
      <Sky sunPosition={[500, 150, -1000]} turbidity={0.5} />
      <OrbitControls />
    </Canvas></>
  );
}

export default Three;
