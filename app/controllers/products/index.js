const db = require("../../models");
const Product = db.products;

// Create and Save a new Product
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.stock) {
    return res.status(400).json({
      message: "Name or stock can not be empty!"
    });
  }

  // Create a Product
  const product = {
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    image: req.body.image
  };

  // Save Product in the database
  return Product.create(product)
    .then(data => {
      return res.json({
        success: true,
        message: 'Product create successfully',
        data
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: true,
        message:
          err.message || "Some error occurred while creating the Product."
      });
    });
};

// Retrieve all Products from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Product.findAll({ where: condition })
    .then(data => {
      return res.json({
        success: true,
        message: '',
        data
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message:
          err.message || "Some error occurred while retrieving products."
      });
    });
};

// Find a single Product with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id can not be empty!"
    });
  }

  Product.findByPk(id)
    .then(data => {
      return res.json({
        success: true,
        message: '',
        data
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: "Error retrieving Product with id=" + id
      });
    });
};

// Update a Product by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id can not be empty!"
    });
  }

  return Product.update(req.body, {
    where: { id: id }
  })
    .then(record => {
      if (record) {
        return res.json({
          success: true,
          message: "Product was updated successfully."
        });
      }
      return res.json({
        success: false,
        message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: "Error updating Product with id=" + id
      });
    });
};

// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id can not be empty!"
    });
  }

  return Product.destroy({
    where: { id: id }
  })
    .then(record => {
      if (record) {
        return res.json({
          success: true,
          message: "Product was deleted successfully!"
        });
      }

      return res.json({
        success: false,
        message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: "Could not delete Product with id=" + id
      });
    });
};