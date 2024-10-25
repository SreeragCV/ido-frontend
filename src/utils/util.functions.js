import { fromUnixTime, isAfter } from "date-fns";
export const roundFloat = (value, precision) => {
  return Number(value.toFixed(precision));
};

export const getMinifiedAddress = (address) => {
  return [
    address?.slice(0, 4),
    "...",
    address?.slice(address?.length - 5),
  ]?.join("");
};

export const formatFloat = (value, min = 2, max = 10) => {
  return Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  }).format(value);
};

export const adjustSlippage = (amount, slippage) => {
  return (amount * (100 - parseFloat(slippage))) / 100;
};

export const getDeadlineInMillis = (deadline) => {
  return Date.now() + (deadline ? deadline : 20 * 60 * 1000);
};

export const isCurrentDateGreaterThan = (unixTimestamp) => {
  const givenDate = fromUnixTime(unixTimestamp);
  const currentDate = new Date();

  return isAfter(currentDate, givenDate);
};

export const calculatePollPercentages = (totalVotes, vote) => {
  const percentage = totalVotes > 0 ? (vote / totalVotes) * 100 : 0;

  console.log(totalVotes,"vots",vote)

  return {
    vote,
    percentage: Number(percentage.toFixed(2)) // Round to 2 decimal places
  };
};
