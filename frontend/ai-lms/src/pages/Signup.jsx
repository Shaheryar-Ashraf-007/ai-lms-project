import image from "../assets/image.png"
const Signup = () => {
  return (
    <div className='bg-[#F9F9F9]'>
      <div className="flex items-center justify-center">
        {/* Left part */}
        <div className="p-4 w-1/2  bg-gray-200 h-[500px] mt-12 rounded-l-lg">
        <h1 className=" text-center font-bold mt-8 text-2xl">Let's get Started</h1>
        <p className="text-center text-gray-400">Create your account</p>
        <div className="mt-8 font-bold text-xl ml-8">Name</div>
          <input type="text" placeholder="Full Name" className="w-62 p-3 ml-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FBB03B]" />

          <div className="mt-8 font-bold text-xl ml-8 mr-8">Email</div>
          <input type="text" placeholder="Email" className="w-56 p-3 ml-8 mr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FBB03B]" />
          <div className="mt-8 font-bold text-xl ml-2">Password</div>
          <input type="text" placeholder="**********" className="w-full p-3  rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FBB03B]" />
        </div>
        {/* Image */}
        <div className="bg-[#2B3B6D] flex items-center justify-center border rounded-r-lg border-[#2B3B6D] mt-12 w-1/3 h-[500px]">
          <img src={image} alt="logo" className=' w-96 h-96 m-4' />
        </div>
      </div>
    </div>
  );
}

export default Signup;