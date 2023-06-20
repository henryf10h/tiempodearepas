import Navbar from './components/Navbar';
import MainSection from './components/MainSection';
import { useState, useEffect } from 'react'; // this is required to use useState

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
    </div>
  );
}