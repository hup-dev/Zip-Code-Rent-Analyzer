import React, { useState, useEffect,useMemo } from 'react';
import './App.css';
import myLogo from './assets/HS.svg'
import LineChart from './LineChart';
import LineChartRentals from './LineChartTotalRentals';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BrowserRouter as Router, Route, Routes,NavLink } from 'react-router-dom';


interface OneRentToolProps {
    theme: string;
  }
  
  const OneRentTool: React.FC<OneRentToolProps> = ({ theme }) => {
  const [zipcode, setZipcode] = useState('');
  const [submittedZipcode, setSubmittedZipcode] = useState('');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchData();
    fetchCoordinates();
  }, [submittedZipcode]);
  interface RentalDataObject {
    name: string;
    AverageRent: number;
    TotalRentals: number;
  }
  const fetchCoordinates = async () => {
    if (!submittedZipcode) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3030/coordinates/${submittedZipcode}`);
      const result = await response.json();
  
      setCoordinates(result);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const fetchData = async () => {
    if (!submittedZipcode) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3030/market-data/${submittedZipcode}`);
      const result = await response.json();

      setData(result);
      setError(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true);
      setErrorMessage('Error fetching data. Please try again.');
    }
  };

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
      
  const chartData = useMemo(() => renderCharts(data), [data]);

  const handleZipcodeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!zipcode) {
      setError(true);
      setErrorMessage('Please enter a zipcode');
      return;
    }
    if (!/^\d{5}$/.test(zipcode)) {
      setError(true);
      setErrorMessage('Please enter a valid 5-digit zipcode');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3030/market-data/${zipcode}`);
      const result = await response.json();
      setZipcode(''); // clear the text box
      setData(result);
      setSubmittedZipcode(zipcode);
      setError(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true);
      setErrorMessage('Error fetching data. Please try again with a valid zip code.');
    }
  };



  return (
    <div className="App">
      <header className="App-header">
      <NavLink to="/">
        <img src={myLogo} className="logo" alt="my logo" />
        </NavLink>
        <form onSubmit={handleZipcodeSubmit} className="zipcode-form">
          <input
            type="text"
            placeholder="Enter zipcode"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            className="zipcode-input"
          />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
        {error && <p className="error">{errorMessage}</p>}
        {coordinates && (
            <MapContainer
            key={`${coordinates.lat},${coordinates.lng}`}
            center={[coordinates.lat, coordinates.lng]}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
          >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coordinates.lat, coordinates.lng]}>
                <Popup>{submittedZipcode}</Popup>
              </Marker>
            </MapContainer>
          )}
        {chartData && (
          <>
            <h3>One Bedroom Average and Total Rentals in {submittedZipcode}</h3>
            <LineChart chartId="oneBedAverage" data={chartData.OneBed} theme={theme} />
            <LineChartRentals chartId="oneBedRentals" data={chartData.OneBed} theme={theme} />
            <h3>Two Bedroom Average and Total Rentals in {submittedZipcode}</h3>
            <LineChart chartId="twoBedAverage" data={chartData.TwoBed} theme={theme} />
            <LineChartRentals chartId="twoBedRentals" data={chartData.TwoBed} theme={theme} />
            <h3>Three Bedroom Average and Total Rentals in {submittedZipcode}</h3>
            <LineChart chartId="threeBedAverage" data={chartData.ThreeBed} theme={theme}/>
            <LineChartRentals chartId="threeBedRentals" data={chartData.ThreeBed} theme={theme} />
          </>
        )}
      </header>
    </div>
  );
};
export default OneRentTool
