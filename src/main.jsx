import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./CSS/index.css";

export const ScrollContext = createContext();

const ScrollProvider = ({ children }) => {
  const [scrollValue, setScrollValue] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // console.log("Scrolling...", window.scrollY);
      setScrollValue(window.scrollY); // Get scroll position
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // console.log("Updated scrollValue:", scrollValue); // Debugging
  }, [scrollValue]);

  return (
    <ScrollContext.Provider value={scrollValue}>
      {children}
    </ScrollContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <style>
      @import
      url('https://fonts.googleapis.com/css2?family=Michroma&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');
    </style>
    <ScrollProvider>
      <App />
    </ScrollProvider>
  </React.StrictMode>
);
