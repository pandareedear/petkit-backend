const createError = require("../utils/create-error");

module.exports = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      next(createError("Your are unauthorized", 401));
      return;
    }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      err.statusCode = 401;
    }
    next(err);
  }
};
