"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: "userId", as: "profile" });
      User.belongsToMany(models.FlashcardSet, {
        through: models.FlashcardSetUser, // Phải khớp với tên bảng trung gian
        foreignKey: "userId",
        otherKey: "flashcardSetId",
        as: "flashcardSets",
      });
      User.hasMany(models.Folder, { foreignKey: "userId", as: "folders" })
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      roleId: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  
  return User;
};
