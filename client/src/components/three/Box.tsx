import React, { useRef, useState } from 'react';
import { Canvas, MeshProps, useFrame } from '@react-three/fiber';

export default function Box(props: any) {
  // This reference will give us direct access to the mesh
  const mesh = useRef<MeshProps>();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    if (mesh.current?.rotation) {
      //@ts-ignore
      mesh.current.rotation.x += 0.01;
      //@ts-ignore
      mesh.current.rotation.y += 0.01;
    }
  });
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}
