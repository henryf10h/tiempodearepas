import Image from 'next/image'
import Navbar from './components/Navbar';
import MainSection from './components/MainSection';
import { useState, useEffect } from 'react'; // this is required to use useState

export default function Home() {

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
      setMounted(true)}
    ,[])


  return (
    <div>
      <Navbar />
      <MainSection />
    </div>
  );
}