// src/components/RegistrationPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otp, setOtp] = useState(''); // State to hold the OTP
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const formattedPhoneNumber = `+63${phoneNumber.slice(1)}`; // Convert to international format

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, {
        fullName,
        phoneNumber: formattedPhoneNumber,
        password,
      });
      console.log('Registration successful:', response.data);
      setSuccessMessage('Registration successful.');
      setOtp(response.data.otp); // Set OTP received from the response
      setTimeout(() => {
        navigate('/verify-otp', { state: { phoneNumber: formattedPhoneNumber, otp: response.data.otp } });
      }, 2000);
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage(error.response?.data?.message || 'Error during registration. Existing mobile number.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleRegister}>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create an account</h2>

        <div
          id="alert-registration-info"
          className="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50"
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
            <h3 className="text-lg font-medium">Registration is free!</h3>
          </div>
          <div className="mt-2 mb-4 text-sm">
            Register now to save your orders and join our exciting future promotions!
          </div>
        </div>

        {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}
        {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
        {otp && <div className="mb-4 text-blue-600">Debug: Your OTP is {otp}</div>} {/* Display the OTP */}
        
        <div className="mb-4">
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="09123456789"
            pattern="^09\d{9}$"
            title="Enter a valid phone number (e.g., 09123456789)"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Register
        </button>

        {/* Retained commented section */}
        {/*
        <div
          id="alert-additional-content-1"
          className="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
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
            <h3 className="text-lg font-medium">Registration Currently Disabled</h3>
          </div>
          <div className="mt-2 mb-4 text-sm">
            Use guest checkout directly from the cart for a quicker option!
          </div>
        </div>
        */}

        <div className="mt-4 text-center">
          <p>
            Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;
