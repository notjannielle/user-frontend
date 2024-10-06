import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillHome, AiFillMessage } from 'react-icons/ai';
import { FaUser } from "react-icons/fa";
import { AiFillFileText } from 'react-icons/ai';

const Navbar = ({ isLoggedIn, toggleCart }) => {
  const navigate = useNavigate();


  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
<div className="fixed bottom-0 left-0 right-0 flex justify-around bg-white border-t border-gray-300 shadow-lg rounded-t-lg">
{/* Home */}
      <button onClick={() => navigate('/')} className="p-4 text-gray-800 hover:bg-gray-300 rounded">
        <AiFillHome size={24} />
      </button>

      {/* Support Page */}
      <button onClick={() => navigate('/support')} className="p-4 text-gray-800 hover:bg-gray-300 rounded">
        <AiFillMessage size={24} />
      </button>

      {/* Order Page 
      <div className="relative">
        <button disabled className="p-4 opacity-50 cursor-not-allowed text-gray-400">
          <AiFillFileText size={24} />
        </button>
        <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full px-2 whitespace-nowrap">
          Coming Soon
        </span>
      </div> */}

      {/* Orders Page */}
      <button onClick={() => navigate('/orders')} className="p-4 text-gray-800 hover:bg-gray-300 rounded">
        <AiFillFileText size={24} />
      </button>

      {/* Login 
      <div className="relative">
        <button disabled className="p-4 opacity-50 cursor-not-allowed text-gray-400">
          <CgProfile size={24} />
        </button>
        <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full px-2 whitespace-nowrap">
          Coming Soon
        </span>
      </div>
      */}



        <button onClick={handleProfileClick} className="p-4 text-gray-800 hover:bg-gray-300 rounded">
        <FaUser size={24} />
      </button>

    </div>
  );
};

export default Navbar;
