import React from 'react';
import { BsBasket } from "react-icons/bs";

const ProductList = ({ selectProduct, selectedCategories, selectedBranch, products }) => {
  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const branchVariants = product.branches && product.branches[selectedBranch];
    const branchMatch = selectedBranch === 'all' || 
      (Array.isArray(branchVariants) && branchVariants.some(variant => variant.available));

    return categoryMatch && branchMatch;
  });

  const capitalizeFirstLetter = (string) => {
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => {
          const branchVariants = product.branches && product.branches[selectedBranch] || [];
          const availableVariants = branchVariants.filter(variant => variant.available);

          return (
            <div 
              key={product._id}
              className={`border p-4 rounded relative flex cursor-pointer ${availableVariants.length === 0 ? 'line-through text-gray-500' : ''}`}
              onClick={() => availableVariants.length > 0 && selectProduct(product)}
            >
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover mr-4" />
              <div className="flex-grow">
                <h2 className={`text-xl font-bold ${availableVariants.length === 0 ? 'line-through' : ''}`} 
                    style={{ 
                      WebkitBoxOrient: 'vertical', 
                      WebkitLineClamp: 2 
                    }}>
                  {product.name}
                </h2>
                <div className={`mt-2 text-sm ${availableVariants.length === 0 ? 'line-through' : ''}`}>
                  <strong>Available:</strong> {availableVariants.length > 0 ? availableVariants.map(v => capitalizeFirstLetter(v.name)).join(', ') : 'None available'}
                </div>
              </div>
              <div className="flex-shrink-0 mt-2">
                <p className="text-lg pl-2 font-semibold">₱{product.price}</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-30 rounded">
                <BsBasket className="text-white text-2xl" />
              </div>
            </div>
          );
        })
      ) : (
        <p>No products available for the selected filters.</p>
      )}
    </div>
  );
};

export default ProductList;
