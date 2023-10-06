const dateToString = (date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

const sortByDateCreated = (arr) => {
  arr.sort((a, b) => {
    const dateA = a.dateCreated;
    const dateB = b.dateCreated;
    return dateA.localeCompare(dateB);
  });
  return arr;
};

// Function to convert date from "MM/DD/YYYY" to "YYYY/MM/DD" format
const formatDate = (dateString) => {
  const [month, day, year] = dateString.split("/");
  return `${year}/${month}/${day}`;
};

const createDateWithRandomDay = () => {
  const date = new DateExtention();
  date.setRandomDay();
  date.setMonth(4);
  const stringDate = dateToString(date);
  const formatedDate = formatDate(stringDate);
  return formatedDate;
};

class DateExtention extends Date {
  constructor() {
    super();
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  setRandomDay() {
    return super.setDate(this.randomInt(1, 28));
  }
}

module.exports = {
  dateToString,
  createDateWithRandomDay,
  sortByDateCreated,
  DateExtention
};
