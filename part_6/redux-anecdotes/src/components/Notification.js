import React from 'react';
import { connect } from 'react-redux';

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  };
  return (
    <>
      <div style={style}>{props.notification} </div>
      <br />
    </>
  );
};

// convert the regular react component to connected component
// so that the state of the store can be directly accessed from props
const mapStateToProps = (state) => {
  return {
    notification: state.notification,
  };
};
const ConnectedNotification = connect(mapStateToProps)(Notification);

export default ConnectedNotification;
