import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AverageCalculator() {
  const [numberType, setNumberType] = useState('p');
  const [inputCount, setInputCount] = useState(10);
  const [fetchedNumbers, setFetchedNumbers] = useState([]);
  const [average, setAverage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNumberTypeChange = (event) => {
    setNumberType(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputCount(event.target.value);
  };

  const fetchNumbers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response;
      let numbers;

      switch (numberType) {
        case 'p':
          //prime numbers 
          numbers = generatePrimeNumbers(inputCount);
          break;
        case 'f':
          //Fibonacci numbers
          response = await axios.get(`https://fibonacci-numbers-api.herokuapp.com/fibonacci/${inputCount}`);
          numbers = response.data;
          break;
        case 'e':
          //even numbers 
          numbers = generateEvenNumbers(inputCount);
          break;
        case 'r':
          //random numbers
          response = await axios.get(`https://www.random.org/integers/?num=${inputCount}&min=1&max=10000&col=1&base=10&format=plain&rnd=new`);
          numbers = response.data.split('\n').filter(num => num !== '').map(num => parseInt(num));
          break;
        default:
          throw new Error('Invalid number type');
      }

      setFetchedNumbers(numbers);
      setAverage(calculateAverage(numbers));
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAverage = (numbers) => {
    const sum = numbers.reduce((total, num) => total + num, 0);
    return numbers.length > 0 ? sum / numbers.length : 0;
  };

  //getting the value of prime nnumber and generating the average value from them
  const generatePrimeNumbers = (count) => {
    const primes = [];
    let num = 2;
    while (primes.length < count) {
      if (isPrime(num)) {
        primes.push(num);
      }
      num++;
    }
    return primes;
  };

  const isPrime = (num) => {
    for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
      if (num % i === 0) return false;
    }
    return num > 1;
  };


  //getting even numbers form the api and add then averaged that value
  const generateEvenNumbers = (count) => {
    const evens = [];
    let num = 2;
    while (evens.length < count) {
      evens.push(num);
      num += 2;
    }
    return evens;
  };

  useEffect(() => {
    fetchNumbers();
  }, [numberType, inputCount]);

  const renderResultsTable = () => {
    if (fetchedNumbers.length === 0) {
      return null; 
    }
    //table for getting the fetched numbers and output average number is shown
    return (
      <table>
        <thead>
          <tr>
            <th>Fetched Numbers</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{fetchedNumbers.join(', ')}</td>
            <td>{average}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="average-calculator" id='new'>
      <h1>Average Calculator</h1>
      <label htmlFor="numberType">Select Number Type:</label>
      <select id="numberType" value={numberType} onChange={handleNumberTypeChange}>
        <option value="p">Prime numbers</option>
        <option value="f">Fibonacci numbers</option>
        <option value="e">Even numbers</option>
        <option value="r">Random numbers</option>
      </select>
      <label htmlFor="inputCount">Number of elements</label>
      <input type="number" id="inputCount" value={inputCount} onChange={handleInputChange} />
      <button onClick={fetchNumbers} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Calculate Average'}
      </button>
      {error && <p className="error">{error}</p>}
      {renderResultsTable()}
    </div>
  );
}

export default AverageCalculator;
