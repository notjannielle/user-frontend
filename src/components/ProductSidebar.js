import React, { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const ProductSidebar = ({ product, addToCart, closeSidebar }) => {
  console.log("Product in sidebar:", product); // Check this log

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeSidebar]);

  const selectedBranch = Cookies.get('selectedBranch') || 'all';

  if (!product) return null;

  const branchNames = {
    main: 'Main Branch',
    second: 'Second Branch',
    third: 'Third Branch'
  };

  const branches = Object.keys(branchNames);
  const orderedBranches = selectedBranch === 'all'
    ? branches
    : [selectedBranch, ...branches.filter(branch => branch !== selectedBranch)];

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className={`fixed top-0 right-0 w-full h-full bg-black bg-opacity-50 transition-opacity duration-300 ${product ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 w-2/3 h-full bg-white shadow-lg p-4 overflow-y-auto transition-transform transform duration-300 ${product ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ paddingBottom: '100px' }}
      >
        <button onClick={closeSidebar} className="bg-red-500 text-white p-2 rounded mb-4" aria-label="Close Sidebar">
          Close
        </button>
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

        {orderedBranches.map((branch) => (
          <div key={branch} className="mb-4">
            <h3 className="text-xl font-bold capitalize">{branchNames[branch]}</h3>
            {product.branches[branch] && product.branches[branch].length > 0 ? (
  product.branches[branch].map((variant, index) => (
    <div key={index} className={`flex justify-between items-center border p-2 mt-2 ${variant.available ? '' : 'bg-gray-200'}`}>
      <span className="flex-1">{capitalizeWords(variant.name)}</span>
      {variant.available && selectedBranch === branch ? (
        <button
        onClick={() => {
          if (product) {
            console.log('Adding to cart:', product, branch, index); // Check the product structure
            addToCart(product, branch, index);
          } else {
            console.error('Product is not defined');
          }
        }}
        
          className={`bg-green-500 text-white p-1 rounded ml-2 transition-transform duration-300`}
          aria-label={`Add ${variant.name} to cart`}
        >
          Add to Cart
        </button>
      ) : (
        <span className={variant.available ? "text-green-500 ml-2" : "text-red-500 ml-2"}>
          {variant.available ? 'Available' : 'Out of Stock'}
        </span>
      )}
    </div>
  ))
) : (
  <p className="text-gray-600">No variants available for this branch.</p>
)}


            {branch === selectedBranch && (
              <div className="mt-4 border-t border-gray-300 pt-4">
                <p className="text-blue-800 font-semibold text-center">
                  You can also order from other branches by just changing the filter!
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSidebar;
