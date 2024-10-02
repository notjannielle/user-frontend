import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [actualOtp, setActualOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { phoneNumber } = location.state || {};

  useEffect(() => {
    const fetchUserOtp = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/otp/${phoneNumber}`);
        setActualOtp(response.data.otp); // Assuming the response has the OTP
      } catch (error) {
        console.error('Error fetching OTP:', error);
        setErrorMessage('Could not fetch OTP. Please try again.');
      }
    };

    fetchUserOtp();
  }, [phoneNumber]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/verify-otp`, {
        phoneNumber,
        otp: actualOtp, // Use the actual OTP here
      });
      console.log('OTP verification successful:', response.data);
      setSuccessMessage('OTP verified successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage(error.response?.data?.message || 'Invalid OTP.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-sm" onSubmit={handleVerifyOtp}>
        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
        {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}
        {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
        <div className="mb-4">
          <p className="text-blue-600">Type <strong>{actualOtp || 'loading...'}</strong> as your code temporarily as we are working on the SMS feature.</p>
        </div>
        <div className="mb-4">
          <label className="block mb-1">OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
            placeholder="Enter OTP"
            pattern="^\d{6}$"
            title="Enter a valid 6-digit OTP"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OTPVerificationPage;
