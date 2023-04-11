const tryCatchMiddleware = (controller) => {
  const func = async () => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};
module.exports = tryCatchMiddleware;
