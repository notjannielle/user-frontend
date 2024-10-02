import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderTrackingPage = () => {
  const { orderNumber } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({});

  const statuses = ['Order Received', 'Preparing', 'Ready for Pickup', 'Picked Up', 'Canceled'];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/${orderNumber}`);
        setOrderDetails(response.data);
        await fetchProductDetails(response.data.items.map(item => item.product));
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProductDetails = async (productIds) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`, {
          params: { ids: productIds }
        });
        const products = response.data.reduce((acc, product) => {
          acc[product._id] = product.name; 
          return acc;
        }, {});
        setProductData(products);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderNumber]);

  if (loading) return <div className="text-center text-lg">Loading...</div>;

  if (!orderDetails) return <div className="text-center text-lg">Order not found.</div>;

  const totalPrice = orderDetails.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  const groupedByBranch = orderDetails.items.reduce((acc, item) => {
    if (!acc[item.branch]) acc[item.branch] = [];
    acc[item.branch].push(item);
    return acc;
  }, {});

  const currentStatusIndex = statuses.indexOf(orderDetails.status);

  return (
<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
<div className="flex justify-between items-start">
  <img src="/logo.png" className="w-20" alt="Escobar Logo" />
  <div className="ml-10">
    <p className="text-sm font-medium">📍 Main: 1709 Piy Margal</p>
    <p className="text-sm font-medium">📍 2nd: 1767 Honradez</p>
    <p className="text-sm font-medium">📍 3rd: 2201 G. Tuazon</p>
    <p className="text-sm font-medium">🕐 1:00pm - 11:00pm daily</p>
  </div>
</div>

  
  <h2 className="text-2xl font-bold text-center mb-4 mt-10">Order Tracking</h2>
  <p className="text-lg text-center mb-2">Thank you for your order!</p>
  <p className="text-center text-gray-600 mb-6">Your order number is: <span className="font-semibold">{orderDetails.orderNumber}</span></p>
  <p className="text-center text-gray-600 mb-6">Status: <span className="font-semibold">{orderDetails.status}</span></p>

  {/* Display User Info */}
  <div className="text-center mb-4">
    <h3 className="text-lg font-semibold">Customer Information</h3>
    <p>Name: <span className="font-medium">{orderDetails.user.name}</span></p>
    <p>Contact: <span className="font-medium">{orderDetails.user.contact}</span></p>
  </div>

  <h3 className="text-xl font-semibold mb-2">Items in this order:</h3>
  {Object.keys(groupedByBranch).map(branch => (
    <div key={branch} className="mb-6">
      <h4 className="font-semibold text-lg mb-2">{branch}</h4>
      <ul className="space-y-4">
        {groupedByBranch[branch].map(item => (
          <li key={item._id} className="border rounded-lg p-4 shadow">
            <div className="flex justify-between">
              <span className="font-medium">{productData[item.product] || "Unknown Product"} - {item.variant}</span>
              <span className="font-bold">₱{(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <div className="text-gray-500">Quantity: {item.quantity}</div>
          </li>
        ))}
      </ul>
    </div>
  ))}

  <div className="border-t pb-10 pt-4">
    <h4 className="text-lg font-semibold">Total Price to be Paid:</h4>
    <p className="text-xl font-bold">₱{totalPrice}</p>
  </div>

  <hr className="pb-10" />

  {/* Progress Steps */}
  <ol className="relative border-l border-gray-200 dark:border-gray-700">
    {statuses.map((status, index) => (
      <li key={status} className={`mb-10 ms-6 ${index <= currentStatusIndex ? 'text-blue-500' : 'text-gray-500'}`}>
        <span className={`absolute flex items-center justify-center w-6 h-6 ${index <= currentStatusIndex ? 'bg-blue-100' : 'bg-gray-100'} rounded-full -start-3 ring-8 ring-white dark:ring-gray-900`}>
          <svg className={`w-2.5 h-2.5 ${index <= currentStatusIndex ? 'text-blue-800' : 'text-gray-400'} dark:text-blue-300`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </span>
        <h3 className={`flex items-center mb-1 text-lg font-semibold ${index <= currentStatusIndex ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{status}</h3>
        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{/* Optional time info can go here */}</time>
      </li>
    ))}
  </ol>
</div>

  );
};

export default OrderTrackingPage;
