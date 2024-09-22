import React, { useState } from 'react';
import useHttp from '../hooks/useHttp';
import { currencyFormatter } from '../util/formatting';

const Payment = ({ totalAmount, onSuccess }) => {
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_ASSETS;

  const { sendRequest, data, isLoading } = useHttp(
    `${backendUrl}/create-payment-intent`, 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }
  );

  const handlePayment = async () => {
    try {
      const response = await sendRequest(JSON.stringify({ amount: totalAmount * 100 })); // Convert to cents
      if (response.clientSecret) {
        // Handle successful payment here (e.g., show confirmation, call onSuccess)
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Processing payment...</p>
      ) : (
        <button onClick={handlePayment}>Pay {currencyFormatter.format(totalAmount)}</button>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Payment;
