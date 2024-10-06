// src/components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const LoginPage = ({ setIsLoggedIn }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formattedPhoneNumber = phoneNumber.startsWith('09')
      ? `+63${phoneNumber.slice(1)}`
      : phoneNumber;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, {
        phoneNumber: formattedPhoneNumber,
        password,
      });

      console.log("Login Response: ", response.data); // Log response

      const { isVerified, message, token, user } = response.data; // Ensure you destructure the user object here

      if (isVerified) {
        Cookies.set('isLoggedIn', 'true');
        Cookies.set('token', token);

        // Ensure user data is present
        if (user) {
          Cookies.set('userData', JSON.stringify({
            fullName: user.fullName,
            phoneNumber: user.phoneNumber
          }));
        } else {
          console.error("User data is not available:", user);
          setErrorMessage("User information is incomplete.");
          return;
        }

        setIsLoggedIn(true);
        navigate('/');
      } else {
        setErrorMessage(message);
        await axios.post(`${process.env.REACT_APP_API_URL}/users/resend-otp`, {
          phoneNumber: formattedPhoneNumber,
        });
        navigate('/verify-otp', { state: { phoneNumber: formattedPhoneNumber } });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage(error.response?.data?.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-10 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600">Login</h2>
        {errorMessage && <div className="text-red-600 text-center">{errorMessage}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-lg font-medium">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="09123456789"
              pattern="^09\d{9}$"
              title="Enter a valid phone number (e.g., 09123456789)"
            />
          </div>
          <div>
            <label className="block text-lg font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full p-3 mt-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>

     {/*    <div
  id="alert-additional-content-1"
  className="p-4 mb-4 mt-10 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
  role="alert"
>
<div className="flex items-center">
    <svg
      className="flex-shrink-0 w-4 h-4 me-2"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
    </svg>
    <span className="sr-only">Info</span>
    <h3 className="text-lg font-medium">Login Currently Disabled</h3>
  </div>
  <div className="mt-2 mb-4 text-sm">
   Use guest checkout directly from the cart for a quicker option!
  </div>
</div>*/}

        </form>
        <div className="text-center">
          <a href="/register" className="text-blue-500 hover:underline">Don't have an account yet?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
