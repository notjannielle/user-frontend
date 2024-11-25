import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import MinimalProductList from './MinimalProductList'; // Import the new minimal list component
import Filter from './Filter';
import ProductSidebar from './ProductSidebar';
import FloatingCart from './FloatingCart';
import Checkout from './Checkout';
import Cookies from 'js-cookie';
import Navbar from './Navbar';
import { GrBasket } from "react-icons/gr";
import PulseDot from 'react-pulse-dot';
import 'react-pulse-dot/dist/index.css';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [announcement, setAnnouncement] = useState(null);
  const [isMinimalView, setIsMinimalView] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false); // Track slow connection state

  const [cartItems, setCartItems] = useState(() => {
    const savedItems = Cookies.get('cartItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const toggleView = () => {
    setIsMinimalView(prev => !prev); // Toggle between minimal and full view
  };


    // Detect slow internet connection (if supported by browser)
    useEffect(() => {
      const checkConnection = () => {
        if (navigator.connection && navigator.connection.downlink) {
          // downlink is in Mbps
          if (navigator.connection.downlink < 1.5) { // Assuming below 1.5 Mbps as slow
            setIsSlowConnection(true);
          } else {
            setIsSlowConnection(false);
          }
        } else {
          // If navigator.connection is not available, assume no issues with connection
          setIsSlowConnection(false);
        }
      };
  
      checkConnection(); // Check connection when component mounts
      window.addEventListener('online', checkConnection); // Check again when user goes online
      window.addEventListener('offline', () => setIsSlowConnection(true)); // Handle offline event
  
      return () => {
        window.removeEventListener('online', checkConnection);
        window.removeEventListener('offline', () => setIsSlowConnection(true));
      };
    }, []);



  const selectProduct = (product) => {
    if (product) {
      console.log('Product selected:', product);
      setSelectedProduct(product);
      setIsSidebarOpen(true);
    } else {
      console.error('Product is undefined');
    }
  };

  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/announcement`);
        if (response.data.enabled) {
          setAnnouncement(response.data.message);
        }
      } catch (err) {
        console.error("Error fetching announcement:", err.response ? err.response.data : err.message);
      }
    };

    fetchAnnouncement();
  }, []);

  const handleBeforeUnload = (event) => {
    if (cartItems.length > 0) {
      event.preventDefault();
      setShowModal(true);
      return true;
    }
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term); // Update the search term
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearCart = () => {
    setCartItems([]);
    Cookies.remove('cartItems');
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [cartItems]);

  const confirmLeave = () => {
    clearCart();
    setShowModal(false);
    window.location.reload();
  };

  const cancelLeave = () => {
    setShowModal(false);
  };

  const addToCart = (product, branch, variantIndex) => {
    if (!product || !product._id) return;
    const branchVariants = product.branches[branch];
    if (!branchVariants || branchVariants.length === 0) return;

    const variant = branchVariants[variantIndex];
    const existingItemIndex = cartItems.findIndex(item =>
      item.productId === product._id && item.branch === branch && item.variant === variant.name
    );

    let newCartItems;
    if (existingItemIndex !== -1) {
      newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += 1;
    } else {
      newCartItems = [...cartItems];
      newCartItems.push({
        productId: product._id,
        branch,
        variant: variant.name,
        quantity: 1,
        price: product.price,
        product,
      });
    }

    setCartItems(newCartItems);
    Cookies.set('cartItems', JSON.stringify(newCartItems), { expires: 7 });

    setSuccessMessage(
      <div>
        <strong>{product.name}</strong><br />
        <i>{variant.name}</i> added to cart!
      </div>
    );

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
        newCartItems.splice(existingItemIndex, 1);
      } else {
        newCartItems[existingItemIndex].quantity -= 1;
      }

      setCartItems(newCartItems);
      Cookies.set('cartItems', JSON.stringify(newCartItems), { expires: 7 });
    }
  };

  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  const proceedToOrder = (orderData) => {
    console.log("Order placed:", orderData);
    closeCheckout();
  };

  const toggleCart = () => setIsCartOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleBranchSelect = (branch) => {
    onBranchChange(branch);
    clearCart();
    Cookies.remove('cartItems');
  };

  
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="relative pb-16">
      {announcement && (
        <div className="bg-blue-500 text-white text-center p-4 rounded-md shadow-md">
          <strong>🚨 Attention Customers! 🚨</strong> {announcement}
        </div>
      )}

      <div className="flex items-center justify-center">
        <img src="/logo.png" className="w-20 mt-2 h-20" alt="Logo" />
      </div>

      <Filter
        categories={["Disposables", "Pods", "Juices", "Devices", "Misc"]}
        branches={["main", "second", "third", "fourth"]}
        selectedCategories={selectedCategories}
        selectedBranch={selectedBranch}
        onCategoryChange={onCategoryChange}
        onBranchChange={handleBranchSelect}
        onClearCart={clearCart}
        onSearchChange={handleSearchChange}
      />
   <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Show the slow connection warning if detected */}
      {isSlowConnection && (
        <div className="bg-yellow-500 text-white p-4 rounded-md mb-4">
          <strong>Warning:</strong> Your internet connection seems slow. Please bear with us while we load the content.
        </div>
      )}

      {/* Toggle Button */}
      <div className="mb-4">
        <button
          onClick={toggleView}
          className="bg-blue-500 text-white p-3 rounded shadow hover:bg-blue-700 transition"
        >
          {isMinimalView ? 'Switch to Full View' : 'Switch to Minimal View'}
        </button>
      </div>

      {/* Conditional Rendering of Product Lists */}
      {isMinimalView ? (
        <MinimalProductList
          selectProduct={selectProduct}
          selectedCategories={selectedCategories}
          selectedBranch={selectedBranch}
          products={filteredProducts}
        />
      ) : (
        <ProductList
          selectProduct={selectProduct}
          selectedCategories={selectedCategories}
          selectedBranch={selectedBranch}
          products={filteredProducts}
        />
      )}
    </div>

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
        addToCart={addToCart}
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

      <Navbar toggleCart={toggleCart} />

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
