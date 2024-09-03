"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class FlashcardSet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      FlashcardSet.belongsToMany(models.Flashcard, {
        through: models.FlashcardOrder,
        foreignKey: "flashcardSetId",
        otherKey: "flashcardId",
        as: "flashcards",
      });
    }
  }
  
  FlashcardSet.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING
      },
    },
    {
      sequelize,
      modelName: "FlashcardSet",
      tableName: 'Flashcard_Sets'
    }
  );
  
  return FlashcardSet;
};
