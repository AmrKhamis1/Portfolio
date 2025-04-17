import "./CSS/about.css";
import "./CSS/first.css";
import "./CSS/projects.css";
import "./CSS/contact.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register plugins (only using plugins that come with standard GSAP)
gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function Html({
  introFinished,
  setHoverEffect,
  setStartClicked,
}) {
  // State to track if start button was clicked
  const [isStarted, setIsStarted] = useState(false);

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
  gsap.to("body", {
    overflow: "hidden",
    duration: 1.2,
  });
  // Create object to store all refs
  const refs = {
    starting: useRef(null),
    intro: useRef(null),
    scrollHint: useRef(null),
    pref: useRef(null),
    name: useRef(null),
    title: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    sections: useRef([]),
    contact: useRef(null),
    projects: useRef(null),
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

  // Handle start button click
  const handleStartClick = () => {
    setIsStarted(true);

    // Notify parent component that start was clicked
    if (setStartClicked) {
      setStartClicked(true);
    }

    // Animate start button out
    gsap.to(".starting", {
      opacity: 0,
      scale: 0.5,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        refs.starting.current.style.display = "none";
        // After start button fades out, show the intro text and scroll hint
        gsap.to(refs.intro.current, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to("body", {
              overflow: "auto",
            });
            // Start scroll hint animation after intro text appears
            animateScrollHint();
          },
        });
      },
    });
  };

  // Function to animate scroll hint
  const animateScrollHint = () => {
    // Make scroll hint visible first
    gsap.to(".hint", {
      opacity: 1,
      duration: 1,
      ease: "power3.inOut",
    });

    // Then add the bounce animation
    gsap.fromTo(
      ".hint",
      {
        y: 0,
      },
      {
        y: 30,
        duration: 1.2,
        ease: "elastic.out(1, 0.3)",
        repeat: -1,
        yoyo: true,
        delay: 0.5,
      }
    );
  };

  // Handle initial setup when loader finishes
  useEffect(() => {
    if (introFinished) {
      // Fade in main content
      gsap.to(".main", {
        opacity: 1,
        duration: 2,
        ease: "power3.inOut",
      });

      // Initialize animations but keep intro elements hidden until start is clicked
      gsap.set(refs.intro.current, { opacity: 0, scale: 0.8 });
      gsap.set(".hint", { opacity: 0 });

      // Show only the start button initially
      gsap.to(".starting", {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "back.out(1.7)",
      });

      // Initialize all other animations
      animation();
    }
  }, [introFinished]);

  function animation() {
    // Parallax fade out for intro container
    gsap.to(".intro-container", {
      opacity: 0,
      y: -300,
      scale: 0.9,
      duration: 6,
      ease: "expo.inOut",
      scrollTrigger: {
        trigger: ".pref-1",
        start: "top 50%",
        end: "top 5%",
        scrub: 0.5,
      },
    });

    // Stagger animation for name section
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
      },
      onStart: () => {
        // Instead of SplitText, we'll use a simple but effective animation for the name
        gsap.fromTo(
          ".me-text",
          {
            opacity: 0,
            y: 50,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.5,
            ease: "back.out(1.7)",
          }
        );

        // Title reveal with gradient
        gsap.fromTo(
          ".left-text",
          { width: 0, opacity: 0 },
          {
            width: "auto",
            opacity: 1,
            duration: 1.5,
            delay: 0.8,
            ease: "power4.out",
          }
        );
      },
    });

    // About section animations
    gsap.to(".about-h1", {
      x: 0,
      duration: 2,
      opacity: 1,
      scrollTrigger: {
        trigger: ".about-h1",
        start: "top 90%",
        end: "top 60%",
        scrub: 0.5,
      },
      onComplete: () => {
        // Add a subtle glow effect to heading
        gsap.to(".about-h1", {
          textShadow: "0 0 15px rgba(8, 247, 254, 0.7)",
          duration: 2,
          repeat: -1,
          yoyo: true,
        });
      },
    });

    // Paragraph animation - improved with reveal effect
    gsap.to(".about-p-div", {
      width: "70vw",
      duration: 2,
      opacity: 1,
      scrollTrigger: {
        trigger: ".about-p-div",
        start: "top 90%",
        end: "top 60%",
        scrub: 0.5,
      },
      onStart: () => {
        // Text reveal animation (without SplitText)
        gsap.fromTo(
          ".about-p",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.8,
            ease: "power3.inOut",
            delay: 0.3,
          }
        );
      },
    });

    // Skills section heading animation
    gsap.fromTo(
      ".skills-h1",
      { opacity: 0, y: -30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".skills",
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none none",
        },
      }
    );

    // Skill buttons with improved 3D hover and staggered appearance
    gsap.utils.toArray(".skill-btn").forEach((btn, index) => {
      // Staggered appearance from sides
      gsap.fromTo(
        btn,
        {
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          rotationY: index % 2 === 0 ? -30 : 30,
        },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: btn,
            start: "top 85%",
            end: "top 60%",
            scrub: 0.8,
          },
        }
      );

      // Enhanced hover animations
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.3,
          boxShadow: "0 0 20px rgba(88, 166, 255, 0.9)",
          ease: "power2.out",
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.3,
          boxShadow: "0 0 15px rgba(88, 166, 255, 0.7)",
          ease: "power2.in",
        });
      });
    });

    // Projects section animations
    gsap.fromTo(
      ".projects-h1",
      { opacity: 0, y: -30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".projects-container",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Project cards with staggered reveal
    gsap.utils.toArray(".projects-section").forEach((section, i) => {
      // Create staggered entry for project sections
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 60%",
            scrub: 0.5,
          },
        }
      );

      // Animate project details
      const projectTitle = section.querySelector(".project-title");
      const projectRole = section.querySelector(".project-role");
      const projectDesc = section.querySelector(".project-description");

      gsap.fromTo(
        [projectTitle, projectRole, projectDesc],
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Contact section animations
    gsap.fromTo(
      ".contact-container",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact",
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );

    // Staggered animation for contact items
    gsap.utils.toArray(".contact-item").forEach((item, i) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2 * i,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".contact-details",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Pulsing animation for contact button
    gsap.to(".contact-button", {
      boxShadow: "0 0 15px #00d4ff",
      scale: 1.03,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    });
  }

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
        <div ref={refs.starting} className="starting" style={{ opacity: 0 }}>
          <button
            onClick={handleStartClick}
            className="start-button"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0)",
              borderWidth: "2px",
              borderStyle: "solid",
              borderRadius: "8px",
              color: "#ffffff",
              padding: "15px 40px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 0 5px rgb(255, 255, 255)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <h1
              style={{
                fontSize: 20,
                margin: 0,
                fontFamily: "Montserrat",
                fontWeight: 600,
                color: "white",
              }}
            >
              START
            </h1>
          </button>
        </div>

        <h1
          ref={refs.intro}
          style={{
            fontSize: "4rem",
            margin: 0,
            color: "#ffffff",
            opacity: 0,
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
            opacity: 0, // Start with opacity 0, will be animated after start button is clicked
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
              stroke="#08f7fe"
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
      <div className="projects-container" ref={refs.projects}>
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
