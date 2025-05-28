import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./CSS/htmll.css";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function Html({
  introFinished,
  setFreeClicked,
  setStartClicked,
}) {
  const [isStarted, setIsStarted] = useState(false);
  const [isFree, setIsFree] = useState(false);

  // main container ref
  const mainRef = useRef(null);

  //refs
  const refs = useRef({
    starting: null,
    intro: null,
    scrollHint: null,
    pref: null,
    name: null,
    title: null,
    about: null,
    goFreeButton: null,
  });

  const animateScrollHint = useCallback(() => {
    const timeline = gsap.timeline();

    timeline
      .to(".hint", {
        opacity: 1,
        duration: 0.8,
        delay: 1,
        ease: "power3.inOut",
      })
      .fromTo(
        ".hint",
        { y: 0 },
        {
          y: 20,
          duration: 1,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        }
      );
  }, []);

  const handleFreeClick = useCallback(() => {
    if (isFree) return; // prevent d-clicks

    setIsFree(true);
    setFreeClicked?.(true);

    const timeline = gsap.timeline();

    timeline
      .to("body", {
        overflowY: "hidden",
        duration: 0.2,
      })
      .to(
        ".about-p-div",
        {
          scale: 0.1,
          opacity: 0,
          duration: 1,
          ease: "power3.inOut",
        },
        0
      )
      .to(
        ".main",
        {
          opacity: 0,
          duration: 1,
          ease: "power3.inOut",
          onComplete: () => {
            if (mainRef.current) {
              mainRef.current.style.display = "none";
            }
          },
        },
        0
      );
  }, [isFree, setFreeClicked]);

  const handleStartClick = useCallback(() => {
    if (isStarted) return; // prevent d-clicks

    setIsStarted(true);
    setStartClicked?.(true);

    const timeline = gsap.timeline();

    timeline
      .to("body", {
        overflowY: "hidden",
        duration: 0.2,
      })
      .to(".starting", {
        opacity: 0,
        scale: 0.5,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          if (refs.current.starting) {
            refs.current.starting.style.display = "none";
          }
        },
      })
      .to(refs.current.intro, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.to("body", {
            overflowY: "scroll",
          });
          animateScrollHint();

          // refresh ScrollTrigger
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 3000);
        },
      });
  }, [isStarted, setStartClicked, animateScrollHint]);

  const initializeAnimations = useCallback(() => {
    // clean up
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // intro container parallax
    gsap.to(".intro-container", {
      opacity: 1,
      y: -100,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".pref-1",
        start: "top 90%",
        end: "top 10%",
        scrub: 0.5,
      },
    });

    // name animation
    gsap.to(".pref-1", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".pref-1",
        start: "top 80%",
        end: "top 30%",
        scrub: 0.5,
      },
    });

    // reusable animation function
    const animateNameElements = () => {
      const timeline = gsap.timeline();

      timeline
        .fromTo(
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
        )
        .fromTo(
          ".left-text",
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          0.5
        )
        .fromTo(
          ".my-text",
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          0.3
        );
    };

    // ScrollTrigger
    ScrollTrigger.create({
      trigger: ".pref-1",
      start: "top 50%",
      onEnter: animateNameElements,
      onEnterBack: animateNameElements,
    });

    // go free button
    ScrollTrigger.create({
      trigger: ".about",
      start: "top 20%",
      end: "top 0%",
      markers: true,
      scrub: true,
      animation: gsap.timeline().fromTo(
        ".about-p-div",
        {
          opacity: 0,
          scale: 0.5,
          z: -100,
        },
        {
          opacity: 1,
          scale: 1,
          z: 0,
          duration: 1,
        }
      ),
    });
  }, []);

  // scroll locking
  useEffect(() => {
    gsap.to("body", {
      overflowY: "hidden",
      duration: 0.2,
    });
  }, []);

  // intro finishes
  useEffect(() => {
    if (!introFinished) return;

    const timeline = gsap.timeline();

    // initial states
    gsap.set(refs.current.intro, { opacity: 0, scale: 0.8 });
    gsap.set(".hint", { opacity: 0 });
    gsap.set(".about-p-div", {
      opacity: 0,
      scale: 0.5,
      z: -100,
    });

    timeline
      .to(".main", {
        opacity: 1,
        duration: 1.5,
        ease: "power3.inOut",
      })
      .to(".starting", {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
      });

    initializeAnimations();
  }, [introFinished, initializeAnimations]);

  return (
    <div className="main" ref={mainRef}>
      <div className="intro-container">
        <div ref={(el) => (refs.current.starting = el)} className="starting">
          <button
            onClick={handleStartClick}
            className="start-button"
            aria-label="Start exploring portfolio"
            disabled={isStarted}
          >
            <h1>START</h1>
          </button>
        </div>

        <h1 ref={(el) => (refs.current.intro = el)} className="intro-text">
          HI
        </h1>

        <div className="hint" ref={(el) => (refs.current.scrollHint = el)}>
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

      <div className="pref-1" ref={(el) => (refs.current.pref = el)}>
        <p className="my-text">MY NAME IS</p>
        <div className="me-texts">
          <h1 className="me-text">AMR</h1>
          <h1 className="me-text">KHAMIS</h1>
        </div>
        <div className="title-container">
          <p className="left-text">Frontend Developer | WebGL Specialist</p>
        </div>
      </div>

      <div
        id="about-me"
        className="about"
        ref={(el) => (refs.current.about = el)}
      >
        <div
          ref={(el) => (refs.current.goFreeButton = el)}
          className="about-p-div"
        >
          <button
            className="start-free-button start-button"
            onClick={handleFreeClick}
            disabled={isFree}
          >
            <h1>Go Free</h1>
          </button>
        </div>
      </div>
    </div>
  );
}
