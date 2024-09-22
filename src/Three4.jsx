import "./CSS/html.css"
import { Canvas } from '@react-three/fiber'
import {OrbitControls} from "@react-three/drei"
import {EffectComposer,Bloom } from "@react-three/postprocessing";
import * as THREE from 'three'
import Model3 from "./Model3"


export default function Three4(){



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
                            camera={{position:[0,6,10]}}
                            
                        >
                            <OrbitControls makeDefault target={[0,6,0]} enableRotate={false} enableZoom={false}></OrbitControls>
                            <ambientLight intensity={9}></ambientLight>  
                            {/* <color args={['#000000']} attach="background"></color> */}
                            <EffectComposer>
                            <Bloom mipmapBlur radius={0.5}></Bloom>
                            
                            </EffectComposer>
                            <Model3/>
                        </Canvas>
    
    
        </>
}