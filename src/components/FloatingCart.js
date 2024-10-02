import React, { useEffect, useRef } from 'react';
import { TfiClose } from "react-icons/tfi";

const FloatingCart = ({ cartItems, removeFromCart, openCheckout, isOpen, onToggle }) => {
  const cartRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const groupedByBranch = cartItems.reduce((acc, item) => {
    if (!acc[item.branch]) acc[item.branch] = {};
    
    const variantName = item.variant || 'Unknown Variant';
    
    if (!acc[item.branch][variantName]) {
      acc[item.branch][variantName] = {
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      };
    } else {
      acc[item.branch][variantName].quantity += item.quantity;
    }
    return acc;
  }, {});

  const totalProducts = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      openCheckout();
      onToggle();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div 
        ref={cartRef} 
        className={`fixed bottom-0 right-0 w-64 bg-white shadow-lg transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} 
        style={{ height: '100vh' }}
      >
        <button onClick={onToggle} className="absolute top-2 right-2">
          <TfiClose />
        </button>
        <div className="flex flex-col h-full">
          <h2 className="text-xl font-bold mb-4 p-2">Cart</h2>
          <div className="flex-1 overflow-y-auto">
            {totalProducts > 0 ? (
              <>
                {Object.keys(groupedByBranch).map((branch) => (
                  <div key={branch} className="mb-4">
                    <h3 className="font-bold p-2">{branch}</h3>
                    {Object.keys(groupedByBranch[branch]).map((variantName) => {
                      const { product, quantity, price } = groupedByBranch[branch][variantName];

                      return (
                        <div key={variantName} className="border p-2 mb-2">
                          <p className="font-bold">{product ? product.name : 'Unknown Product'}</p>
                          <p>{variantName} x {quantity}</p>
                          <p>Price: ₱{(price * quantity).toFixed(2)}</p>
                          <button onClick={() => removeFromCart(product ? product._id : null)} className="bg-red-500 text-white p-1 rounded mt-2">
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
          <div className="p-4">
            <div className="mb-2">
              <strong>Total Products: {totalProducts}</strong>
            </div>
            <div className="mb-2">
              <strong>Total Price: ₱{totalPrice}</strong>
            </div>
            <button onClick={handleCheckout} className="bg-blue-500 text-white mt-2 p-2 rounded w-full">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCart;
