import React from "react";
import laptop from "../assets/images/laptop.png";
import Navbar from "../components/Navbar";
function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div
            className="w-full h-full bg-linear-to-br
                from-blue-200 via-pink-100 to-yellow-100
                blur-3xl scale-110"
          ></div>
        </div>

        <div
          className="relative max-w-6xl w-full
            backdrop-blur-sm
              p-8 md:p-16 flex flex-col md:flex-row "
        >
          <div className="w-full md:w-1/2 h-full overflow-hidden">
            <img src={laptop} alt="Laptop illustration" sizes="" />
          </div>
          <div className="w-full md:w-1/2 h-full  ">
            <h1 className="mt-4 md:mt-12 text-[#9993D5] capitalize text-sm  max-w-xl ">
              {" "}
              Learn Something New
            </h1>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900 ">
              Create ideas from solving.
            </h1>
            <p className="mt-6 text-gray-500 max-w-xl">
              Let's get started creating something great together. Make the world
              perfect with new skills and give all the effort to do something amazing.
            </p>
            <button className="mt-8 px-6 py-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
              Get Creative
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
