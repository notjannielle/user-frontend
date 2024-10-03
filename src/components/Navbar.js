import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillHome, AiFillMessage } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { AiFillFileText } from 'react-icons/ai';

const Navbar = ({ isLoggedIn, toggleCart }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around bg-gray-200 border-t border-gray-300">
      {/* Home */}
      <button onClick={() => navigate('/')} className="p-4 text-gray-800 hover:bg-gray-300 rounded">
        <AiFillHome size={24} />
      </button>

      {/* Support Page */}
      <button onClick={() => navigate('/support')} className="p-4 text-gray-800 hover:bg-gray-300 rounded">
        <AiFillMessage size={24} />
      </button>

      {/* Order Page */}
      <div className="relative">
        <button disabled className="p-4 opacity-50 cursor-not-allowed text-gray-400">
          <AiFillFileText size={24} />
        </button>
        <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full px-2 whitespace-nowrap">
          Coming Soon
        </span>
      </div>

      {/* Login */}
      <div className="relative">
        <button disabled className="p-4 opacity-50 cursor-not-allowed text-gray-400">
          <CgProfile size={24} />
        </button>
        <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full px-2 whitespace-nowrap">
          Coming Soon
        </span>
      </div>
    </div>
  );
};

export default Navbar;
