import React, { useState } from 'react';
import Checkout from './Checkout';

const ParentComponent = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]); // Ensure cartItems is defined

  const proceedToOrder = (orderData) => {
    console.log("Order placed:", orderData);
    alert("Order placed successfully!x");
    closeCheckout(); // Close checkout modal
  };

  const openCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="border p-2 mb-2">
            <h3>{item.product.name}</h3>
            <p>Variant: {item.variant}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <button onClick={openCheckout} className="bg-blue-500 text-white p-2 rounded">
        Proceed to Checkout
      </button>
      {isCheckoutOpen && (
        <Checkout 
        cartItems={cartItems}
        closeCheckout={() => setIsCheckoutOpen(false)}
        proceedToOrder={proceedToOrder}
      />
      )}
    </div>
  );
};

export default ParentComponent;
