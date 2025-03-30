import "./CSS/about.css";
import "./CSS/first.css";
import "./CSS/projects.css";
import "./CSS/contact.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Html({ introFinished, setHoverEffect }) {
  // Main container ref
  const mainRef = useRef(null);
  const handleMouseEnter = useCallback(
    () => setHoverEffect(true),
    [setHoverEffect]
  );
  const handleMouseLeave = useCallback(
    () => setHoverEffect(false),
    [setHoverEffect]
  );
  // Create object to store all refs
  const refs = {
    intro: useRef(null),
    scrollHint: useRef(null),
    pref: useRef(null),
    name: useRef(null),
    title: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    sections: useRef([]),
    contact: useRef(null),
  };

  // Project sections
  const projects = [
    {
      id: "technotour",
      title: "TechnoTour",
      role: "Full-Stack Developer",
      description:
        "A 3D interactive web platform build for NCT University, allowing users to explore technological landmarks in an immersive way.",
    },
    {
      id: "smarthome",
      title: "Smart Home System",
      role: "IoT & Web Developer",
      description:
        "An IoT-based energy management system that integrates solar power, real-time monitoring, and AI-driven optimization.",
    },
    {
      id: "sedjet",
      title: "Sedjet",
      role: "3D Modeling",
      description: "A 3D blender Modeling for Sedjet Hot Sauce brand",
    },
    {
      id: "3-nexus",
      title: "3-Nexus",
      role: "3D & WebGL Developer",
      description:
        "A WebGL-powered simulation for complex 3D networking visualizations, helping users understand network topologies dynamically.",
    },
  ];
  // Handle intro animation trigger
  useEffect(() => {
    if (introFinished) {
      gsap.to(".main", {
        opacity: 1,
        duration: 5,
      });
      animation();
    }
  }, [introFinished]);

  // useEffect(() => {
  function animation() {
    gsap.fromTo(
      ".hint",
      { y: 0 },
      {
        y: 30,
        duration: 1,
        ease: "back.out(3)",
        repeat: -1,
        yoyo: true,
      }
    );
    gsap.to(".intro-container", {
      opacity: 0,
      y: -300,
      duration: 6,
      ease: "expo.inOut",
      scrollTrigger: {
        trigger: ".pref-1",
        start: "top 50%",
        end: "top 5%",
        scrub: 0.5,
        toggleActions: "restart none none none",
        //                            on enter   on leave  on enter back    on leave back
        //play pause resume reverse restart reset complete none
      },
    });
    gsap.to(".pref-1", {
      opacity: 1,
      x: 0,
      duration: 6,
      ease: "expo.inOut",
      scrollTrigger: {
        trigger: ".pref-1",
        start: "center 80%",
        end: "center 10%",
        scrub: 0.5,
        pin: true,
        toggleActions: "restart none none none",
      },
    });

    //about
    // gsap.to(".about", {
    //   x: 0,
    //   duration: 2,
    //   opacity: 1,
    //   scrollTrigger: {
    //     trigger: ".about",
    //     start: "top 90%",
    //     end: "top 60%",
    //     scrub: 0.5,
    //     pin: true,
    //     toggleActions: "restart none none none",
    //   },
    // });
    gsap.to(".about-h1", {
      x: 0,
      duration: 2,
      opacity: 1,
      scrollTrigger: {
        trigger: ".about-h1",
        start: "top 90%",
        end: "top 60%",
        scrub: 0.5,
        toggleActions: "restart none none none",
      },
    });
    gsap.to(".about-p-div", {
      width: "70vw",
      duration: 2,
      opacity: 1,
      scrollTrigger: {
        trigger: ".about-p-div",
        start: "top 90%",
        end: "top 60%",
        scrub: 0.5,
        toggleActions: "restart none none none",
      },
    });

    // skills
    gsap.utils.toArray(".skill-btn").forEach((btn, index) => {
      gsap.fromTo(
        btn,
        { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: btn,
            start: "top 85%",
            end: "top 60%",
            scrub: true,
            toggleActions: "restart none none none",
          },
        }
      );
    });
  }

  // about-p-div

  // Add elements to section refs
  const addToSectionRefs = (el) => {
    if (el && !refs.sections.current.includes(el)) {
      refs.sections.current.push(el);
    }
  };

  return (
    <div className="main" style={{ overflow: "hidden" }} ref={mainRef}>
      {/* Intro section */}
      <div
        className="intro-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 0,
          backgroundColor: "#08081400",
        }}
      >
        <h1
          ref={refs.intro}
          style={{
            fontSize: "4rem",
            margin: 0,
            color: "#ffffff",
          }}
        >
          Hi
        </h1>
        <div
          className="hint"
          ref={refs.scrollHint}
          style={{
            marginTop: "6rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#ffffff",
            opacity: 0.8,
          }}
        >
          <p style={{ margin: "0 0 0.5rem" }}>Scroll down</p>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M12 19L19 12M12 19L5 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {/* Portfolio content sections */}
      <div className="pref-1" ref={refs.pref}>
        <p className="my-text">MY NAME IS</p>
        <h1 className="me-text" ref={refs.name}>
          AMR KHAMIS
        </h1>
        <div className="title-container">
          <p className="left-text" ref={refs.title}>
            Web Developer | WebGL Developer
          </p>
        </div>
      </div>
      <div id="about-me" className="about" ref={refs.about}>
        <h1 className="about-h1">ABOUT</h1>
        <div className="about-p-div">
          <p className="about-p">
            I am a creative full-stack web developer and ICT student based in
            Cairo, with a strong foundation in web development, AI, and network
            administration. As an ICT student, I continuously expand my
            expertise in AI, machine learning. My work spans 3D interactive
            applications with Three.js, real-time web simulations, and network
            infrastructures using Cisco technologies. Passionate about IoT,
            shaders, and smart solutions, I thrive on problem-solving and
            innovation.
          </p>
        </div>
      </div>
      <div id="skills-me" className="skills" ref={refs.skills}>
        <h1 className="skills-h1">SKILLS</h1>
        <div className="skills-container">
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="skill-btn"
          >
            React.js & Vite.js
          </button>
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="skill-btn"
          >
            React Native
          </button>
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="skill-btn"
          >
            Three.js & GLSL
          </button>
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="skill-btn"
          >
            Node.js & Express.js
          </button>
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="skill-btn"
          >
            GSAP
          </button>
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="skill-btn"
          >
            Networking & Cisco
          </button>
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="skill-btn"
          >
            IoT & Smart Systems
          </button>
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="skill-btn"
          >
            3D Modeling (Blender)
          </button>
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="skill-btn"
          >
            MySQL
          </button>
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="skill-btn"
          >
            Linux
          </button>
        </div>
      </div>
      <div className="projects-container">
        <h1 className="projects-h1">PROJECTS</h1>

        {projects.map((project) => (
          <div key={project.id} id={project.id} className="projects-section">
            <div className="project-details">
              <h2 className="project-title">{project.title}</h2>
              <h3 className="project-role">{project.role}</h3>
              <p className="project-description">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div id="contact-me" className="contact" ref={refs.contact}>
        <div className="contact-container">
          <h1 className="contact-title">Get in Touch</h1>

          <div className="contact-details">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>khamisamr90@gmail.com</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>+201021477040</span>
            </div>
            <div className="contact-item">
              <i className="fab fa-linkedin"></i>
              <a
                href="https://www.linkedin.com/in/amr-khamis-51041622a/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
            <div className="contact-item">
              <i className="fab fa-github"></i>
              <a
                href="https://github.com/AmrKhamis1"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>

          <button
            className="contact-button"
            onClick={() =>
              (window.location.href = "mailto:khamisamr90@gmail.com")
            }
          >
            Say Hello
          </button>
        </div>
      </div>
    </div>
  );
}
