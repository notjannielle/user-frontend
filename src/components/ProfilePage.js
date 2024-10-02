// src/components/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if not logged in
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
        const token = Cookies.get('token'); // Ensure you have the correct token
        console.log('Token:', token); // Log the token for debugging
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
          headers: {
                Authorization: `Bearer ${token}`, // Proper format
            },
        });
        setUserProfile(response.data);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to fetch user profile.');
    }
};


  if (!userProfile) {
    return <div>Loading...</div>; // You can also add a loading spinner
  }

  return (
    <div className="flex items-center justify-center max-h-screen pt-20 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800">User Profile</h2>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <div className="mt-4 space-y-2">
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-xl font-medium">Full Name</h3>
            <p className="text-gray-600">{userProfile.fullName}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-xl font-medium">Phone Number</h3>
            <p className="text-gray-600">{userProfile.phoneNumber}</p>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
