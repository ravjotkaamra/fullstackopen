import React from 'react';
import { connect } from 'react-redux';
import { setFilter } from '../reducers/filterReducer';

const Filter = (props) => {
  const handleChange = (event) => {
    // input-field value is in variable event.target.value
    const filter = event.target.value;
    props.setFilter(filter);
  };

  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  );
};
// convert the regular react component to connected component
// so that the dispatch from the react-redux can be called with
// the help of props.actionCreator

const mapDispatchToProps = { setFilter };
const ConnectedFilter = connect(null, mapDispatchToProps)(Filter);

export default ConnectedFilter;
