import "./CSS/html.css"
import { Canvas } from '@react-three/fiber'
import {OrbitControls} from "@react-three/drei"
import * as THREE from 'three'
import Model from './Model.jsx'
import { useRef, useState } from "react"
import gsap from "gsap"



export default function Three2({data}){
    const [show,setShow]=useState(data);
    const controlls = useRef();
    if(data === 1 && controlls.current!=undefined){
        gsap.to(controlls.current.object.position,{x:1.5,y:4,z:-3,duration:1,ease:"power1.out"})
        gsap.to(controlls.current.target,{x:1.5,y:4,z:-4,duration:1,ease:"power1.out"})

    }else if(data === 2 && controlls.current!=undefined){
        gsap.to(controlls.current.object.position,{x:1.5,y:4,z:-3,duration:1,ease:"power1.out"})
        gsap.to(controlls.current.target,{x:1.5,y:4,z:-4,duration:1,ease:"power1.out"})

    }else if(data === 3 && controlls.current!=undefined){
        gsap.to(controlls.current.object.position,{x:1.5,y:4,z:-3,duration:1,ease:"power1.out"})
        gsap.to(controlls.current.target,{x:1.5,y:4,z:-4,duration:1,ease:"power1.out"})

    }else if(data === 0 && controlls.current!=undefined){
        gsap.to(controlls.current.object.position,{x:7,y:4,z:4,duration:1,ease:"power1.out"})
        gsap.to(controlls.current.target,{x:0,y:0,z:-3,duration:1,ease:"power1.out"})

    }else if(data === 4 && controlls.current!=undefined){
        gsap.to(controlls.current.object.position,{x:-1.5,y:2,z:-4.85,duration:1,ease:"power1.out"})
        gsap.to(controlls.current.target,{x:-2.5,y:2,z:-4.85,duration:1,ease:"power1.out"})
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
                            camera={{position:[7,4,4]}}
                            
                            
                        >
                            <OrbitControls ref={controlls} makeDefault target={[0,0,-3]}  enableRotate={false} enableZoom={false}></OrbitControls>
                            <ambientLight intensity={1}></ambientLight>  
                            <color args={['#1d1d1d']} attach="background"></color>
                            <Model texture={data}/>
                        </Canvas>
    
    
        </>
}