import React from "react";

const Country = (props) => {
  const { country, handleClick } = props;
  return (
    <div>
      {country.name}{" "}
      <button onClick={handleClick} id={country.name}>
        show
      </button>
    </div>
  );
};

export default Country;
