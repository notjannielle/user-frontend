import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import Filter from './Filter';
import ProductSidebar from './ProductSidebar';
import FloatingCart from './FloatingCart';
import Checkout from './Checkout';
import Cookies from 'js-cookie';
import Navbar from './Navbar';
import { GrBasket } from "react-icons/gr";

import PulseDot from 'react-pulse-dot'
import 'react-pulse-dot/dist/index.css'

const HomePage = ({ selectedCategories, selectedBranch, onCategoryChange, onBranchChange }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [glowingVariantIndex, setGlowingVariantIndex] = useState(-1);
  const [successMessage, setSuccessMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    const savedItems = Cookies.get('cartItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBeforeUnload = (event) => {
    if (cartItems.length > 0) {
      event.preventDefault();
      setShowModal(true); // Show modal instead of default prompt
      return true; // Required for Chrome to show the prompt
    }
  };

  const clearCart = () => {
    setCartItems([]); // Clear the cart state
    Cookies.remove('cartItems'); // Clear cookies
  };

  useEffect(() => {
    // Attach beforeunload event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [cartItems]);

  const confirmLeave = () => {
    clearCart(); // Clear cart when confirming leave
    setShowModal(false);
    window.location.reload(); // Reload the page
  };

  const cancelLeave = () => {
    setShowModal(false);
  };

  const selectProduct = (product) => {
    if (product) {
      console.log('Product selected:', product);
      setSelectedProduct(product);
      setIsSidebarOpen(true);
    } else {
      console.error('Product is undefined');
    }
  };
  
  const addToCart = (product, branch, variantIndex) => {
    if (!product) {
      console.error('Product is undefined');
      return;
    }
  
    const productId = product._id;
    if (!productId) {
      console.error('Product ID is undefined');
      return;
    }
  
    const branchVariants = product.branches[branch];
  
    if (!branchVariants || branchVariants.length === 0) {
      console.error('No variants available for this branch:', branch);
      return;
    }
  
    if (variantIndex < 0 || variantIndex >= branchVariants.length) {
      console.warn('Invalid variant index:', variantIndex, 'for product:', product.name, 'and branch:', branch);
      return;
    }
  
    const variant = branchVariants[variantIndex];
    const existingItemIndex = cartItems.findIndex(item =>
      item.productId === productId &&
      item.branch === branch &&
      item.variant === variant.name
    );
  
    let newCartItems;
  
    if (existingItemIndex !== -1) {
      newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += 1;
    } else {
      newCartItems = [...cartItems];
      const newItem = {
        productId: productId,
        branch,
        variant: variant.name,
        quantity: 1,
        price: product.price,
        product,
      };
      newCartItems.push(newItem);
    }
  
    setCartItems(newCartItems);
    Cookies.set('cartItems', JSON.stringify(newCartItems), { expires: 7 });
  
    // Set success message
    setSuccessMessage(
      <div>
        <strong>{product.name}</strong><br />
        <i>{variant.name}</i> added to cart!
      </div>
    );
  
    // Clear success message after 2 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };
  
  



  const removeFromCart = (productId, variantName) => {
    const existingItemIndex = cartItems.findIndex(item =>
      item.productId === productId && item.variant === variantName
    );
  
    if (existingItemIndex !== -1) {
      const newCartItems = [...cartItems];
      const currentQuantity = newCartItems[existingItemIndex].quantity;
  
      if (currentQuantity === 1) {
        newCartItems.splice(existingItemIndex, 1); // Remove item if quantity is 1
      } else {
        newCartItems[existingItemIndex].quantity -= 1; // Decrease quantity
      }
  
      setCartItems(newCartItems);
      Cookies.set('cartItems', JSON.stringify(newCartItems), { expires: 7 }); // Update cookies
    }
  };






  const openCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const proceedToOrder = (orderData) => {
    console.log("Order placed:", orderData);
    alert("Order placed successfully!");
    closeCheckout();
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedProduct(null);
  };

  const handleBranchSelect = (branch) => {
    onBranchChange(branch);
    clearCart(); // Clear the cart when changing branches
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="relative pb-16">
      <Filter 
        categories={["Disposables", "Pods", "Juices", "Devices", "Misc"]}
        branches={["main", "second", "third"]}
        selectedCategories={selectedCategories}
        selectedBranch={selectedBranch}
        onCategoryChange={onCategoryChange}
        onBranchChange={handleBranchSelect}
        onClearCart={clearCart} 
      />
      
      <ProductList 
        selectProduct={selectProduct} 
        selectedCategories={selectedCategories} 
        selectedBranch={selectedBranch} 
        products={products} 
      />
<div className="fixed bottom-20 right-4">
  <div className="relative">
    <PulseDot color='#3f83f8' style={{ fontSize: '3em', position: 'absolute', top: '-20%', right: '-24%', zIndex: 0 }} />
    <button onClick={toggleCart} className="bg-blue-500 p-3 rounded-full flex items-center relative z-10">
      <GrBasket className="text-white w-10 h-10" />
      <span className="absolute -top-0 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-10">
        {totalCartItems}
      </span>
    </button>
  </div>
</div>


      {isSidebarOpen && selectedProduct && (
        <ProductSidebar 
          product={selectedProduct} 
          addToCart={addToCart} 
          closeSidebar={closeSidebar} 
        />
      )}

      <FloatingCart 
        cartItems={cartItems}
        removeFromCart={removeFromCart} 
        addToCart={addToCart} // Pass addToCart to FloatingCart
        openCheckout={openCheckout}
        isOpen={isCartOpen}
        onToggle={toggleCart}
      />

      {isCheckoutOpen && (
        <Checkout
          cartItems={cartItems}
          closeCheckout={closeCheckout}
          proceedToOrder={proceedToOrder}
        />
      )}
      {successMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded-md">
          {successMessage}
        </div>
      )}
      <Navbar 
        toggleCart={toggleCart} 
      />
      
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded shadow">
            <h2 className="text-lg font-bold">Warning</h2>
            <p>Your cart will not be saved. Do you really want to leave?</p>
            <button onClick={confirmLeave} className="bg-red-500 text-white p-2 rounded">Yes, leave</button>
            <button onClick={cancelLeave} className="bg-gray-300 p-2 rounded ml-2">No, stay</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
