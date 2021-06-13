import React from 'react';

const Notification = ({ notify }) => {
  if (notify === null) {
    return null;
  }

  const { message, type } = notify;
  return <div className={type}>{message}</div>;
};

export default Notification;
