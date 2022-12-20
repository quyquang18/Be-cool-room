'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class valueSensor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  valueSensor.init({
    temperature: DataTypes.STRING,
    humidity: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    time: DataTypes.TIME,
    locationID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'valueSensor',
  });
  return valueSensor;
};