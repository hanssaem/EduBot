import React from 'react';

const Folder = ({ name, onClick }) => {
  return (
    <div
      className="relative w-52 h-64 rounded-2xl shadow-md transition-transform duration-300 ease-in-out hover:translate-y-[-10px] hover:shadow-xl cursor-pointer"
      onClick={onClick}
    >
      {/* Folder main body */}
      <div className="absolute inset-0 bg-yellow-300 rounded-2xl shadow-md">
        {/* Top center fastener */}
        <div className="absolute -top-0 left-1/2 transform -translate-x-1/2 w-6 h-16 bg-yellow-400 rounded-t-md rounded-b-lg z-20">
          {/* Mint circle button */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-teal-300 shadow-sm"></div>
        </div>

        {/* Document peeking out (mint color trim) */}
        <div className="absolute top-[8%] left-[5%] right-[5%] h-[6%] bg-teal-200 rounded-sm"></div>

        {/* Name container */}
        <div className="absolute inset-x-[12%] top-[45%] w-[76%] h-[20%] flex items-center justify-center">
          <div className="w-full h-full bg-yellow-100 rounded-md flex items-center justify-center shadow-inner">
            <span className="text-md font-bold text-gray-700 text-center px-3 truncate">
              {name}
            </span>
          </div>
        </div>

        {/* Highlight effect for 3D look */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 rounded-md pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Folder;
