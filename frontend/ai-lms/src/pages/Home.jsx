import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import "../../src/index.css"
import hero from "../assets/hero.png"

const Home = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;

      // Show navbar if scrolling up, otherwise hide it
      if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }

      // Update lastScrollY
      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className="w-full overflow-hidden">
       <div className={`sticky top-0 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <Navbar />
      </div>

  <div className="w-full relative lg:h-[140vh] h-[50vh]">
    
    <img
      className="object-cover w-full lg:h-full h-[50vh]"
      src={hero}
      alt="Hero image"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-black opacity-40"></div>

    <span className="absolute top-[25%] lg:top-[10%] w-full flex items-center justify-center text-white font-bold text-center lg:text-[70px] md:text-[50px] text-[30px] px-4">
      Grow your Skills to Advance
    </span>
    
    <span className="absolute top-[30%] lg:top-[18%] w-full flex items-center justify-center text-[#FBB03B] font-bold text-center lg:text-[70px] md:text-[50px] text-[30px] px-4">
      Your Career Path
    </span>

    <button>View All Courses</button>
    <button>Search with Ai</button>
  </div>
</div>
  )
}

export default Home