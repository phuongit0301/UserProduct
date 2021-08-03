var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const config = require("../../config/config.json");
const db = require("../../models");
const User = db.users;

// Create and Save a new User
exports.signup = (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.password || !req.body.lastName) {
    return res.status(400).json({
      success: false,
      message: "Name or stock can not be empty!"
    });
  }

  // Create a User
  const user = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    last_name: req.body.lastName,
    address: req.body.address,
    spending_history: req.body.spendingHistory
  };

  // Save User in the database
  return User.create(user)
    .then(data => {
      return res.json({
        success: true,
        message: 'User created successfully',
        data
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  return User.findAll({ where: condition })
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
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single User with an id
exports.signin = (req, res) => {
  const username = req.body.username;
  if (!username) {
    return res.status(400).json({
      success: false,
      message: "User name can not be empty!"
    });
  }

  return User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(422).json({
          success: true,
          message: "User Not found.",
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).json({
          success: false,
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      return res.status(200).json({
        id: user.id,
        username: user.username,
        roles: user.role,
        accessToken: token
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: "Error retrieving User: " + err
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id can not be empty!"
    });
  }

  return User.update(req.body, {
    where: { id: id }
  })
    .then(record => {
      if (record) {
        return res.json({
          success: true,
          message: "User was updated successfully."
        });
      }
      return res.json({
        success: false,
        message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id can not be empty!"
    });
  }

  return User.destroy({
    where: { id: id }
  })
    .then(record => {
      if (record) {
        return res.json({
          success: true,
          message: "User was deleted successfully!"
        });
      }

      return res.json({
        success: false,
        message: `Cannot delete User with id=${id}. Maybe User was not found!`
      });
    })
    .catch(err => {
      return res.status(500).json({
        success: false,
        message: "Could not delete User with id=" + id,
      });
    });
};
