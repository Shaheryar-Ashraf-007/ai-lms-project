import React from 'react'
import Navbar from '../components/Navbar'
import "../../src/index.css"

const Home = () => {
  return (
    <div className='w-[100%] overflow-hidden'>
      <div className="w-[100%] lg:h-[140vh] h-[70vh]  relative bg-[#F9F9F9]">
        <Navbar/>
      </div>

    </div>
  )
}

export default Home