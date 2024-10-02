import React from 'react';
import Cookies from 'js-cookie';

const Filter = ({ 
  categories = [], 
  branches = [], 
  selectedCategories = [], 
  selectedBranch, 
  onCategoryChange, 
  onBranchChange 
}) => {
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category)); // Remove category if already selected
    } else {
      onCategoryChange([...selectedCategories, category]); // Add category if not selected
    }
  };

  const handleBranchChange = (branch) => {
    onBranchChange(branch);
    // Store the selected branch in cookies
    Cookies.set('selectedBranch', branch, { expires: 1 });
    window.location.reload(); // This will refresh the page

  };

  return (
    <div className="flex justify-around p-4 bg-gray-100">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Category</label>
        <div className="flex flex-wrap mt-1">
          {categories.map((category) => (
            <button
              key={category}
              className={`border rounded-full px-3 py-1 mr-2 mb-2 ${selectedCategories.includes(category) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Branches</label>
        <select
          value={selectedBranch}
          onChange={(e) => handleBranchChange(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="all">Select All</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch.charAt(0).toUpperCase() + branch.slice(1)}
            </option>
          ))}
        </select>
      </div> 
    </div>
  );
};

export default Filter;
