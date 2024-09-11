import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";

function formatNumber(number) {
  return number.toString().padStart(2, "0");
}
const CountdownTimer = ({ otpExpiryTime, handleTimeUp, timeUp }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(otpExpiryTime) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    let timer;
    if (!timeUp) {
      timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [otpExpiryTime, timeUp]);
  useEffect(() => {
    const timeUp = Object.values(timeLeft).every((value) => value === 0);
    if (timeUp) {
      handleTimeUp();
    }
  }, [timeLeft]);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.grey[500],
        p: "4px",
        borderRadius: "8px",
      }}
    >
      {timeUp ? (
        <span>00:00</span>
      ) : (
        <span>
          {formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}{" "}
        </span>
      )}
    </Box>
  );
};

export default CountdownTimer;
