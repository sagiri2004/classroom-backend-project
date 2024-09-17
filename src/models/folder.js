"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Folder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Folder.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Folder.belongsToMany(models.FlashcardSet, {
        through: models.FlashcardSetFolder,  // Bảng trung gian
        foreignKey: 'folderId',
        otherKey: 'flashcardSetId',
        as: 'flashcardSets',  // Alias của quan hệ
      });
      
    }
  }
  Folder.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Folder",
    }
  );
  return Folder;
};
