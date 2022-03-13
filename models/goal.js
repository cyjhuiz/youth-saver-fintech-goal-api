const { INTEGER, STRING, FLOAT } = require("sequelize");

const { sequelize } = require("../util/database");

const sequelizeConfig = { timestamps: false };

const Goal = sequelize.define(
  "goal",
  {
    goalID: {
      type: INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userID: {
      type: INTEGER,
      autoIncrement: false,
      allowNull: false,
      primaryKey: true,
    },
    goalName: {
      type: STRING,
      allowNull: false,
    },
    goalPrice: {
      type: FLOAT,
      allowNull: false,
    },
    productImgUrl: {
      type: STRING,
      allowNull: false,
    },
    goalStatus: {
      type: STRING,
      allowNull: false,
    },
  },
  sequelizeConfig
);

module.exports = Goal;
