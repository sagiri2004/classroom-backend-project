"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class FlashcardSet extends Model {
    static associate(models) {
      FlashcardSet.belongsToMany(models.Flashcard, {
        through: models.FlashcardOrder,
        foreignKey: "flashcardSetId",
        otherKey: "flashcardId",
        as: "flashcards",
      });
      FlashcardSet.belongsToMany(models.User, {
        through: models.FlashcardSetUser,
        foreignKey: "flashcardSetId",
        otherKey: "userId",
        as: "users",
      });
      FlashcardSet.belongsToMany(models.Folder, {
        through: models.FlashcardSetFolder,  // Bảng trung gian
        foreignKey: 'flashcardSetId',
        otherKey: 'folderId',
        as: 'folders',  // Alias của quan hệ
      });
      FlashcardSet.hasMany(models.UserHistory, {
        foreignKey: "flashcardSetId",
        as: "userHistories",
      });
      FlashcardSet.hasOne(models.FlashcardSetPopularity, {
        foreignKey: "flashcardSetId",
        as: "popularity",
        onDelete: "CASCADE",
      });
    }
  }

  FlashcardSet.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "FlashcardSet",
      tableName: "Flashcard_Sets",
    }
  );

  return FlashcardSet;
};
