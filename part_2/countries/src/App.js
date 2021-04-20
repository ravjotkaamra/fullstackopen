import React, { useState, useEffect } from "react";
import axios from "axios";
import Countries from "./components/Countries";

const App = () => {
  // for getting new country from the input element
  const [newCountry, setNewCountry] = useState("");

  // for getting the list of all the countries
  const [countries, setCountries] = useState([{}]);

  // for storing the filtered countries
  // and also attach a show property to each country
  const [filteredCountries, setFilteredCountries] = useState([{}]);

  // making a get request to the rest api
  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setCountries(response.data);
    });
    console.log("effect");
  }, []);

  // for handling the input change when finding a country
  const handleFind = (event) => {
    const eventCountry = event.target.value;
    console.log("event :>> ", eventCountry);

    // filtering the countries by the text given in the input
    let newFilteredCountries = countries.filter((country) => {
      return (
        country.name !== undefined &&
        country.name
          .toUpperCase()
          .includes(eventCountry.slice().trim().toUpperCase())
      );
    });

    // adding a new property to each country object
    // show false means don't show the details of that country
    newFilteredCountries = newFilteredCountries.map((country) => {
      return { ...country, show: false };
    });

    setFilteredCountries(newFilteredCountries);
    setNewCountry(eventCountry);
  };

  const handleClick = (event) => {
    // create a copy of old filtered countris
    const newFilteredCountries = [...filteredCountries];

    newFilteredCountries.every((country) => {
      if (country.name === event.target.id) {
        country.show = !country.show;
        return false;
      }
      return true;
    });

    setFilteredCountries(newFilteredCountries);
  };

  return (
    <div>
      <span>find countries </span>
      <input value={newCountry} onChange={handleFind} />
      {newCountry && (
        <Countries countries={filteredCountries} handleClick={handleClick} />
      )}
    </div>
  );
};

export default App;
