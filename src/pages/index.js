import Navbar from './components/Navbar';
import MainSection from './components/MainSection';
import Features from './components/Features';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';

export default function Home() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <Navbar />
      <MainSection />
      <div className="flex-grow">
        <Features />
      </div>
      <Footer />
    </div>
  );
}
