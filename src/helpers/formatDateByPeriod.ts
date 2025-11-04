import { format } from "date-fns/format";
import { DAY_FORMAT, MONTH_FORMAT, WEEK_FORMAT, YEAR_FORMAT } from "src/constants";
import { PeriodType } from "src/types";

export const formatDateByPeriod = (date: Date, period: PeriodType) => {
    switch (period) {
        case 'Day': 
            return format(date, DAY_FORMAT);
        case 'Week': 
            return format(date, WEEK_FORMAT);
        case 'Month': 
            return format(date, MONTH_FORMAT);
        case 'Year': 
            return format(date, YEAR_FORMAT);
        default: 
            return date;
    }
}