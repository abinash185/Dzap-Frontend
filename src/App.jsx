// App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"
import "./background.jpg"


function App() {
  const [currencies, setCurrencies] = useState([]);
  const [formData, setFormData] = useState({
    sourceCurrency: '',
    amount: '',
    targetCurrency: 'usd',
  });
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://dzap-backend-two.vercel.app/api/currencies');
        setCurrencies(response.data);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://dzap-backend-two.vercel.app/api/convert', formData);
      setConvertedAmount(response.data.convertedAmount);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.error('Rate limit exceeded. Please wait before making the next request.');
      } else {
        console.error('Error converting currency:', error);
      }
    }
  };

  return (
    <div  className="App">
    <h1 className='header'>Crypto-Currency Converter</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Source Currency:
          <select name="sourceCurrency" value={formData.sourceCurrency} onChange={handleInputChange}>
             {/* <option >Select Currency</option>  */}
            {currencies.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol})
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Amount:
          <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Target Currency:
          <select name="targetCurrency" value={formData.targetCurrency} onChange={handleInputChange}>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
        </label>
        <br />
        <button type="submit">Convert</button>
      </form>
      {convertedAmount !== null && (
        <div>
          <h2>Converted Amount:</h2>
          <p>{convertedAmount}</p>
        </div>
      )}
    </div>
  );
}

export default App;

