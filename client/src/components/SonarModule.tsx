import { Buoy, Module, Plot } from "../types";
import "./ModuleContent.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { LinePlot } from "./Line";
import * as THREE from "three";
import { OBJLoader } from "three-stdlib";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three-stdlib";
import { PointerLockControls } from "three-stdlib";
import { Euler } from "three";

function SonarModule({ module, buoy }: { module: Module; buoy: Buoy }) {
  const element = useRef<HTMLDivElement>(null);
  const drawPointCloud = () => {
    console.log("whoop");
    const loader = new OBJLoader();
    loader.load(
      "/submarinenice.obj",
      (obj) => {
        // the request was successfull
        let material = new THREE.PointsMaterial({
          color: 0xffffff,
          sizeAttenuation: true,
          size: 0.015,
        });
        //@ts-ignore
        let mesh = new THREE.Points(obj.children[0].geometry, material);

        let scene = new THREE.Scene();

        let camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );

        scene.add(mesh);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(
          element.current?.clientWidth ?? 100,
          element.current?.clientHeight ?? 100
        );
        //renderer.setSize(400, 400);
        // camera.position.x = 6;
        // camera.position.y = 3.5;
        // camera.position.z = -2;
        // camera.position. = { x: 2.9514219402882294, y: 6.890118963801542, z: 2.680170703679929 }
        camera.position.x = 7.103141816153798
        camera.position.y = 4.714709232051763
        camera.position.z = -4.350312930872963
        const flycontroller = new FlyControls( camera, renderer.domElement);
        flycontroller.movementSpeed = 0.005
        flycontroller.dragToLook = true
        flycontroller.rollSpeed = 0.0025
        function animate() {
          requestAnimationFrame( animate );
          flycontroller.update(1000/100);
          renderer.render( scene, camera );
          // console.log(camera.position);
        }
        animate();
        

        if (element.current?.firstElementChild != null)
          element.current?.removeChild(element.current?.firstElementChild);
        element.current?.appendChild(renderer.domElement);
      },
      (xhr) => {
        // the request is in progress
        //console.log(xhr);
      },
      (err) => {
        // something went wrong
        console.error("loading .obj went wrong, ", err);
      }
    );
  };

  
  useEffect(() => {
    drawPointCloud();
  }, []);

  return (
    <div className='moduleContent'>
      <div
        ref={element}
        style={{ display: "block", width: "100%", height: "100%" }}
      ></div>
    </div>
  );
}

export default SonarModule;
