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
    // Scroll to the top of the page
    window.scrollTo(0, 0);
    
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

  // Utility function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center mb-6">
        <img src="/logo.png" className="w-20 mb-2" alt="Escobar Logo" />
        <div className="text-center text-m font-medium"> Branches
          <p className="text-sm font-medium">📍 Main: 1709 Piy Margal</p>
          <p className="text-sm font-medium">📍 Second: 1767 Honradez</p>
          <p className="text-sm font-medium">📍 Third: 2201 G. Tuazon</p>
          <p className="text-sm font-medium">🕐 1:00pm - 11:00pm daily</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-4">Order Tracking</h2>
      <p className="text-s font-normal text-center mb-4">Present this receipt upon pickup.</p>

      <div className="mb-6">
        <div className="flex justify-between text-gray-700 mb-2">
          <span className="font-semibold">Order #:</span>
          <span className="font-medium">{orderDetails.orderNumber}</span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span className="font-semibold">Customer:</span>
          <span className="font-medium">{orderDetails.user.name}</span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span className="font-semibold">Contact:</span>
          <span className="font-medium">{orderDetails.user.contact}</span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span className="font-semibold">Latest Status:</span>
          <span className="font-medium">{orderDetails.status}</span>
        </div>
        <div className="flex justify-between text-gray-700 mb-6">
          <span className="font-semibold">Pickup Branch:</span>
          <span className="font-medium">{capitalizeFirstLetter(orderDetails.branch)} Branch</span>
        </div>
      </div>

      {Object.keys(groupedByBranch).map(branch => (
        <div key={branch} className="mb-6">
          <h4 className="font-semibold text-lg mb-2">{branch.charAt(0).toUpperCase() + branch.slice(1)} Branch - Pickup</h4>
          
          <ul className="space-y-4">
            {groupedByBranch[branch].reduce((acc, item) => {
              const existingProduct = acc.find(p => p.productId === item.product);
              if (existingProduct) {
                existingProduct.variants.push({
                  variant: item.variant,
                  quantity: item.quantity,
                  price: item.price,
                });
              } else {
                acc.push({
                  productId: item.product,
                  productName: productData[item.product] || "Unknown Product",
                  variants: [{
                    variant: item.variant,
                    quantity: item.quantity,
                    price: item.price,
                  }],
                });
              }
              return acc;
            }, []).map(({ productName, variants }, index) => (
              <li key={index} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                <div className="font-medium">{productName}</div>
                <ul className="pl-4">
                  {variants.map((variant, idx) => (
                    <li key={idx} className="flex justify-between py-1">
                      <span className="text-gray-700"> {capitalizeFirstLetter(variant.variant)}  (x{variant.quantity})</span>
                      <span className="font-bold">₱{(variant.price * variant.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="border-t pb-10 pt-4">
        <div className="flex justify-end flex-col items-end">
          <h4 className="text-lg font-semibold">Total Payment:</h4>
          <p className="text-xl font-bold rounded-md p-2 text-right">
            ₱{totalPrice}
          </p>
        </div>
      </div>

      <div className="text-center bg-blue-100 text-blue-800 p-4 rounded-md">
        🌟 Hi there! Please refresh for the latest order updates. Orders usually take about 5 to 10 minutes to prepare. If you have any questions or need to cancel your order, feel free to contact us.  
      </div>
      <hr className="pb-10" />

      {/* Progress Steps */}
      <ol className="relative border-l border-gray-200">
        {statuses.map((status, index) => (
          <li key={status} className={`mb-10 ml-6 ${index <= currentStatusIndex ? 'text-blue-500' : 'text-gray-500'}`}>
            <span className={`absolute flex items-center justify-center w-6 h-6 ${index <= currentStatusIndex ? 'bg-blue-100' : 'bg-gray-100'} rounded-full -left-3 ring-8 ring-white`}>
              <svg className={`w-2.5 h-2.5 ${index <= currentStatusIndex ? 'text-blue-800' : 'text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </span>
            <h3 className={`flex items-center mb-1 text-lg font-semibold ${index <= currentStatusIndex ? 'text-blue-600' : 'text-gray-600'}`}>
              {status}
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-500">Refresh to see updates.</time>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default OrderTrackingPage;
