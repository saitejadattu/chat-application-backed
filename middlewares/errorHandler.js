
const errorHandler = (err, req, res, next) => {
  // console.log(res.status);
  const statusCode = res.status === 200 ? 500 : res.statusCode;
  console.log(err.stack);
  res.status(statusCode).json({ message: err.message });
};

module.exports = errorHandler;
