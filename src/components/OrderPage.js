import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userData = Cookies.get('userData');
  const token = Cookies.get('token');

  useEffect(() => {
    if (!userData || !token) {
      setError('User is not logged in.');
      setLoading(false);
      return;
    }

    const { phoneNumber } = JSON.parse(userData);

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/user/${phoneNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Sort orders in descending order based on orderNumber
        const sortedOrders = response.data.sort((a, b) => b.orderNumber.localeCompare(a.orderNumber));
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userData, token]);

  // Function to format the order date and time
  const formatOrderDateTime = (orderNumber) => {
    // Remove the prefix "ORD-"
    const numberPart = orderNumber.replace('ORD-', '');

    const year = `20${numberPart.substring(0, 2)}`; // Extract year
    const month = numberPart.substring(2, 4); // Extract month
    const day = numberPart.substring(4, 6); // Extract day
    const hour = numberPart.substring(6, 8); // Extract hour
    const minute = numberPart.substring(8, 10); // Extract minute

    // Create a date object using a valid ISO 8601 format
    const dateString = `${year}-${month}-${day}T${hour}:${minute}:00`;
    const date = new Date(dateString);

    // Check for invalid date
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    // Format the date to a readable string
    return date.toLocaleString();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <Link to={`/order/${order.orderNumber}`} key={order.orderNumber} className="block border p-4 mb-4 relative">
              <h2 className="text-lg font-bold">Order #{order.orderNumber}</h2>
              <p className="absolute top-2 right-2 text-sm text-gray-500">
                {formatOrderDateTime(order.orderNumber)}
              </p>
              <p>Status: {order.status}</p>
              <p>Total Price: ₱{order.total}</p>
              {/* Display more order details as needed */}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
