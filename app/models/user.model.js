module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    spending_history: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    role: {
      type: Sequelize.ENUM(['Admin', 'User']),
      defaultValue: 'User'
    }
  });
  return User;
};