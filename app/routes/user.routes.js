const authorize = require('../helpers/authJwt');
const verifySignUp = require('../helpers/verifySignUp');

module.exports = app => {
  const users = require("../controllers/users");

  var router = require("express").Router();

  // Create a new User
  router.post("/signup", verifySignUp.checkDuplicateUsernameOrEmail, users.signup);

  // User sign in
  router.post("/signin", users.signin);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", [authorize.verifyToken, authorize.isAdmin], users.delete);

  app.use('/api/user', router);
};