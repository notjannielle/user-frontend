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
      setError('Login to view your orders.');
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
        
        const sortedOrders = response.data.sort((a, b) => b.orderNumber.localeCompare(a.orderNumber));
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('We don\'t see any orders created for this account. 😔');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userData, token]);

  const formatOrderDateTime = (orderNumber) => {
    const numberPart = orderNumber.replace('ORD-', '');
    const year = `20${numberPart.substring(0, 2)}`;
    const month = numberPart.substring(2, 4);
    const day = numberPart.substring(4, 6);
    const hour = numberPart.substring(6, 8);
    const minute = numberPart.substring(8, 10);

    const dateString = `${year}-${month}-${day}T${hour}:${minute}:00`;
    const date = new Date(dateString);

    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-center text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-center">No orders found. <Link to="/login" className="text-blue-500 hover:underline">Login to create orders.</Link></p>
        </div>
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
