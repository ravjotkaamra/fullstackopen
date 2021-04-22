import React from "react";

const Notification = ({ message, error }) => {
  if (message === null) {
    return null;
  }

  const className = error ? "error" : "success";
  return <div className={className}>{message}</div>;
};

export default Notification;
