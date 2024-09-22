import { useGLTF,Float,Text,PresentationControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useRef } from "react";

export default function LogoIntro(){
    const {nodes} = useGLTF("./models/main logo/AK 3D.glb");
    const logoMaterial = useRef();
    const shadows = useRef();
    const texts = useRef();
    useFrame(()=>{
          // texts.current.rotation.z -=0.01;
    },);
    setInterval(()=>{
     if(logoMaterial.current!=undefined && shadows.current !=undefined){
     if(logoMaterial.current.color.r ==0.5 ){
          gsap.to(shadows.current.color,{r:1,g:0,b:1,duration:5,ease:"expo.inOut"});    
          gsap.to(logoMaterial.current.color,{r:5,g:0.5,b:5,duration:5,ease:"expo.inOut"});
     }else if(logoMaterial.current.color.r ==5){
          gsap.to(shadows.current.color,{r:0,g:1,b:1,duration:5,ease:"expo.inOut"});    
          gsap.to(logoMaterial.current.color,{r:0.5,g:5,b:5,duration:5,ease:"expo.inOut"});
     }
}

    },5000);
    
    return<>
        <PresentationControls 
        global={false}
        polar={[0,0.5]}
        azimuth={[-0.5,0.5]}
        config={{mass:9,tension:200}}
        snap={{mass:2,tension:100}}
    >
          <Float position={[-2,1,2]} floatingRange={[0,0.5]} floatIntensity={2} speed={2}>
               <Text font="./NewAmsterdam-Regular.woff" color='#eeeeee'  scale={[0.3,0.3,0.3]} castShadow={false}>HTML</Text>
          </Float>

          <Float position={[-5,2,-2]} floatingRange={[0,0.5]} floatIntensity={2} speed={2}>
               <Text font="./NewAmsterdam-Regular.woff" color='#eeeeee' scale={[0.3,0.3,0.3]} castShadow={false}>CSS</Text>
          </Float>

          <Float position={[-1,5,-2]} floatingRange={[0,0.5]} floatIntensity={2} speed={2}>
               <Text font="./NewAmsterdam-Regular.woff" color='#eeeeee' scale={[0.3,0.3,0.3]} castShadow={false}>JS</Text>
          </Float>


          <Float position={[3,0,0]} floatingRange={[0,0.5]} floatIntensity={2} speed={2}>
               <Text font="./NewAmsterdam-Regular.woff"  color='#eeeeee' scale={[0.3,0.3,0.3]} castShadow={false}>React</Text>
          </Float>

          <Float position={[3,3,1]} floatingRange={[0,0.5]} floatIntensity={2} speed={2}>
               <Text font="./NewAmsterdam-Regular.woff" color='#eeeeee' scale={[0.3,0.3,0.3]} castShadow={false}>Node JS</Text>
          </Float>

          <Float position={[1,5,-3]} floatingRange={[0,0.5]} floatIntensity={2} speed={2}>
               <Text font="./NewAmsterdam-Regular.woff" color='#eeeeee' scale={[0.3,0.3,0.3]} castShadow={false}>Express JS</Text>
          </Float>
          <Float position={[-4,3,-7]} floatingRange={[0,0.5]} floatIntensity={2} speed={2}>
               <Text font="./NewAmsterdam-Regular.woff" color='#eeeeee' scale={[0.3,0.3,0.3]} castShadow={false}>Graphic Design</Text>
          </Float>
     <mesh 
     ref={texts}
     geometry={nodes.Plane.geometry} 
     position={nodes.Plane.position}
     rotation={nodes.Plane.rotation}
          >
                <meshBasicMaterial ref={logoMaterial} color={[0.5,5,5]}>
                </meshBasicMaterial>
     </mesh>
     </PresentationControls>

     <pointLight ref={shadows} position={[0,1,0]} color={[0,1,1]} intensity={50}></pointLight>
     <mesh position={[0,-1,0]} receiveShadow  rotation={[-Math.PI*0.5,0,0]}>
          <planeGeometry args={[300,300]}>  </planeGeometry>
          <meshStandardMaterial  color={"#1d1d1d"}>
          </meshStandardMaterial>
     </mesh>

     </>;
}