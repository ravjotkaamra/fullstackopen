import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null);
  const api_key = process.env.REACT_APP_API_KEY;
  const base_url = `http://api.weatherstack.com/current?access_key=${api_key}&query=`;

  useEffect(() => {
    console.log("weather_useeffect");
    axios.get(`${base_url}${capital}`).then((response) => {
    //   console.log(response.data);
      setWeather(response.data.current);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (weather === null) {
    console.log("waiting");
    return <div>waiting...</div>;
  }
  return (
    <div>
      <h2>Weather in {capital}</h2>
      <div>
        <strong>condition: </strong>
        {weather.weather_descriptions[0]}
      </div>
      <div>
        <strong>temperature: </strong>
        {weather.temperature} celsius
      </div>
      <div>
        <img src={weather.weather_icons[0]} alt="weather icons" />
      </div>
      <div>
        <strong>wind: </strong>
        {weather.wind_speed} Kmph direction {weather.wind_dir}
      </div>
    </div>
  );
};

export default Weather;
