const db = require("../models");
const User = db.users;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Failed! Username is already in use!"
      });
    }
    next();
  });
};


const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;