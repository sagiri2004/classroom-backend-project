'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class FlashcardSetFolder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Mối quan hệ với FlashcardSet
      FlashcardSetFolder.belongsTo(models.FlashcardSet, {
        foreignKey: 'flashcardSetId',
        as: 'flashcardSet',
        onDelete: 'CASCADE',
      });

      // Mối quan hệ với Folder
      FlashcardSetFolder.belongsTo(models.Folder, {
        foreignKey: 'folderId',
        as: 'folder',
        onDelete: 'CASCADE',
      });
    }
  }

  FlashcardSetFolder.init(
    {
      flashcardSetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'FlashcardSets',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      folderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Folders',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'FlashcardSetFolder',
      tableName: 'Flashcard_Set_Folders',
      timestamps: true,  // Tự động tạo createdAt, updatedAt
    }
  );

  return FlashcardSetFolder;
};
