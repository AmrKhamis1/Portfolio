import "./CSS/html.css"
import { Canvas } from '@react-three/fiber'
import {OrbitControls,PresentationControls,ContactShadows} from "@react-three/drei"
import * as THREE from 'three'
import Model2 from "./Model2.jsx"



export default function Three3(){
    return <>

                        <Canvas
                            shadows
                            
                            gl={{
                            shadowMap: THREE.WebGLShadowMap,
                            shadowMapEnabled:true,
                            antialias:true,
                            toneMapping:THREE.NoToneMapping,
                            }
                            }
                        
                            camera={{position:[4,2.5,4]}}
                            
                        >
                            {/* <OrbitControls makeDefault target={[0,0,0]} maxPolarAngle={0.5} minPolarAngle={-1.5} maxAzimuthAngle={0.5} minAzimuthAngle={-0.5} enableRotate={true} enableZoom={false}></OrbitControls> */}
                            <ambientLight intensity={1}></ambientLight>  
                            <spotLight position={[2,2,2]} intensity={34}></spotLight>
                            <color args={['#1d1d1d']} attach="background"></color>
                            <PresentationControls
                                    global={false}
                                    polar={[0,0]}
                                    azimuth={[-0.1,0.9]}
                                    config={{mass:3,tension:200}}
                                    snap={{mass:1,tension:30}}
                            >
                            <Model2/>
                            </PresentationControls>
                            <ContactShadows
                                position-y={ - 0.9 }
                                position-z={0.2} 
                                opacity={ 0.3 }
                                scale={ 7.5 }
                                blur={ 3.8 }
                            />
                        </Canvas>
    
    
        </>
}