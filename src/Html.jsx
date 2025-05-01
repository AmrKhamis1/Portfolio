import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./CSS/htmll.css";
// Register plugins
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

  // Prevent scrolling until animation completes
  useEffect(() => {
    gsap.to("body", {
      overflowY: "hidden",
      duration: 0.2,
    });
  }, []);

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
  };

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
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        refs.starting.current.style.display = "none";
        // After start button fades out, show the intro text and scroll hint
        gsap.to(refs.intro.current, {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to("body", {
              overflowY: "auto",
              delay: 2,
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
      duration: 0.8,
      delay: 1,
      ease: "power3.inOut",
    });

    // Then add the bounce animation
    gsap.fromTo(
      ".hint",
      { y: 0 },
      {
        y: 20,
        duration: 1,
        ease: "power1.inOut",
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
        duration: 1.5,
        ease: "power3.inOut",
      });

      // Initialize animations but keep intro elements hidden until start is clicked
      gsap.set(refs.intro.current, { opacity: 0, scale: 0.8 });
      gsap.set(".hint", { opacity: 0 });

      // Show only the start button initially
      gsap.to(".starting", {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
      });

      // Initialize all other animations
      initializeAnimations();
    }
  }, [introFinished]);

  function initializeAnimations() {
    // Clean up any existing ScrollTriggers to prevent conflicts
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Smooth parallax fade out for intro container
    gsap.to(".intro-container", {
      opacity: 1,
      y: -100,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".pref-1",
        start: "top 90%",
        end: "top 10%",
        scrub: true,
      },
    });

    // Name section animation
    gsap.to(".pref-1", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".pref-1",
        start: "top 80%",
        end: "top 30%",
        scrub: true,
      },
    });

    // Staggered name animation
    ScrollTrigger.create({
      trigger: ".pref-1",
      start: "top 60%",
      onEnter: () => {
        gsap.fromTo(
          ".me-text",
          {
            opacity: 0,
            y: 30,
            filter: "blur(5px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
          }
        );

        gsap.fromTo(
          ".left-text",
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.5,
            ease: "power2.out",
          }
        );

        gsap.fromTo(
          ".my-text",
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power2.out",
          }
        );
      },
      once: true,
    });

    // About section animations
    ScrollTrigger.create({
      trigger: ".about",
      start: "top 70%",
      onEnter: () => {
        gsap.fromTo(
          ".about-h1",
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }
        );

        gsap.fromTo(
          ".about-p",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.4,
            ease: "power2.out",
          }
        );
      },
      once: true,
    });

    // Skills section heading animation
    ScrollTrigger.create({
      trigger: ".skills",
      start: "top 70%",
      onEnter: () => {
        gsap.fromTo(
          ".skills-h1",
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }
        );
      },
      once: true,
    });

    // Skill buttons with staggered appearance
    gsap.utils.toArray(".skill-btn").forEach((btn, index) => {
      ScrollTrigger.create({
        trigger: btn,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(
            btn,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: index * 0.1,
              ease: "power2.out",
            }
          );
        },
        once: true,
      });
    });

    // Contact section animations
    ScrollTrigger.create({
      trigger: ".contact",
      start: "top 70%",
      onEnter: () => {
        gsap.fromTo(
          ".contact-title",
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }
        );

        gsap.fromTo(
          ".contact-details",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power2.out",
          }
        );

        gsap.fromTo(
          ".contact-button",
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: 0.6,
            ease: "back.out(1.7)",
          }
        );
      },
      once: true,
    });

    // Staggered animation for contact items
    gsap.utils.toArray(".contact-item").forEach((item, i) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(
            item,
            { opacity: 0, x: -15 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              delay: i * 0.15,
              ease: "power2.out",
            }
          );
        },
        once: true,
      });
    });

    // Fun section animations
    ScrollTrigger.create({
      trigger: ".fun",
      start: "top 70%",
      onEnter: () => {
        gsap.fromTo(
          ".fun-h1",
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }
        );

        gsap.fromTo(
          ".fun-h2",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.4,
            ease: "power2.out",
          }
        );
      },
      once: true,
    });

    // Subtle hover effect for contact button
    const contactButton = document.querySelector(".contact-button");
    if (contactButton) {
      contactButton.addEventListener("mouseenter", () => {
        gsap.to(contactButton, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      contactButton.addEventListener("mouseleave", () => {
        gsap.to(contactButton, {
          scale: 1,
          duration: 0.3,
          ease: "power2.in",
        });
      });
    }
  }

  return (
    <div className="main" ref={mainRef}>
      {/* Intro section */}
      <div className="intro-container">
        <div ref={refs.starting} className="starting">
          <button
            onClick={handleStartClick}
            className="start-button"
            aria-label="Start exploring portfolio"
          >
            <h1>START</h1>
          </button>
        </div>

        <h1 ref={refs.intro} className="intro-text">
          HI
        </h1>

        <div className="hint" ref={refs.scrollHint}>
          <p>Scroll to discover</p>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M12 19L19 12M12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Name section */}
      <div className="pref-1" ref={refs.pref}>
        <p className="my-text">MY NAME IS</p>
        <h1 className="me-text" ref={refs.name}>
          AMR KHAMIS
        </h1>
        <div className="title-container">
          <p className="left-text" ref={refs.title}>
            Frontend Developer | WebGL Specialist
          </p>
        </div>
      </div>

      {/* About section */}
      <div id="about-me" className="about" ref={refs.about}>
        <h1 className="about-h1">ABOUT</h1>
        <div className="about-p-div">
          <p className="about-p">
            Software Engineer & Web Developer specializing in interactive web
            experiences and 3D visualizations. Focused on creating immersive
            digital solutions with cutting-edge technologies.
          </p>
        </div>
      </div>

      {/* Skills section */}
      <div id="skills-me" className="skills" ref={refs.skills}>
        <h1 className="skills-h1">EXPERTISE</h1>
        <div className="skills-container">
          <button className="skill-btn">React.js</button>
          <button className="skill-btn">Three.js</button>
          <button className="skill-btn">WebGL & GLSL</button>
          <button className="skill-btn">Animation</button>
          <button className="skill-btn">UI/UX Design</button>
          <button className="skill-btn">3D Modeling</button>
          <button className="skill-btn">JavaScript</button>
          <button className="skill-btn">GSAP</button>
          <button className="skill-btn">Node.js & Express.js</button>
          <button className="skill-btn">SQL</button>
          <button className="skill-btn">Networking</button>
          <button className="skill-btn">C++ & Java & Python</button>
          <button className="skill-btn">AI & ML</button>
        </div>
      </div>

      {/* Fun section */}
      <div id="fun-me" className="fun" ref={refs.about}>
        <h1 className="fun-h1">Having Fun?</h1>
        <h2 className="fun-h2">Let's create something amazing</h2>
      </div>

      {/* Contact section */}
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
