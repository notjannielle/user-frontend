// src/components/HomePage.js
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

const HomePage = ({ selectedCategories, selectedBranch, onCategoryChange, onBranchChange, cartItems, setCartItems }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [glowingVariantIndex, setGlowingVariantIndex] = useState(-1);
  const [successMessage, setSuccessMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setIsSidebarOpen(true);
  };

  const addToCart = (product, branch, variantIndex) => {
    if (!product.branches || !product.branches[branch]) {
      console.error('Invalid branch or product');
      return;
    }
  
    const branchVariants = product.branches[branch];
  
    if (!branchVariants || !branchVariants[variantIndex]) {
      console.error('Invalid variant index');
      return;
    }
  
    const variant = branchVariants[variantIndex];
  
    const existingItemIndex = cartItems.findIndex(item =>
      item.productId === product._id.$oid &&
      item.branch === branch &&
      item.variant === variant.name
    );
  
    if (existingItemIndex !== -1) {
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += 1;
      setCartItems(newCartItems);
    } else {
      setCartItems(prevItems => [
        ...prevItems,
        {
          productId: product._id.$oid,
          branch,
          variant: variant.name,
          quantity: 1,
          price: product.price,
          product, // Store the full product object
        }
      ]);
    }
  
    setSuccessMessage(
      <div>
        <strong>{product.name}</strong><br />
        <i>{variant.name}</i> added to cart!
      </div>
    );    setGlowingVariantIndex(variantIndex);
  
    setTimeout(() => {
      setSuccessMessage('');
      setGlowingVariantIndex(-1);
    }, 2000);
  };
  
  

  const removeFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
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

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="relative pb-16">
      <Filter 
        categories={["Disposables", "Pods", "Juices", "Devices","Misc"]}
        branches={["main", "second", "third"]}
        selectedCategories={selectedCategories}
        selectedBranch={selectedBranch}
        onCategoryChange={onCategoryChange}
        onBranchChange={onBranchChange}
      /> 
      <ProductList 
        selectProduct={selectProduct} 
        selectedCategories={selectedCategories} 
        selectedBranch={selectedBranch} 
        products={products} 
      />
      <button onClick={toggleCart} className="fixed bottom-20 right-4 bg-blue-500 p-3 rounded-full flex items-center">
        <GrBasket className="text-white w-10 h-10" />
        <span className="relative">
          <span className="absolute -top-8 -right-4 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalCartItems}
          </span>
        </span>
      </button>

      {isSidebarOpen && (
        <ProductSidebar 
          product={selectedProduct} 
          addToCart={addToCart} 
          closeSidebar={closeSidebar} 
        />
      )}
<FloatingCart 
  cartItems={cartItems}
  removeFromCart={removeFromCart}
  openCheckout={openCheckout}
  isOpen={isCartOpen}
  onToggle={toggleCart}
  products={products} // Make sure this line exists
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
    </div>
  );
};

export default HomePage;
