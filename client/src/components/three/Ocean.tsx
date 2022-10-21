import * as THREE from 'three';
import React, { Suspense, useRef, useMemo } from 'react';
import {
  Canvas,
  extend,
  useThree,
  useLoader,
  useFrame,
} from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { Water } from 'three-stdlib';

extend({ Water });

export default function Ocean() {
  const ref = useRef();
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(THREE.TextureLoader, '/waternormals.jpeg');
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
      //@ts-ignore
      format: gl.encoding,
    }),
    [waterNormals]
  );
  useFrame(
    //@ts-ignore
    (state, delta) => (ref.current.material.uniforms.time.value += delta)
  );
  //@ts-ignore
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />;
}
