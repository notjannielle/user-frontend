import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Checkout = ({ cartItems, closeCheckout, proceedToOrder }) => {
  const [checkoutOption, setCheckoutOption] = useState(null);
  const [guestInfo, setGuestInfo] = useState({ name: '', contact: '' });
  const [errorMessage, setErrorMessage] = useState('');
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
    const orderData = {
      user: guestInfo,
      items: cartItems.map(item => ({
        product: item.product._id,
        variant: item.variant,
        quantity: item.quantity,
        price: item.product.price,
        branch: item.branch,
      })),
      total: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      orderNumber: `ORD-${Date.now()}`,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders`, orderData);
      proceedToOrder(response.data);
      navigate(`/order/${response.data.orderNumber}`);
    } catch (error) {
      console.error("Error creating order:", error);
      setErrorMessage('Error creating order. Please try again.');
    }
  };

  const handleAccountCheckout = async (e) => {
    e.preventDefault();
    const userDataCookie = Cookies.get('userData');
    let userData;

    if (userDataCookie) {
      try {
        userData = JSON.parse(userDataCookie);
      } catch (error) {
        console.error("Error parsing user data from cookie:", error);
        setErrorMessage("Error retrieving user information.");
        return;
      }
    } else {
      console.error("User data cookie not found.");
      setErrorMessage("User not logged in.");
      return;
    }

    const orderData = {
      user: { name: userData.fullName, contact: userData.phoneNumber },
      items: cartItems.map(item => ({
        product: item.product._id,
        variant: item.variant,
        quantity: item.quantity,
        price: item.product.price,
        branch: item.branch,
      })),
      total: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      orderNumber: `ORD-${formatDate(new Date())}`,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders`, orderData);
      proceedToOrder(response.data);
      navigate(`/order/${response.data.orderNumber}`);
    } catch (error) {
      console.error("Error creating order:", error);
      setErrorMessage('Error creating order. Please try again.');
    }
  };

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}`;
  };

  const groupedProducts = cartItems.reduce((acc, item) => {
    const key = `${item.product._id}-${item.variant}`;
    if (!acc[key]) {
      acc[key] = { ...item, totalQuantity: 0 };
    }
    acc[key].totalQuantity += item.quantity;
    return acc;
  }, {});

  const totalProducts = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div ref={checkoutRef} className="bg-white p-6 rounded max-w-md w-full">
        <button onClick={closeCheckout} className="bg-red-500 text-white p-2 rounded mb-4">
          Close
        </button>
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        {errorMessage && <div className="text-red-600">{errorMessage}</div>}

        <div className="overflow-y-auto max-h-60 mb-4">
          {Object.values(groupedProducts).map((item, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-bold">{item.product.name} (Valid QR)</h3>
              <div className="flex justify-between items-center border-b py-2">
                <span className="block">
                  {item.variant} x {item.totalQuantity}
                </span>
                <span className="font-semibold">₱{(item.product.price * item.totalQuantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-2">
          <h3 className="text-xl font-bold">Total Products: {totalProducts}</h3>
          <h3 className="text-xl font-bold">Total Price: ₱{totalPrice}</h3>
        </div>
        <h3 className="text-xl font-bold mt-4">Checkout Options</h3>

        {!isLoggedIn && (
          <div className="mb-4">
            <button
              onClick={() => setCheckoutOption('guest')}
              className="bg-blue-500 text-white p-2 rounded mr-2"
            >
              Guest Checkout
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Create/Login Account
            </button>
          </div>
        )}

        {checkoutOption === 'guest' && (
          <form onSubmit={handleGuestCheckout} className="mt-4">
            <h4 className="font-bold">Guest Checkout</h4>
            <input
              type="text"
              placeholder="Name"
              value={guestInfo.name}
              onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
              required
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Contact (Email/Phone)"
              value={guestInfo.contact}
              onChange={(e) => setGuestInfo({ ...guestInfo, contact: e.target.value })}
              required
              className="border p-2 rounded w-full mb-4"
            />
           {/*
           
     <button type="submit" className="bg-green-500 text-white p-2 rounded">
              Proceed to Order
            </button> 
            
            
            
            */}

<span style={{ color: 'gray', fontSize: '1rem' }}>Coming Soon... You need to login first to order.</span>

         </form>
       )}

        {isLoggedIn && (
          <button onClick={handleAccountCheckout} className="bg-green-500 text-white p-2 rounded mt-4">
            Proceed to Order
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;
