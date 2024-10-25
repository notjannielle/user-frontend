import React, { useState } from 'react';
import { BsBasket } from "react-icons/bs";
import ImageSlider from './ImageSlider'; // Import the ImageSlider

const ProductList = ({ selectProduct, selectedCategories, selectedBranch, products }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const branchVariants = product.branches && product.branches[selectedBranch];
    const branchMatch = selectedBranch === 'all' || 
      (Array.isArray(branchVariants) && branchVariants.some(variant => variant.available));
    
    const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && branchMatch && nameMatch;
  });

  const capitalizeFirstLetter = (string) => {
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div>
      <ImageSlider /> {/* Include the slider here */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const branchVariants = product.branches && product.branches[selectedBranch] || [];
            const availableVariants = branchVariants.filter(variant => variant.available);

            return (
              <div 
                key={product._id}
                className={`relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform duration-300 transform hover:scale-105 ${availableVariants.length === 0 ? 'line-through text-gray-500' : 'bg-white border border-gray-300'}`}
                onClick={() => availableVariants.length > 0 && selectProduct(product)}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-48 w-full object-cover transition-transform duration-300 transform hover:scale-110" 
                />
                <div className="p-4">
                  <h2 className={`text-lg font-semibold mb-2 ${availableVariants.length === 0 ? 'line-through' : ''}`}>
                    {product.name}
                  </h2>
                  <div className={`text-sm mb-2 ${availableVariants.length === 0 ? 'line-through' : ''}`}>
                    <strong>Available:</strong> {availableVariants.length > 0 ? availableVariants.map(v => capitalizeFirstLetter(v.name)).join(', ') : 'None available'}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xl font-bold ${availableVariants.length === 0 ? 'line-through text-gray-500' : ''}`}>₱{product.price}</p>
                    <div className="relative">
                      <BsBasket className="text-gray-700 text-2xl opacity-0 transition-opacity duration-300 hover:opacity-100" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 transition-opacity duration-300 hover:opacity-100 flex items-center justify-center">
                  <BsBasket className="text-white text-2xl" />
                </div>
              </div>
            );
          })
        ) : (
          <p>No products available for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
