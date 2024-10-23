import React, { useState } from 'react';
import Select from 'react-select';
import Cookies from 'js-cookie';

// Custom components to remove input and clear icon
const DropdownIndicator = () => null; // Hides the dropdown indicator
const ClearIndicator = () => null; // Hides the clear icon

const Filter = ({ 
  categories = [], 
  branches = [], 
  selectedCategories = [], 
  selectedBranch, 
  onCategoryChange, 
  onBranchChange,
  onClearCart,
  onSearchChange // New prop to handle search input
}) => {
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleBranchChange = (selectedOption) => {
    const branch = selectedOption.value;
    onBranchChange(branch);
Cookies.set('selectedBranch', branch, { expires: 10 / 1440 }); // 10 minutes
    onClearCart(); // Clear the cart when changing branches
    window.location.reload(); // Refresh the page
  };

  // Transform branches for React Select
  const branchOptions = branches.map((branch) => {
    const branchName = branch.charAt(0).toUpperCase() + branch.slice(1);
    return {
      value: branch,
      label: `${branchName} Branch - ${getBranchLocation(branch)}`,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row justify-between p-4 bg-white rounded-lg shadow-lg space-y-4 sm:space-y-0">
      {/* Product Category */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
        <div className="flex flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              className={`flex-1 sm:flex-none border rounded-full px-2 py-1 mx-1 mb-1 text-xs transition-all duration-300 
                ${selectedCategories.includes(category) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Branch Selection */}
      <div className="flex-1 sm:max-w-xs"> {/* Set max width for PC */}
        <label className="block text-sm font-medium text-gray-700 mb-2">Branch Selection</label>
        <Select
          options={branchOptions}
          onChange={handleBranchChange}
          className="basic-single"
          classNamePrefix="select"
          placeholder="Select Branch"
          isSearchable={false} // Disable search
          components={{ DropdownIndicator, ClearIndicator }} // Remove dropdown and clear indicators
          value={branchOptions.find(option => option.value === selectedBranch) || null}
        />
      </div>

      {/* Search Input */}
      <div className="flex-1 flex justify-end">
        <div className="w-full sm:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearchChange(e.target.value); // Call the parent handler
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

// Function to map branch to its location/name
const getBranchLocation = (branch) => {
  const branchLocations = {
    main: 'Piy Margal',
    second: 'Honradez',
    third: 'G Tuazon',
  };
  return branchLocations[branch] || '';
};

export default Filter;
