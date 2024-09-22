"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FlashcardSetPopularity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Định nghĩa mối quan hệ với FlashcardSet
      FlashcardSetPopularity.belongsTo(models.FlashcardSet, {
        foreignKey: "flashcardSetId",
        as: "flashcardSet",
        onDelete: "CASCADE",
      });
    }
  }

  FlashcardSetPopularity.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      flashcardSetId: {
        type: DataTypes.INTEGER,
        references: {
          model: "FlashcardSets",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "FlashcardSetPopularity",
      tableName: "Flashcard_Set_Popularity",
    }
  );

  return FlashcardSetPopularity;
};