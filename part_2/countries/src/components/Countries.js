import React from "react";
import Country from "./Country";
import CountryDetail from "./CountryDetail";

const Countries = ({ countries, handleClick }) => {
  // if there is only one country then print it in detail
  if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />;
  }

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  // if there are (<=)lte 10 countries then
  // if the country's show property is false
  // then print the country's name and show a button
  // which gives an option to update the show button to true
  // otherwise if show propery is already true then
  // print the country in detail
  return (
    <div>
      {countries.map((country) =>
        country.show ? (
          <CountryDetail key={country.name} country={country} />
        ) : (
          <Country
            key={country.name}
            country={country}
            handleClick={handleClick}
          />
        )
      )}
    </div>
  );
};

export default Countries;
