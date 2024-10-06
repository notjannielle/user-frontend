import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Checkout = ({ cartItems, closeCheckout, proceedToOrder }) => {
  const [checkoutOption, setCheckoutOption] = useState(null);
  const [guestInfo, setGuestInfo] = useState({ name: '', contact: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const navigate = useNavigate();
  const checkoutRef = useRef(null);

  const isLoggedIn = Cookies.get('isLoggedIn');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (checkoutRef.current && !checkoutRef.current.contains(event.target)) {
        closeCheckout();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeCheckout]);

  
  const handleGuestCheckout = async (e) => {
    e.preventDefault();
    const orderData = createOrderData(guestInfo);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders`, orderData);
      
      proceedToOrder(response.data);
      Cookies.remove('cartItems'); // Clear cookies

      navigate(`/order/${response.data.orderNumber}`);
    } catch (error) {
      console.error("Error creating order:", error);
      setErrorMessage('Error creating order. Please try again.');
    }
  };

  const handleAccountCheckout = async (e) => {
    e.preventDefault();
    const userData = getUserDataFromCookies();
    if (!userData) return;

    const orderData = createOrderData({ name: userData.fullName, contact: userData.phoneNumber });

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders`, orderData);
      proceedToOrder(response.data);
      navigate(`/order/${response.data.orderNumber}`);
    } catch (error) {
      console.error("Error creating order:", error);
      setErrorMessage('Error creating order. Please try again.');
    }
  };

  const createOrderData = (userInfo) => ({
    user: userInfo,
    items: cartItems.map(item => ({
      product: item.product._id,
      variant: item.variant,
      quantity: item.quantity,
      price: item.product.price,
      branch: item.branch,
    })),
    total: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    orderNumber: `ORD-${formatDate(new Date())}`,
  });

  const getUserDataFromCookies = () => {
    const userDataCookie = Cookies.get('userData');
    if (userDataCookie) {
      try {
        return JSON.parse(userDataCookie);
      } catch (error) {
        console.error("Error parsing user data from cookie:", error);
        setErrorMessage("Error retrieving user information.");
      }
    } else {
      console.error("User data cookie not found.");
      setErrorMessage("User not logged in.");
    }
    return null;
  };

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Add seconds
  
    return `${year}${month}${day}${hours}${minutes}${seconds}`; // Include seconds in the return
  };
  

  const groupedProducts = cartItems.reduce((acc, item) => {
    const key = item.product._id;
    if (!acc[key]) {
      acc[key] = {
        product: item.product,
        variants: {},
      };
    }
    if (!acc[key].variants[item.variant]) {
      acc[key].variants[item.variant] = { quantity: 0, price: item.product.price };
    }
    acc[key].variants[item.variant].quantity += item.quantity;
    return acc;
  }, {});

  const totalProducts = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2);
  const branch = cartItems.length > 0 ? cartItems[0].branch : "No Branch Selected";

  const capitalizeBranch = (branchName) =>
    `${branchName.charAt(0).toUpperCase() + branchName.slice(1)} Branch (Pickup)`;

  const capitalizeEachWord = (str) => {
    if (!str) return '';
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div ref={checkoutRef} className="bg-white p-6 rounded max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Order Summary</h2>
          <button onClick={closeCheckout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
            Close
          </button>
        </div>
        {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

        <h3 className="text-xl font-bold mb-5 flex justify-between">
          <span>📍 {capitalizeBranch(branch)}</span>
        </h3>

        <div className="overflow-y-auto max-h-60 mb-4">
          {Object.values(groupedProducts).map((item, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-bold">{item.product.name} (Valid QR)</h3>
              {Object.entries(item.variants).map(([variant, { quantity, price }]) => (
  <div key={variant} className="flex justify-between items-center border-b py-2">
    <span className="block">
    - {capitalizeEachWord(variant)} x {quantity}
    </span>
    <span className="font-semibold">₱{(price * quantity).toFixed(2)}</span>
  </div>
))}

            </div>
          ))}
        </div>

        <div className="border-t pt-2">
          <div className="flex justify-between">
            <h3 className="text-lg font-bold">Total Items: {totalProducts}</h3>
            <h3 className="text-lg font-bold">Total: ₱{totalPrice}</h3>
          </div>
        </div>

        <h3 className="text-xl font-bold mt-4">Select Checkout Options</h3>

        {!isLoggedIn && (
          <div className="mb-4">
            <button
              onClick={() => setShowGuestModal(true)}
              className="bg-blue-500 text-white p-2 m-2 rounded mr-2 hover:bg-blue-600 transition"
            >
              Guest Checkout (Faster)
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-500 text-white p-2 m-2 rounded mr-2 hover:bg-blue-600 transition"
            >
              Create/Login Account
            </button>
          </div>
        )}

        {isLoggedIn && (
          <button
            onClick={handleAccountCheckout}
            className="bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600 transition"
          >
            Proceed to Order
          </button>
        )}

        {/* Guest Checkout Modal */}
        {showGuestModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded max-w-md w-full shadow-lg">
            <div className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-t">
  <div>
    <h4 className="font-bold text-xl">Guest Checkout: Quick & Easy!</h4>
    <p className="text-lg font-light">Please fill in your information to proceed with your order.</p>
  </div>
  <button onClick={() => setShowGuestModal(false)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
    Close
  </button>
</div>

              <form onSubmit={handleGuestCheckout}>
                <input
                  type="text"
                  placeholder="Name"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                  required
                  className="border p-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="Contact (Email/Phone)"
                  value={guestInfo.contact}
                  onChange={(e) => setGuestInfo({ ...guestInfo, contact: e.target.value })}
                  required
                  className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button type="submit" className="bg-green-500 text-white p-2 rounded">
                  Proceed to Order
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
