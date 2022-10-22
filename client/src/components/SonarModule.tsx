import { Buoy, Module, Plot } from '../types';
import './ModuleContent.css';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import { LinePlot } from './Line';
import * as THREE from 'three';
import { OBJLoader } from 'three-stdlib';

function SonarModule({ module, buoy }: { module: Module; buoy: Buoy; }) {
    const element = useRef<HTMLDivElement>(null);
    const drawPointCloud = () => {
        let geometry = new THREE.TorusGeometry(10, 3, 16, 100)
        let material = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.25 })
        let mesh = new THREE.Points(geometry, material)

        










        let scene = new THREE.Scene();

        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.z = 35

        scene.add(mesh)
        const renderer = new THREE.WebGLRenderer();
        // renderer.setSize( element.current?.clientWidth??100, element.current?.clientHeight??100 );
        renderer.setSize( 200, 200 );
        renderer.render(scene, camera)
        element.current?.appendChild( renderer.domElement );
    }
    useEffect(() => {
        drawPointCloud()
    }, [])
  

  return (
    <div className="moduleContent">
        <div ref={element}>
            
        </div>
    </div>
  );
}

export default SonarModule;
