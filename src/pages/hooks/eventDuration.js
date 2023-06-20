import React from 'react';

const EventDuration = ({ duration }) => {
    if (!duration) {
        return <p>Loading...</p>;
    }

    const now = BigInt(Math.floor(new Date().getTime() / 1000)); // get current Unix time, converted to BigInt
    let remainingSeconds = BigInt(duration) - now;

    // If event has ended, return 0
    if (remainingSeconds < 0) {
        return <p>0 days</p>;
    }

    // Convert remaining seconds to days
    let remainingDays = Number(remainingSeconds) / (60 * 60 * 24);
    remainingDays = Math.floor(remainingDays); // convert to integer

    return <p>{remainingDays} days</p>;
};

export default EventDuration;
