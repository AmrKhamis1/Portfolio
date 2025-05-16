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
  setFreeClicked,
  setStartClicked,
}) {
  // State to track if start button was clicked
  const [isStarted, setIsStarted] = useState(false);
  const [isFree, setIsFree] = useState(false);

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
  };

  // Handle Free button click
  const handleFreeClick = () => {
    setIsFree(true);

    // Notify parent component that start was clicked
    if (setFreeClicked) {
      setFreeClicked(true);
    }

    // Prevent scrolling during initial animation
    gsap.to("body", {
      overflowY: "hidden",
      duration: 0.2,
    });

    // Animate start button out
    gsap.to(".about-p-div", {
      scale: 0.1,
      opacity: 0,
      duration: 1,
      ease: "power3.inOut",
    });
    gsap.to(".main", {
      opacity: 0,
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
        if (mainRef.current) {
          mainRef.current.style.display = "none";
        }
      },
    });
  };
  // Handle start button click
  const handleStartClick = () => {
    setIsStarted(true);

    // Notify parent component that start was clicked
    if (setStartClicked) {
      setStartClicked(true);
    }

    // Prevent scrolling during initial animation
    gsap.to("body", {
      overflowY: "hidden",
      duration: 0.2,
    });

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
            // Delay allowing scrolling until animations complete
            gsap.to("body", {
              overflowY: "scroll",
              delay: 5, // Increased to allow intro camera animation to complete
            });

            // Start scroll hint animation after intro text appears
            animateScrollHint();

            // Refresh ScrollTrigger after everything is set up
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 3000);
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
      start: "top 50%",
      onEnterBack: () => {
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
    });
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
        <div className="me-texts">
          <h1 className="me-text" ref={refs.name}>
            AMR
          </h1>
          <h1 className="me-text" ref={refs.name}>
            KHAMIS
          </h1>
        </div>
        <div className="title-container">
          <p className="left-text" ref={refs.title}>
            Frontend Developer | WebGL Specialist
          </p>
        </div>
      </div>

      {/* About section */}
      <div id="about-me" className="about" ref={refs.about}>
        <div ref={refs.about} className="about-p-div">
          <button className="start-button" onClick={handleFreeClick}>
            <h1> Go Free</h1>
          </button>
        </div>
      </div>
    </div>
  );
}
