import { useGLTF,useVideoTexture,Text,Float} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {DoubleSide } from "three";
export default function Model2(){
    const nodes = useGLTF("./models/laptop/laptop.gltf");
    const texture = useVideoTexture("./models/videos/vid.mp4");
    texture.flipY = true;
    useFrame(()=>{
        // pyramids.current.rotation.x +=0.01;
        // pyramids.current.rotation.y +=0.01;
    });
    return<>

    <group position={[0,0,0]} rotation={[0,Math.PI*2,0]}>
    <primitive
         object={ nodes.scene }
    >

    <mesh 
        rotation={[-Math.PI*0.083,-Math.PI*2,0]} 
        position={[0,1.58,-1.41]}
        scale={[0.5,0.63,0.5]}
        
    >
        <planeGeometry args={[6,3]}></planeGeometry>
        <meshStandardMaterial map={texture} toneMapped={false} side={DoubleSide} clearcoat={1} clearcoatRoughness={0} roughness={0.4} metalness={0}/>
    </mesh>
    </primitive>


    <Float position={[-2,1,1]} rotation={[0,Math.PI*0.5,0]} floatingRange={[0,0.5]} floatIntensity={1} speed={1}>
          <Text font="./Rubik-SemiBold.woff" color='#ffffff' scale={[0.7,0.7,0.7]} textAlign="center">{'Web \n New Era'}</Text>
     </Float>
     <Text font="./Rubik-VariableFont_wght.woff"  color='#ffffff' position={[0,-0.1,2]} scale={[0.3,0.3,0.3]} rotation={[-Math.PI*0.5,0,0]} castShadow textAlign="center">{'Spechial Thanks To \n Mr,DooB'}</Text>

    </group>
</>;
}

