import React, { useState, useEffect,useMemo } from 'react';
import './App.css';
import myLogo from './assets/HS.svg'
import LineChart from './LineChart';
import LineChartRentals from './LineChartTotalRentals';



const App: React.FC = () => {
  const [zipcode, setZipcode] = useState('');
  const [submittedZipcode, setSubmittedZipcode] = useState('');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!submittedZipcode) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:3030/market-data/${submittedZipcode}`);
        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [submittedZipcode]);

  interface RentalDataObject {
    name: string;
    AverageRent: number;
    TotalRentals: number;
  }

  const renderCharts = (data: any) => {
    if (!data) {
      return null;
    }
  
    const rentalData: Record<string, RentalDataObject[]> = {
      OneBed: [],
      TwoBed: [],
      ThreeBed: [],
    };
    const sortedKeys = Object.keys(data.rentalData.history).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    sortedKeys.forEach((k) => {
      const history = data.rentalData.history[k];
  
      const createRentalData = (bedroomType: number) => {
        const { averageRent, totalRentals } = history.detailed[bedroomType];
        return {
          name: k,
          AverageRent: averageRent,
          TotalRentals: totalRentals,
        };
      };
  
      rentalData.OneBed.push(createRentalData(1));
      rentalData.TwoBed.push(createRentalData(2));
      rentalData.ThreeBed.push(createRentalData(3));
    });
  
    return rentalData;
  };
      
  const chartData = useMemo(() => renderCharts(data), [data]);;

  const handleZipcodeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedZipcode(zipcode);
  };

  return (
    <div className="App">
      <header className="App-header">
        <a href="https://www.linkedin.com/in/samuel-huppert/" target="_blank" rel="noopener noreferrer">
          <img src={myLogo} className="logo" alt="my logo" />
        </a>
        <form onSubmit={handleZipcodeSubmit} className="zipcode-form">
        <input
          type="text"
          placeholder="Enter zipcode"
          value={zipcode} // <-- make sure this is bound to the zipcode state variable
          onChange={(e) => setZipcode(e.target.value)}
          className="zipcode-input"
        />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
        {chartData && (
          <>
            <h3>One Bedroom Average and Total Rentals</h3>
            <LineChart chartId="oneBedAverage" data={chartData.OneBed} />
            <LineChartRentals chartId="oneBedRentals" data={chartData.OneBed} />
            <h3>Two Bedroom Average and Total Rentals</h3>
            <LineChart chartId="twoBedAverage" data={chartData.TwoBed} />
            <LineChartRentals chartId="twoBedRentals" data={chartData.TwoBed} />
            <h3>Three Bedroom Average and Total Rentals</h3>
            <LineChart chartId="threeBedAverage" data={chartData.ThreeBed} />
            <LineChartRentals chartId="threeBedRentals" data={chartData.ThreeBed} />
    
          </>
        )}
      </header>
    </div>
  );
};

export default App;
