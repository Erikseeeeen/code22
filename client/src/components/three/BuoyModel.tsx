import React, { useRef, useState } from 'react';
import { Canvas, MeshProps, useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber'
import { useFBX } from '@react-three/drei'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { Euler } from 'three';

export default function BuoyModel({buoyHeight, submerged}: {buoyHeight: number, submerged: boolean}) {
  const [timeCounter, setTimeCounter] = useState(0);

  const fbx = useFBX('/buoy.fbx')
  fbx.scale.set(0.01, 0.01, 0.01)
  useFrame((state, delta, xrFrame) => {
    setTimeCounter((t) => (t+delta))
    fbx.position.set(0, buoyHeight+Math.sin(timeCounter*4)*0.07+Math.sin(timeCounter*7)*0.025, 0)
    if(!submerged)
    {
      fbx.setRotationFromEuler(new Euler(Math.sin(timeCounter*4+1.3)*0.04,0,Math.sin(timeCounter*4)*0.1))
    }
  })

  return <mesh><primitive object={fbx} dispose={null}/></mesh>
}