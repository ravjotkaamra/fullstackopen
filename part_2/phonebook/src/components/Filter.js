import React from "react";

const Filter = ({ text, filterName, handleFiltering }) => {

  return (
    <div>
      {text}
      <input value={filterName} onChange={handleFiltering} />
    </div>
  );
};

export default Filter;
