import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MeshBasicMaterial } from "three";
export default function Model3(){
    const {nodes} = useGLTF("./models/logos/logos.glb");
    const model1 = useRef();
    const model2 = useRef();
    const model3 = useRef();
    useFrame(()=>{

        model2.current.rotation.x +=0.001;
        model2.current.rotation.y +=0.001;

        model3.current.rotation.x +=0.001;
        model3.current.rotation.y +=0.001;
    });
    return<>


    <primitive
        ref={model2}
        object={ nodes.React }
        scale={[0.3,0.3,0.3]}
        position={[11,6,0]}
    >
        <meshBasicMaterial color={[0.4,2.2,2.2]}></meshBasicMaterial>
    </primitive>
    <primitive
        ref={model3}
        object={ nodes.Three }
        position={[-12,10,0]}
        scale={[0.03,0.03,0.03]}
    >
        <meshBasicMaterial color={[3.2,0.6,3.2]}></meshBasicMaterial>
    </primitive>
</>;
}

