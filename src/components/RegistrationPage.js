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
          setErrorMessage(error.response?.data?.message || 'Error during registration.');
      }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <form className="bg-white p-6 rounded shadow-md w-full max-w-sm" onSubmit={handleRegister}>
              <h2 className="text-xl font-bold mb-4">Register</h2>
              {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}
              {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
              {otp && <div className="mb-4 text-blue-600">Debug: Your OTP is {otp}</div>} {/* Display the OTP */}
              <div className="mb-4">
                  <label className="block mb-1">Full Name</label>
                  <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      required
                  />
              </div>
              <div className="mb-4">
                  <label className="block mb-1">Phone Number</label>
                  <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
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
                      className="w-full px-3 py-2 border rounded"
                      required
                  />
              </div>
              <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                  Register
              </button>
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
