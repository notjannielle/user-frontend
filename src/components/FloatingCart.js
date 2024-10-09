import React, { useEffect, useRef, useState } from 'react';
import { TfiClose } from "react-icons/tfi";

const FloatingCart = ({ cartItems, removeFromCart, addToCart, openCheckout, isOpen, onToggle }) => {
  const cartRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      checkVariantsAvailability();
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const checkVariantsAvailability = async () => {
    setLoading(true);
    for (const item of cartItems) {
      const { productId, variant, branch } = item;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/check-variant-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, branch, variant }),
      });

      const data = await response.json();
      if (!data.available) {
        alert(`The variant "${variant}" from "${item.product.name}" is no longer available at "${branch}".`);
        removeFromCart(productId, variant);
      }
    }
    setLoading(false);
  };

  const groupedByBranch = cartItems.reduce((acc, item) => {
    if (!acc[item.branch]) acc[item.branch] = {};
    
    const productName = item.product.name || 'Unknown Product';
    const variantName = item.variant || 'Unknown Variant';
    
    if (!acc[item.branch][productName]) {
      acc[item.branch][productName] = {};
    }
    
    if (!acc[item.branch][productName][variantName]) {
      acc[item.branch][productName][variantName] = {
        quantity: item.quantity,
        price: item.price,
        productId: item.productId,
      };
    } else {
      acc[item.branch][productName][variantName].quantity += item.quantity;
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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleAddToCart = (productId, branch, variantIndex) => {
    if (productId && variantIndex >= 0) {
      const productItem = cartItems.find(item => item.productId === productId);
      if (productItem) {
        addToCart(productItem.product, branch, variantIndex);
      }
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
          <p className="text-sm text-gray-600 px-2 mb-2">
            Note: Your cart will reset if you refresh the page!
          </p>
          {loading ? (
            <p className="p-2">Checking availability...</p>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {totalProducts > 0 ? (
                <>
                  {Object.keys(groupedByBranch).map(branch => (
                    <div key={branch} className="mb-4">
                      <h3 className="font-bold p-2">{capitalizeFirstLetter(branch)} Branch</h3>
                      {Object.keys(groupedByBranch[branch]).map(productName => (
                        <div key={productName} className="border p-2 mb-2">
                          <p className="font-bold">{productName}</p>
                          {Object.keys(groupedByBranch[branch][productName]).map(variantName => {
                            const { quantity, price, productId } = groupedByBranch[branch][productName][variantName];

                            const productItem = cartItems.find(item => item.productId === productId);
                            if (!productItem || !productItem.product) return null; // Ensure product exists

                            const branchVariants = productItem.product.branches[branch];
                            const variantIndex = branchVariants.findIndex(v => v.name.trim().toLowerCase() === variantName.trim().toLowerCase());

                            return (
                              <div key={variantName} className="ml-4">
                                <p>{variantName} x {quantity} - ₱{(price * quantity).toFixed(2)}</p>
                                <div className="flex items-center mt-2">
                                  <button 
                                    onClick={() => removeFromCart(productId, variantName)} 
                                    className="bg-red-500 text-white p-1 rounded"
                                  >
                                    Remove
                                  </button>
                                  <button 
                                    onClick={() => handleAddToCart(productId, branch, variantIndex)} 
                                    className="bg-blue-500 text-white p-1 rounded ml-2"
                                  >
                                    Add More
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              ) : (
                <p className="p-2">Oops! Your cart is empty. 🛒</p>
              )}
            </div>
          )}
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
