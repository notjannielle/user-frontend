import React from 'react';

const MinimalProductList = ({ selectProduct, selectedCategories, selectedBranch, products }) => {
  // Filter products based on selected categories and selected branch
  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const branchVariants = product.branches && product.branches[selectedBranch];
    const branchMatch = selectedBranch === 'all' || 
      (Array.isArray(branchVariants) && branchVariants.some(variant => variant.available));
    
    return categoryMatch && branchMatch;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => {
          const branchVariants = product.branches && product.branches[selectedBranch] || [];
          const availableVariants = branchVariants.filter(variant => variant.available);

          return (
            <div
              key={product._id}
              className={`relative p-4 flex justify-between items-center rounded-md shadow-md cursor-pointer transition-transform duration-300 transform hover:scale-105 
                ${availableVariants.length === 0 ? 'line-through text-gray-500' : 'bg-white border border-gray-200'}`}
              onClick={() => availableVariants.length > 0 && selectProduct(product)}
            >
              {/* Product Name */}
              <h2 className={`text-lg font-semibold ${availableVariants.length === 0 ? 'line-through text-gray-500' : ''}`}>
                {product.name}
              </h2>

              {/* Price */}
              <p className="text-xl font-bold text-gray-800">
                ₱{product.price.toFixed(2)} {/* Format price with two decimals */}
              </p>
            </div>
          );
        })
      ) : (
        <p>No products available for the selected filters.</p>
      )}
    </div>
  );
};

export default MinimalProductList;
