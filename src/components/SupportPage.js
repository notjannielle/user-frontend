import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaFacebookMessenger } from 'react-icons/fa'; // Messenger icon

const SupportPage = () => {
  const branches = [
    {
      name: "Main Branch",
      address: "1709 Piy Margal",
      imageUrl: "/logo.png",
      profileUrl: "https://www.facebook.com/profile.php?id=61563584350581",
      messageUrl: "https://m.me/61563584350581",
    },
    {
      name: "Second Branch",
      address: "1767 Honradez",
      imageUrl: "/logo.png",
      profileUrl: "https://www.facebook.com/profile.php?id=61556134593492",
      messageUrl: "https://m.me/61556134593492",
    },
    {
      name: "Third Branch",
      address: "2201 G. Tuazon",
      imageUrl: "/logo.png",
      profileUrl: "https://www.facebook.com/profile.php?id=61562211176943",
      messageUrl: "https://m.me/61562211176943",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white text-gray-800 rounded-lg w-full sm:max-w-md shadow-lg p-6 font-poppins">
        <header className="font-bold text-2xl md:text-3xl mb-10 text-center">Contact Us</header>
        
        {/* Personal Page Section */}
        <div className="flex items-center mb-4">
          <img
            src="/rodney.jpg" // Path to Rodney's image
            alt="Rodney Escobar"
            className="h-12 w-12 rounded-full mr-2"
          />
          <div className="flex-grow text-center">
            <div className="font-semibold text-lg md:text-xl">
              Rodney Escobar <FaCheckCircle className="inline text-blue-500" />
            </div>
            <a 
              href="https://www.facebook.com/profile.php?id=100082865724018" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-600 hover:underline"
            >
              View Profile
            </a>
          </div>
          <a href="https://m.me/100082865724018" target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-500 text-white font-bold text-sm rounded py-2 px-4 hover:bg-blue-600 flex items-center ml-2">
              <FaFacebookMessenger className="mr-1" />
              Message
            </button>
          </a>
        </div>

        <hr className="my-4 border-t border-gray-300" />

        <div className="flex flex-col space-y-4">
          {branches.map((branch, index) => (
            <div key={index} className="flex items-center w-full">
              <img
                src={branch.imageUrl}
                alt={branch.name}
                className="h-12 w-12 rounded-full"
              />
              <div className="flex flex-col flex-grow px-3 text-center">
                <div className="font-semibold text-lg md:text-xl">{branch.name}</div>
                <div className="text-sm md:text-base">{branch.address}</div>
                <a 
                  href={branch.profileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Profile
                </a>
              </div>
              <div className="flex-shrink-0">
                <a href={branch.messageUrl} target="_blank" rel="noopener noreferrer">
                  <button className="bg-blue-500 text-white font-bold text-sm rounded py-2 px-4 hover:bg-blue-600 flex items-center ml-2">
                    <FaFacebookMessenger className="mr-1" />
                    Message
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600 md:text-base">
          Responses are typically 🕐 1:00pm - 11:00pm.
        </div>
        <div className="mt-2 text-center text-sm text-gray-600 md:text-base">
          If you have any questions or concerns about your order, don't hesitate to message us!
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
