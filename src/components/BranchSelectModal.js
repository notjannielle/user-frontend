import React from 'react';
import Cookies from 'js-cookie'; // Import js-cookie

const branchesData = [
  {
    id: "main",
    name: "Main Branch",
    address: "Piy Margal",
    imgSrc: "/logo.png"
  },
  {
    id: "second",
    name: "Second Branch",
    address: "Honradez",
    imgSrc: "/logo.png"
  },
  {
    id: "third",
    name: "Third Branch",
    address: "G.Tuazon",
    imgSrc: "/logo.png"
  },
];

const BranchSelectModal = ({ onClose, onSelect }) => {
  const handleBranchSelect = (branchId) => {
    // Set the cookie to expire in 1 day
    Cookies.set('selectedBranch', branchId, { expires: 1 });
    onSelect(branchId); // Call the onSelect function with the branchId
    onClose(); // Close the modal
      window.location.reload(); // This will refresh the page
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-4">👋 Welcome to Escobar Vape Shop!</h2>
        <span className="block text-lg mb-4">
           Please choose a branch for pickup.
        </span>
        
        <div className="lafka-branch-selection grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {branchesData.map((branch) => (
            <div
              key={branch.id}
              className="lafka-branch-select-image flex items-center p-4 border rounded-lg shadow hover:bg-blue-100 transition cursor-pointer"
              onClick={() => handleBranchSelect(branch.id)} // Use the new handler
            >
              <img src={branch.imgSrc} alt={branch.name} className="w-12 h-12 rounded-full mr-4" />
              <div>
                <span className="lafka-branch-select-name font-bold">{branch.name}</span>
                <span className="text-gray-600 block">{branch.address}</span>
              </div>
            </div>
          ))}
         {/*  <div
            className="lafka-branch-select-image flex items-center p-4 border rounded-lg shadow hover:bg-green-100 transition cursor-pointer"
            onClick={() => handleBranchSelect('all')} // Use the new handler
          >
           <span className="lafka-branch-select-name center font-bold">View All Products</span> 
          </div>
          */}
        </div>
        
      </div>
    </div>
  );
};

export default BranchSelectModal;
