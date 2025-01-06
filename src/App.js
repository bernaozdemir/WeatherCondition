import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";

const App = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState(''); // Background state

    const fetchWeatherData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=G36U7NH74XHWZZQVEM7S3Z9SF`
            );
            setWeatherData(response.data);
            setError(null);

            // Set the background image based on the weather condition
            const condition = response.data.currentConditions.conditions.toLowerCase();
            if (condition.includes("cloudy")) {
                setBackgroundImage('cloudy.jpg');
            } else if (condition.includes("rain")) {
                setBackgroundImage('rainy.jpg');
            } else if (condition.includes("overcast")) {
                setBackgroundImage('overcast.jpg');
            } else if (condition.includes("clear")) {
                setBackgroundImage('clear.jpg');
            }
        } catch (err) {
            setError('Hava durumu verileri yüklenemedi. Şehri kontrol edin.');
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (city.trim()) {
            fetchWeatherData();
        }
    };

    return (
        <div className="container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h1>Hava Durumu</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Şehir adı girin"
                    className="search-input"
                />
                <button type="submit" className="search-button">Ara</button>
            </form>

            {loading && <p>Yükleniyor...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {weatherData ? (
                <div className="weather-data">
                    <h2>{weatherData.resolvedAddress}</h2>
                    <p>{weatherData.currentConditions.conditions}</p>
                    <p>{weatherData.currentConditions.temp}°C</p>
                    <p>Nem: {weatherData.currentConditions.humidity}%</p>
                </div>
            ) : (
                !error && !loading && <p>Şehir adı girerek arama yapın.</p>
            )}
        </div>
    );
};

export default App;
