import { timezone } from "@/lib/constants";
import { type ClassValue, clsx } from "clsx";
import { isSameDay } from "date-fns";
import { format } from "date-fns-tz";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/* return time in format HH:MM */
export const getTimeFromDate = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

/* combines date and time in format HH:MM */
export const getCombinedDateTime = (date: Date, time?: string | null) => {
  const dateString = format(date, "yyyy-MM-dd", { timeZone: timezone });
  return new Date(`${dateString}T${time}`);
};

/* return date time of event in format (input) : */
/* Fri, 22 Dec - 23 Dec (dateFrom and dateTo)*/
/* Thu, 7 Dec at 12:00  (only dateFrom)*/
/* Thu, 6 Jan at 12:00, 2024 (dateFrom is next year)*/
export const getFormattedDateTime = (dateFrom: Date, dateTo?: Date) => {
  const dateFromOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  const dateToOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  const currentYear = new Date().getFullYear();
  const fromYear = dateFrom.getFullYear();
  const toYear = dateTo?.getFullYear();

  let formattedDateFrom = dateFrom.toLocaleString("en-GB", dateFromOptions);
  if (!dateTo) {
    formattedDateFrom += ` at ${dateFrom.toLocaleString("en-GB", timeOptions)}`;
  }
  if (fromYear !== currentYear) {
    formattedDateFrom += `, ${fromYear}`;
  }

  if (dateTo) {
    let formattedDateTo = dateTo.toLocaleString("en-GB", dateToOptions);
    if (toYear !== currentYear) {
      formattedDateTo += `, ${toYear}`;
    }
    if (isSameDay(dateFrom, dateTo)) {
      return formattedDateFrom;
    }
    return `${formattedDateFrom} - ${formattedDateTo}`;
  }

  return formattedDateFrom;
};

/* returns detailed date and time of event in format: */
/* 12:00 Friday, 22 Dec - Saturday, 23 Dec */
export const getDetailedFormattedDateTime = (dateFrom: Date, dateTo?: Date) => {
  const dateFromOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "short",
    day: "numeric",
  };

  const dateToOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "short",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  const currentYear = new Date().getFullYear();
  const fromYear = dateFrom.getFullYear();
  const toYear = dateTo?.getFullYear();

  let formattedDateFrom = dateFrom.toLocaleString("en-GB", dateFromOptions);
  if (fromYear !== currentYear) {
    formattedDateFrom += `, ${fromYear}`;
  }

  let formattedTimeFrom = dateFrom.toLocaleString("en-GB", timeOptions);

  if (dateTo) {
    let formattedDateTo = dateTo.toLocaleString("en-GB", dateToOptions);
    if (toYear !== currentYear) {
      formattedDateTo += `, ${toYear}`;
    }

    let formattedTimeTo = dateTo.toLocaleString("en-GB", timeOptions);

    if (isSameDay(dateFrom, dateTo)) {
      return {
        date: `${formattedDateFrom}`,
        time: `${formattedTimeFrom} - ${formattedTimeTo}`,
      };
    } else {
      return {
        date: `${formattedDateFrom} - ${formattedDateTo}`,
        time: formattedTimeFrom,
      };
    }
  }

  return {
    date: formattedDateFrom,
    time: formattedTimeFrom,
  };
};

export const splitStringAtFirstComma = (
  str: string,
): { firstPart: string; rest: string } => {
  const [firstPart, ...rest] = str.split(",");
  return { firstPart: firstPart.trim(), rest: rest.join(",").trim() };
};

export const getErrorMessage = (error: unknown) => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Something went wrong";
  }
  return message;
};
