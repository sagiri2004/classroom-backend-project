"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class FlashcardOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      FlashcardOrder.belongsTo(models.FlashcardSet, {
        foreignKey: "flashcardSetId",
        as: "flashcardSet",
      });

      // Mối quan hệ đến Flashcard
      FlashcardOrder.belongsTo(models.Flashcard, {
        foreignKey: "flashcardId",
        as: "flashcard",
      });
    }
  }
  
  FlashcardOrder.init(
    {
      flashcardSetId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'FlashcardSets',
          key: 'id'
        },
        allowNull: false
      },
      flashcardId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Flashcards',
          key: 'id'
        },
        allowNull: false
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "FlashcardOrder",
      tableName: 'Flashcard_Orders'
    }
  );
  
  return FlashcardOrder;
};
