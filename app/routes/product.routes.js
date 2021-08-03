const authorize = require('../helpers/authJwt');

module.exports = app => {
  const products = require("../controllers/products");

  var router = require("express").Router();

  // Create a new Product
  router.post("/", [authorize.verifyToken, authorize.isAdmin], products.create);

  // Retrieve all Products
  router.get("/", products.findAll);

  // Retrieve a single Product with id
  router.get("/:id", products.findOne);

  // Update a Product with id
  router.put("/:id", [authorize.verifyToken, authorize.isAdmin], products.update);

  // Delete a Product with id
  router.delete("/:id", [authorize.verifyToken, authorize.isAdmin], products.delete);

  app.use('/api/product', router);
};