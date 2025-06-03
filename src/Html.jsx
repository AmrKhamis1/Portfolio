import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./CSS/htmll.css";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function Html({ introFinished, setStartClicked }) {
  const [isStarted, setIsStarted] = useState(false);

  // refs
  const mainRef = useRef(null);
  const startingRef = useRef(null);
  const introRef = useRef(null);
  const scrollHintRef = useRef(null);
  const prefRef = useRef(null);
  const aboutRef = useRef(null);
  const goFreeButtonRef = useRef(null);

  // timeline configurations
  const timelineConfigs = useMemo(
    () => ({
      scrollHint: {
        fadeIn: { opacity: 1, duration: 0.2, ease: "power3.inOut" },
        bounce: {
          y: 20,
          duration: 1,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        },
      },
      startClick: {
        bodyLock: { overflowY: "hidden", duration: 0.2 },
        startingFade: {
          opacity: 0,
          scale: 0.5,
          duration: 0.2,
          ease: "power3.inOut",
        },
        introShow: {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "back.out(1.7)",
        },
      },
      nameElements: {
        meText: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
        },
        leftText: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
        myText: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      },
    }),
    []
  );

  // scroll hint
  const animateScrollHint = useCallback(() => {
    const timeline = gsap.timeline();
    const { fadeIn, bounce } = timelineConfigs.scrollHint;

    timeline.to(".hint", fadeIn).fromTo(".hint", { y: 0 }, bounce);
  }, [timelineConfigs.scrollHint]);

  // start click handler
  const handleStartClick = useCallback(() => {
    if (isStarted) return;

    setIsStarted(true);
    setStartClicked?.(true);

    const timeline = gsap.timeline();
    const { bodyLock, startingFade, introShow } = timelineConfigs.startClick;

    timeline
      .to("body", bodyLock)
      .to(".starting", {
        ...startingFade,
        onComplete: () => {
          if (startingRef.current) {
            startingRef.current.style.display = "none";
          }
        },
      })
      .to(introRef.current, {
        ...introShow,
        onComplete: () => {
          gsap.to("body", { overflowY: "scroll" });
          animateScrollHint();
        },
      });
  }, [
    isStarted,
    setStartClicked,
    timelineConfigs.startClick,
    animateScrollHint,
  ]);

  // name elements animation
  const animateNameElements = useCallback(() => {
    const timeline = gsap.timeline();
    const { meText, leftText, myText } = timelineConfigs.nameElements;

    timeline
      .fromTo(".me-text", { opacity: 0, y: 30, filter: "blur(5px)" }, meText)
      .fromTo(".left-text", { opacity: 0, x: -20 }, leftText, 0.5)
      .fromTo(".my-text", { opacity: 0, x: 20 }, myText, 0.3);
  }, [timelineConfigs.nameElements]);

  const initializeAnimations = useCallback(() => {
    // Cleanup
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // into container parallax
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

    // name fade
    gsap.to(".pref-1", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".pref-1",
        start: "top 80%",
        end: "top 30%",
        scrub: 0.5,
      },
    });

    ScrollTrigger.create({
      trigger: ".pref-1",
      start: "top 50%",
      onEnter: animateNameElements,
      onEnterBack: animateNameElements,
    });

    // go free
    ScrollTrigger.create({
      trigger: ".about",
      start: "top 20%",
      end: "top 0%",
      scrub: true,
      animation: gsap
        .timeline()
        .fromTo(
          ".about-p-div",
          { opacity: 0, scale: 0.5, z: -100 },
          { opacity: 1, scale: 1, z: 0, duration: 1 }
        ),
    });
  }, [animateNameElements]);

  // scroll lock
  useEffect(() => {
    gsap.to("body", { overflowY: "hidden", duration: 0.2 });
  }, []);

  // intro finished effect
  useEffect(() => {
    if (!introFinished) return;

    const timeline = gsap.timeline();

    // Set initial states
    gsap.set(introRef.current, { opacity: 0, scale: 0.8 });
    gsap.set(".hint", { opacity: 0 });
    gsap.set(".about-p-div", { opacity: 0, scale: 0.5, z: -100 });

    // main
    timeline
      .to(".main", { opacity: 1, duration: 0.5, ease: "power3.inOut" })
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
        <div ref={startingRef} className="starting">
          <button
            onClick={handleStartClick}
            className="start-button"
            aria-label="Start exploring portfolio"
            disabled={isStarted}
          >
            <h1>START</h1>
          </button>
        </div>

        <h1 ref={introRef} className="intro-text">
          HI
        </h1>

        <div className="hint" ref={scrollHintRef}>
          <p>Scroll to discover</p>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
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

      <div className="pref-1" ref={prefRef}>
        <p className="my-text">MY NAME IS</p>
        <div className="me-texts">
          <h1 className="me-text">AMR</h1>
          <h1 className="me-text">KHAMIS</h1>
        </div>
        <div className="title-container">
          <p className="left-text">Web-Mobile Developer | WebGL Developer</p>
        </div>
      </div>

      <div id="about-me" className="about" ref={aboutRef}>
        <div ref={goFreeButtonRef} className="about-p-div"></div>
      </div>
    </div>
  );
}
