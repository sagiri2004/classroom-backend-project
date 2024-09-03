"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Flashcard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Flashcard.belongsToMany(models.FlashcardSet, {
        through: models.FlashcardOrder,
        foreignKey: "flashcardId",
        otherKey: "flashcardSetId",
        as: "flashcardSets",
      });
    }
  }
  
  Flashcard.init(
    {
      word: {
        type: DataTypes.STRING,
        allowNull: false
      },
      definition: {
        type: DataTypes.STRING,
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: "Flashcard",
    }
  );
  
  return Flashcard;
};
