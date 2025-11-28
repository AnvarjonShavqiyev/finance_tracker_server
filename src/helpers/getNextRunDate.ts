import { ONE, SEVEN } from "src/constants";
import { Nullable } from "src/types";

export const getNextRunDate = (date: Date, interval: Nullable<string>) => {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + ONE);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + SEVEN);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + ONE);
      break;
    default:
      break;
  }
  return next;
}
