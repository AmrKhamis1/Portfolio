import React, { useRef, useState } from 'react'
import {useProgress} from "@react-three/drei"
import './CSS/index.css'
import "./CSS/Intro.css"
import ReactComponents from './ReactComponents'


export default function App()
{

    const [htmlElements,setHtmlElements]= useState(0);
    const [show,setShow]= useState(1);
    const {progress}=useProgress();
    const bar = useRef();
    const introDiv = useRef();
    const loading = useRef();

    function intro(){
        if(bar.current!=undefined ){
            bar.current.style.width = ((progress/100)*30)+"%";
            if(loading.current!= undefined){
                const loadingPer = progress.toFixed();
                loading.current.innerHTML = "Loading "+loadingPer+"%"
            }
            if(progress === 100 && introDiv.current!= undefined){
                introDiv.current.style.opacity = 0;
                setTimeout(()=>{
                    introDiv.current.style.display = "none";
                    setHtmlElements(1);
                    setShow(0);
                },1500);
            }
        }
        
    }
    intro()





    return <> 
        

        {show && (<div ref={introDiv} className='intro-div'>            
                    <div className="intro">
                        <img className="intro-img" src="./imgs/AK logo.png" alt="" />
                        <div ref={loading} className='loading'> Loading  </div>
                        <div ref={bar}  className="Loading-Bar"></div>
                    </div>
                </div>)
            }
            <ReactComponents opacity={htmlElements} ></ReactComponents>

       
    
    </>


}

