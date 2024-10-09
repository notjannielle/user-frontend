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
    setLoading(true); // Set loading before starting checks
    for (const item of cartItems) {
      const { productId, variant, branch } = item;
  
      const response = await fetch('http://localhost:5001/api/products/check-variant-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, branch, variant }),
      });
  
      const data = await response.json();
      console.log(`Checking item: ${variant} from ${item.product.name} at ${branch}`);
  
      if (data.available) {
        console.log(`Variant "${variant}" is available in branch "${branch}".`);
      } else {
        console.log(`Variant "${variant}" is no longer available. Removing from cart.`);
        
        // Alerting the user about the unavailability
        alert(`The variant "${variant}" from "${item.product.name}" is no longer available at "${branch}" and has been removed from your cart.`);
        
        removeFromCart(productId, variant); // Remove from cart if unavailable
      }
    }
    setLoading(false); // Set loading to false after checks are done
  };
  

  const availableCartItems = cartItems.filter(item => {
    // This can be updated based on your availability logic if needed
    return true; // For now, just return all items
  });

  const groupedByBranch = availableCartItems.reduce((acc, item) => {
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

  const totalProducts = availableCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = availableCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  const handleCheckout = () => {
    if (availableCartItems.length > 0) {
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
                                    onClick={() => handleAddToCart(productId, branch)} 
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
