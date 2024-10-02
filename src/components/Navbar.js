// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillHome, AiFillShopping, AiFillFileText, AiFillMessage, AiFillProfile } from 'react-icons/ai';

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
    <div className="fixed bottom-0 left-0 right-0 flex justify-around bg-white border-t border-gray-300">
      <button onClick={() => navigate('/')} className="p-4">
        <AiFillHome size={24} />
      </button>
      <button onClick={() => navigate('/orders')} className="p-4">
        <AiFillFileText size={24} />
      </button>

      <button onClick={() => navigate('/support')} className="p-4">
        <AiFillMessage size={24} />
      </button>
      <button onClick={handleProfileClick} className="p-4">
        <AiFillProfile size={24} />
      </button>
    </div>
  );
};

export default Navbar;
