const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
const db = require("../models");
const Role = require('../helpers/role');
const User = db.users;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId)
    .then(user => {
      if (user.role !== Role.Admin) {
        return res.status(403).json({
          success: false,
          message: "Require Admin Role!"
        });
      }
      next();
    });
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};
module.exports = authJwt;