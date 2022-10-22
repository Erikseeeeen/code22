import { Buoy, Module, Plot } from '../types';
import './ModuleContent.css';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import { LinePlot } from './Line';
import * as THREE from 'three';
import { OBJLoader } from 'three-stdlib';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Euler } from 'three';

function SonarModule({ module, buoy }: { module: Module; buoy: Buoy; }) {
    const element = useRef<HTMLDivElement>(null);
    const [myInterval, setMyInterval] = useState<NodeJS.Timeout>()


    const [timeCounter, setTimeCounter] = useState(0.0)

    const drawPointCloud = () => {
        const loader = new OBJLoader()
        loader.load('/submarinenice.obj',
        (obj) => {
            // the request was successfull
            let material = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.25 })
            //@ts-ignore
            let mesh = new THREE.Points(obj.children[0].geometry, material)
            mesh.position.y = -15 //this model is not exactly in the middle by default so I moved it myself
            
            let scene = new THREE.Scene();

            let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
            camera.position.z = 25
            camera.setRotationFromEuler(
              new Euler(
                timeCounter,
                0,
                0,
              )
            );

            scene.add(mesh)
            const renderer = new THREE.WebGLRenderer();
            // renderer.setSize( element.current?.clientWidth??100, element.current?.clientHeight??100 );
            renderer.setSize( 400, 400 );
            renderer.render(scene, camera)
            if(element.current?.firstElementChild != null)
                element.current?.removeChild(element.current?.firstElementChild)
            element.current?.appendChild( renderer.domElement );
        },
        (xhr) => {
            // the request is in progress
            console.log(xhr)
        },
        (err) => {
            // something went wrong
            console.error("loading .obj went wrong, ", err)
        })
    }
    const doThing = () => {
        setTimeCounter(timeCounter+0.001)
    }
    useEffect(() => {
        clearInterval(myInterval)
        setMyInterval(setInterval(doThing, 1000))
        drawPointCloud()
        return () => clearInterval(myInterval)
    }, [])
  

  return (
    <div className="moduleContent">
        <div ref={element}>
            
        </div>
    </div>
  );
}

export default SonarModule;
