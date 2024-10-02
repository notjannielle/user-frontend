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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {errorMessage && <div className="text-red-600">{errorMessage}</div>}
        <form onSubmit={handleLogin}>
          <div>
            <label className="block text-sm">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="09123456789"
              pattern="^09\d{9}$"
              title="Enter a valid phone number (e.g., 09123456789)"
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button type="submit" className="w-full p-2 mt-5 bg-blue-500 text-white rounded">
            Login
          </button>
        </form>
        <div className="text-center">
          <a href="/register" className="text-blue-500">Register</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
