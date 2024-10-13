import React, { useState, useEffect } from 'react';

const correctPin = process.env.REACT_APP_PIN;

const PinModal = ({ onClose, onPinSuccess }) => {
  const maxAttempts = 5;
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(() => {
    const savedAttempts = localStorage.getItem('pinAttempts');
    return savedAttempts ? parseInt(savedAttempts, 10) : 0;
  });

  useEffect(() => {
    const savedError = localStorage.getItem('pinError');
    if (savedError) {
      setError(savedError);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pinAttempts', attempts);
    if (attempts >= maxAttempts) {
      localStorage.setItem('pinError', 'Maximum attempts reached. Please contact staff for assistance.');
    } else {
      localStorage.removeItem('pinError');
    }
  }, [attempts]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (attempts >= maxAttempts) {
      setError('Maximum attempts reached. Please contact staff for assistance.');
      return; // Prevent further checks if max attempts reached
    }

    if (pin === correctPin) {
      onPinSuccess();
      onClose();
      localStorage.removeItem('pinAttempts'); // Clear attempts on success
      localStorage.removeItem('pinError'); // Clear error on success
    } else {
      const remainingAttempts = maxAttempts - (attempts + 1);
      setAttempts(prev => prev + 1);
      if (remainingAttempts > 0) {
        setError(`Incorrect PIN. You have ${remainingAttempts} attempt(s) left.`);
      } else {
        setError('Maximum attempts reached. Please reach out our staff for assistance.');
      }
      setPin(''); // Clear the input field
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Enter Your PIN</h2>
        <p className="mb-4 text-gray-700">If you need assistance, please ask our staff for the PIN.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="border rounded-lg p-4 mb-2 w-full text-center text-2xl"
            placeholder="Enter your PIN"
            maxLength="3"
            pattern="[0-9]*"
            inputMode="numeric"
            disabled={attempts >= maxAttempts} // Disable input after max attempts
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button 
            type="submit" 
            className={`bg-blue-500 text-white p-4 rounded-lg w-full text-lg ${attempts >= maxAttempts ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={attempts >= maxAttempts} // Disable button after max attempts
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinModal;
