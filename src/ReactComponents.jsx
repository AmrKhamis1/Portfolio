
import "./CSS/html.css"
import React, { useState } from 'react'
import Three1 from "./Three1";
import Three2 from "./Three2";
import Three3 from "./Three3";
import Three4 from "./Three4";

export default function ReactComponents({scrolling,opacity}){
    const [choosing,setChoosing] = useState(0); 
    function handelMouse(handel){
        setChoosing(handel);
    }

    return <>
    <div className="background-vi" ></div>
       <div ref={scrolling} style={{opacity}} className="main-html" id="main-html">
            <div className="first-html">
            <h1 className="me firstme">AMR KHAMIS</h1>
                <p className="me-text">My name is Amr Khamis.
                   <br/> Creative and passionate full-stack web developer living in Cairo with a strong foundation in web development,
                   <br/> As a student in ICT I am currently advancing my skills in artificial intelligence and machine learning. With proven
                   <br/> experience in network administration and 3D modeling, I excel in problem-solving, and I am committed 
                   <br/> to continuous learning and professional growth.</p>
                   <div className="Three-First">
                        <Three1 data={opacity}></Three1>
                   </div>
                   <div className="Three-First-fade"></div>
            </div>

            <div className="second-html">
                
           
                <div className="right-side-react">
                    <h1 className="me2">Projects</h1>
                    <p className="me-text2">I had fun working on various projects alongside my studies in different types including:</p>
                    <div className="projects-buttons">
                        <div className="buttons-part1">
                            <button onClick={()=>handelMouse(2)} >Mobile</button> 
                            <button onClick={()=>handelMouse(1)} >Web</button> 
                            <button onClick={()=>handelMouse(3)}>Designs</button>
                        </div> 
                        <div className="buttons-part2">
                            <button onClick={()=>handelMouse(4)}>Laptop</button> 
                            <button onClick={()=>handelMouse(0)}>Back</button>
                        </div>
                    </div>
                </div>
                <div className="Three-Second">
                        <Three2 data={choosing}></Three2>
                   </div>
            </div>

            <div className="therd-html">
                <div className="left-side-react">
                    <h1 className="me2">Projects</h1>
                    <p className="me-text2">I had fun working on various projects alongside my studies in different 
                    <br/>types of projects including:</p>
                </div>
                <div className="Three-Therd">
                        <Three3></Three3>
                   </div>
            </div>

            <div className="forth-html">
                <div className="Three-Forth">
                        <Three4></Three4>
                   </div>
            </div>

            <div className="fifth-html">
            <section id="contact-me">
                    <div className="container">
                        <h2>Contact Me</h2>
                        <form action="#" method="post">
                            <div className="form-group">
                                <input type="text" id="name" name="name" required/>
                                <label htmlFor="name">Your Name</label>
                            </div>
                            <div className="form-group">
                                <input type="email" id="email" name="email" required/>
                                <label htmlFor="email">Your Email</label>
                            </div>
                            <div className="form-group">
                                <textarea id="message" name="message" rows="4" required ></textarea>
                                <label htmlFor="message">Your Message</label>
                            </div>
                            <button type="submit">Send Message</button>
                        </form>
                    </div>
                </section>
            </div>
       </div>
    </>
}
