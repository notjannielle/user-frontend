import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Checkout from './components/Checkout';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import OrderTrackingPage from './components/OrderTrackingPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import ProfilePage from './components/ProfilePage';
import OTPVerificationPage from './components/OTPVerificationPage';
import Navbar from './components/Navbar';
import FloatingCart from './components/FloatingCart';
import Cookies from 'js-cookie';
import OrderPage from './components/OrderPage';
import BranchSelectModal from './components/BranchSelectModal';
import SupportPage from './components/SupportPage';
import PinModal from './components/PinModal'; // Import the PinModal component

const App = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedItems = Cookies.get('cartItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [products, setProducts] = useState([]); // State for products
  const [isPinEntered, setIsPinEntered] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false); // Initially hidden

  useEffect(() => {
    // Check if the PIN was entered within the last 30 minutes
    const pinTimestamp = Cookies.get('pinTimestamp');
    if (pinTimestamp && (Date.now() - Number(pinTimestamp) < 30 * 60 * 1000)) {
      setIsPinEntered(true);
    } else {
      setShowPinModal(true); // Show the PIN modal if not entered recently
    }
  }, []);

  useEffect(() => {
    // Fetch products from your API or source
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data); // Ensure products state is set correctly
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 });
    } else {
      Cookies.remove('cartItems');
    }
  }, [cartItems]);

  useEffect(() => {
    const savedLoginStatus = Cookies.get('isLoggedIn');
    setIsLoggedIn(savedLoginStatus === 'true');
  }, []);

  useEffect(() => {
    const savedBranch = Cookies.get('selectedBranch');
    if (savedBranch) {
      setSelectedBranch(savedBranch);
    } else {
      setShowBranchModal(true);
    }
  }, []);

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const handleBranchSelect = (branchId) => {
    setSelectedBranch(branchId);
    Cookies.set('selectedBranch', branchId, { expires: 10 / 1440 });
    setShowBranchModal(false);
  };

  const handlePinSuccess = () => {
    setIsPinEntered(true);
    setShowPinModal(false); // Hide the PIN modal on success
    Cookies.set('pinTimestamp', Date.now(), { expires: 1 / 48 }); // Store timestamp for 30 minutes
  };

  return (
    <Router>
      <div className="relative pb-16">
        {showPinModal && (
          <PinModal 
            onClose={() => setShowPinModal(false)} 
            onPinSuccess={handlePinSuccess} 
          />
        )}
        
        {isPinEntered && (
          <>
            <Navbar isLoggedIn={isLoggedIn} toggleCart={toggleCart} />
            <FloatingCart 
              cartItems={cartItems}
              isOpen={isCartOpen}
              onToggle={toggleCart}
              products={products} // Pass products to FloatingCart
            />
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage 
                    selectedCategories={selectedCategories}
                    selectedBranch={selectedBranch}
                    onCategoryChange={setSelectedCategories}
                    onBranchChange={handleBranchSelect}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                } 
              />
              <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/order/:orderNumber" element={<OrderTrackingPage />} />
              <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/verify-otp" element={<OTPVerificationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<OrderPage />} />
              <Route path="/support" element={<SupportPage />} />
            </Routes>
            {showBranchModal && (
              <BranchSelectModal 
                onClose={() => setShowBranchModal(false)}
                onSelect={handleBranchSelect}
              />
            )}
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
