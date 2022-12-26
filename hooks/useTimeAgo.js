import { useState, useEffect } from "react";
//segundos que hay en dia, hora, etc...
const DATE_UNITS = [
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

const getDateDiffs = (timestamp) => {
  const now = Date.now();
  //se divide en 1000 para quitar los milisegundos de la cuenta.
  const elapsed = (timestamp - now) / 1000;

  for (const [unit, secondsInUnits] of DATE_UNITS) {
    if (Math.abs(elapsed) > secondsInUnits || unit === "second") {
      const value = Math.round(elapsed / secondsInUnits);
      return { value, unit };
    }
  }
};

export const useTimeAgo = (timestamp) => {
  const [timeAgo, setTimeAgo] = useState(() => getDateDiffs(timestamp));

  useEffect(() => {
    const timeout = setInterval(() => {
      const newTimeAgo = getDateDiffs(timestamp);
      setTimeAgo(newTimeAgo);
    }, 5000);
    return () => clearInterval(timeout);
  }, [timestamp]);
  const rtf = new Intl.RelativeTimeFormat("es", { style: "short" });
  const { value, unit } = timeAgo;
  return rtf.format(value, unit);
};
