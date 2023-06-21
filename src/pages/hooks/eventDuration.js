import React from 'react';

const EventDuration = ({ duration }) => {
  if (!duration) {
    return <span>Loading...</span>;
  }

  const now = BigInt(Math.floor(new Date().getTime() / 1000)); // get current Unix time, converted to BigInt
  let remainingSeconds = BigInt(duration) - now;

  // If event has ended, return 0
  if (remainingSeconds < 0) {
    return <span>0 days</span>;
  }

  // Convert remaining seconds to days
  let remainingDays = Number(remainingSeconds) / (60 * 60 * 24);
  remainingDays = Math.floor(remainingDays); // convert to integer

  return <span>{remainingDays} days</span>;
};

export default EventDuration;
