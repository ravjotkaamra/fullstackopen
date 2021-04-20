import React from "react";
import Weather from './Weather';

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <div>
        <strong>capital</strong> {country.capital}
      </div>
      <div>
        <strong>population</strong> {country.population}
      </div>
      <h2>languages</h2>
      <ul>
        {country.languages.map((language) => {
          return <li key={language.name}>{language.name}</li>;
        })}
      </ul>
      <img src={country.flag} alt="flag" width="100px" />
      <Weather capital={country.capital}/>
    </div>
  );
};

export default CountryDetail;
