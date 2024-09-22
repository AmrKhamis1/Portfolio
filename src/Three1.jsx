

import "./CSS/html.css"
import React, {useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import {OrbitControls} from "@react-three/drei"
import * as THREE from 'three'
import LogoIntro from "./LogoIntro.jsx"
import {EffectComposer,Bloom } from "@react-three/postprocessing";
import gsap from "gsap"




export default function Three1({data=0}){
    const controlls = useRef();
    if(data==1 && controlls.current){
        gsap.to(controlls.current.object.position,{x:0,y:0.7,z:6,duration:3,ease:"power1.out"})
    }

    return <>

                        <Canvas
                            shadows
                            gl={{
                            shadowMap: THREE.WebGLShadowMap,
                            shadowMapEnabled:true,
                            antialias:true,
                            toneMapping:THREE.NoToneMapping
                            }
                            }
                            camera={{position:[-30,6,40]}}
                            
                        >
                            <OrbitControls ref={controlls}  makeDefault target={[0,0.7,0]} enableRotate={true} enableZoom={true}></OrbitControls>
                            {/* <fog attach="fog" args={[0x252525,6,15]}></fog> */}
                            
                            <ambientLight intensity={3.2}></ambientLight>  
                            <color args={['#1d1d1d']} attach="background"></color>
                            <EffectComposer>
                            <Bloom mipmapBlur radius={0.2}></Bloom>
                            
                            </EffectComposer>
                            <LogoIntro/>
                        </Canvas>
    
    
        </>
}