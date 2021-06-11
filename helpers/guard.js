const passport = require("passport");
const { HttpCode } = require("./constants");
require("../config/passport");
const guard = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    let token = null;
    if (req.get("Authorization")) {
      token = req.get("Authorization").split(" ")[1];
    }
    if (!user || error || token !== user.token) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Access is denied",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
  next();
};

module.exports = guard;
