import { useGLTF,useTexture,Html,PresentationControls,Image } from "@react-three/drei";
import {useRef, useState} from "react";
import * as THREE from 'three'

export default function Model({texture}){
    const {nodes} = useGLTF("./models/room/Room.glb");
    const modelMaterial = useTexture("./models/room/final baked.jpg");
    const matrials = useRef();
    const tvTextures =[useTexture("./imgs/hold.png"),useTexture("./imgs/1.png"),useTexture("./imgs/2.png"),useTexture("./imgs/3.png")];
    const tvTexture0=useTexture("./imgs/hold.png");
    tvTexture0.colorSpace = THREE.SRGBColorSpace;
    const tvTexture1 = useTexture("./imgs/1.png");
    tvTexture1.colorSpace = THREE.SRGBColorSpace;
    const tvTexture2 = useTexture("./imgs/2.png");
    tvTexture2.colorSpace = THREE.SRGBColorSpace;
    const tvTexture3 = useTexture("./imgs/3.png");
    tvTexture3.colorSpace = THREE.SRGBColorSpace;
    modelMaterial.flipY = false;
    let controllsEnabled = true;
    const mackbook = useRef();
      if(texture===0 && matrials.current!=undefined){
            matrials.current.map = tvTexture0;
            controllsEnabled = true;

      }else if(texture===1 && matrials.current!=undefined){
            matrials.current.map = tvTexture1;
            controllsEnabled = false;

      }else if(texture===2 && matrials.current!=undefined){
            matrials.current.map = tvTexture2;
            controllsEnabled = false;


      }else if(texture===3 && matrials.current!=undefined ){
            matrials.current.map = tvTexture3;
            matrials.current.map.colorSpace = THREE.SRGBColorSpace;
            matrials.current.map.encoding = THREE.sRGBEncoding;
            controllsEnabled = false;

      }else if(texture===4 && matrials.current!=undefined){
         controllsEnabled = false;

      }
   
  


    return<>
    <PresentationControls 
      enabled={controllsEnabled}
      global={false}
      polar={[0,0]}
      azimuth={[-0.2,0.2]}
      config={{mass:3,tension:200}}
      snap={{mass:2,tension:300}}
    >
        <group position={[0,0,0]} rotation={[0,Math.PI*0.5,0]}>
     <mesh geometry={nodes.room.geometry} position={nodes.room.position}>
        <meshBasicMaterial  toneMapped={false}  map={modelMaterial}  ></meshBasicMaterial>
     </mesh>
     <mesh geometry={nodes.bed1.geometry} position={nodes.bed1.position} rotation={nodes.bed1.rotation}>
        <meshBasicMaterial  toneMapped={false}  map={modelMaterial}  ></meshBasicMaterial>
     </mesh>
     <mesh geometry={nodes.bed2.geometry} position={nodes.bed2.position} rotation={nodes.bed2.rotation}>
        <meshBasicMaterial  toneMapped={false}  map={modelMaterial}  ></meshBasicMaterial>
     </mesh>
     <mesh geometry={nodes.TV.geometry} position={nodes.TV.position}>
     <meshBasicMaterial   map={modelMaterial} > </meshBasicMaterial>

<mesh
   rotation={[0,-Math.PI*0.5,0]}
   position={[-0.0105,0,0]}
   scale={[0.5,0.45,0.5]}
>
   <planeGeometry args={[4,3]}></planeGeometry>
   <meshBasicMaterial ref={matrials} toneMapped={false} map={tvTexture0}></meshBasicMaterial>
</mesh>
     </mesh>
     <mesh 
     ref={mackbook}
     geometry={nodes.Macbook.geometry} 
     position={nodes.Macbook.position}
     >
         <Html wrapperClass="htmlScreen"  occlude="blending" fullscreen transform  distanceFactor={0.5} prepend  scale={[0.87,0.67,1]} center position={[0,0.425,-0.4115]}>
            <iframe src="./website/index.html" ></iframe>
         </Html>
        <meshBasicMaterial    map={modelMaterial} > </meshBasicMaterial>


     </mesh>
     <pointLight intensity={90}></pointLight>
     </group>
     </PresentationControls>
     </>;
}

