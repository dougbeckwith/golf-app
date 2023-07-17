const dateToString = (date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

const createDateWithRandomDay = () => {
  const date = new DateExtention();
  date.setRandomDay();
  return dateToString(date);
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
  DateExtention
};
