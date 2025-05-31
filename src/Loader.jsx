import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import "./CSS/loader.css";

export default function Loader({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  //refs
  const refs = useRef({
    loader: null,
    progressBar: null,
    logo: null,
    text: null,
  });

  // progress update function
  const updateProgress = useCallback(() => {
    setProgress((oldProgress) => {
      if (oldProgress >= 100) return 100;
      return Math.min(oldProgress + Math.random() * 10, 100);
    });
  }, []);

  // progress animation
  useEffect(() => {
    const interval = setInterval(updateProgress, 300);
    return () => clearInterval(interval);
  }, [updateProgress]);

  // animations
  useEffect(() => {
    if (!refs.current.logo || !refs.current.text) return;

    const timeline = gsap.timeline();

    timeline
      .fromTo(
        refs.current.logo,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1 }
      )
      .fromTo(
        refs.current.text,
        { opacity: 0 },
        { opacity: 1, duration: 1 },
        0
      );
  }, []);

  // progress bar
  useEffect(() => {
    if (!refs.current.progressBar) return;

    gsap.to(refs.current.progressBar, {
      width: `${progress}%`,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [progress]);

  // loading completion
  useEffect(() => {
    if (progress < 100) return;

    gsap.to(refs.current.loader, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        setIsLoading(false);
        onLoaded?.();
      },
    });
  }, [progress, onLoaded]);

  if (!isLoading) return null;

  return (
    <div className="loading-container" ref={(el) => (refs.current.loader = el)}>
      {/* logo animation */}
      <video
        ref={(el) => (refs.current.logo = el)}
        src="logo.webm"
        className="logo"
        loop
        autoPlay
        muted
        playsInline
        preload="auto"
      />

      {/* loading bar container */}
      <div className="loading-bar-container">
        <div
          className="loading-bar"
          ref={(el) => (refs.current.progressBar = el)}
        />
      </div>

      {/* loading percentage */}
      <p className="loading-text" ref={(el) => (refs.current.text = el)}>
        Loading {Math.round(progress)}%
      </p>
      <br />
      <br />
      <p
        className="loading-text"
        style={{ fontSize: "17px", marginTop: "20px" }}
      >
        Quick Tip: use PC or Laptop for better experince !
      </p>
    </div>
  );
}
