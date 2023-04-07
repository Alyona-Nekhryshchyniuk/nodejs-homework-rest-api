const ErrorHandler = (status = 500, message = "server error") => {
  const error = new Error(message);
  error.status = status;
  console.log(error.status);
  return error;
};

module.exports = ErrorHandler;
