import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import "./CSS/loader.css";

export default function Loader({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef(null);
  const progressBarRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return oldProgress + Math.random() * 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      logoRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1 }
    );
    gsap.fromTo(textRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });
  }, []);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 1.5,
        onComplete: () => setIsLoading(false),
      });
      setTimeout(onLoaded, 1500);
    }
  }, [progress, onLoaded]);

  return (
    isLoading && (
      <div className="loading-container" ref={loaderRef}>
        {/* Logo Animation */}
        <video
          ref={logoRef}
          src="logo.webm"
          className="logo"
          loop
          autoPlay
          muted
          playsInline
        />

        {/* Loading Bar */}
        <div className="loading-bar-container">
          <div className="loading-bar" ref={progressBarRef} />
        </div>

        {/* Loading Percentage */}
        <p className="loading-text" ref={textRef}>
          {Math.round(progress)}%
        </p>
      </div>
    )
  );
}
