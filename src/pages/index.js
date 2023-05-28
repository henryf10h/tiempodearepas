import Image from 'next/image'
import Navbar from './components/Navbar';
import MainSection from './components/MainSection';

export default function Home() {
  return (
    <div>
      <Navbar />
      <MainSection />
    </div>
  );
}