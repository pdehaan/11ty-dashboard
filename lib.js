const cleanTextUtils = require('clean-text-utils');
const { isDate } = require("lodash");
const { DateTime } = require("luxon");

module.exports = {
  createDateRange,
  inDateRange,
  stripEmoji
};

function stripEmoji(string="") {
  return cleanTextUtils.strip.nonASCII(string)
    .replace(/\s+/g, " ");
}

function createDateRange({ startDate, endDate } = {}) {
  if (!endDate) {
    // If no endDate specified, use current date.
    endDate = new Date();
  } else if (!isDate(endDate)) {
    // If endDate was specified, but not a date object, covert to date.
    endDate = new Date(endDate);
  }

  if (!startDate) {
    // If no startDate specified, use endDate minus 7 days.
    startDate = DateTime.fromJSDate(endDate)
      .minus({ days: 7 })
      .toJSDate();
    // Trim any hours:minutes:seconds from the date.
    startDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
  } else if (!isDate(startDate)) {
    // If startDate was specified, but not a date object, convert to date.
    startDate = new Date(startDate);
  }

  // If startDate is newer than endDate, swap values.
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  return {
    startDate,
    endDate
  };
}

function inDateRange(startDate, endDate) {
  return targetDate => {
    targetDate = new Date(targetDate);
    return targetDate >= startDate && targetDate <= endDate;
  };
}
