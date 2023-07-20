const AppError = require("../helpers/AppError");

const handleValidationError = () => {
  return new AppError("Validation Failed", 400);
};

const handleCastError = () => {
  return new AppError("Cast Error", 404);
};

module.exports = {
  handleValidationError,
  handleCastError
};
