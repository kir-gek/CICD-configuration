const sequelize = require("../db");
const { DataTypes, Op } = require("sequelize");


// ПОРОДЫ
const DogBreed = sequelize.define("dog_breed", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING },
});


module.exports = {
  DogBreed
};
