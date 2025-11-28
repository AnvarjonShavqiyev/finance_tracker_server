import { FIFTY_NINE, THREE_NINES, TWINTY_THREE, ZERO } from "src/constants";

export const getTodayStartEnd = () => {
    const start = new Date();
    const end = new Date();

    start.setHours(ZERO, ZERO, ZERO, ZERO);
    end.setHours(TWINTY_THREE, FIFTY_NINE, FIFTY_NINE, THREE_NINES);

    return {start, end};
}