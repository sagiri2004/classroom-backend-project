'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Flashcard_Set_Folders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      flashcardSetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Flashcard_Sets',  // Tên bảng FlashcardSets
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      folderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Folders',  // Tên bảng Folders
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Flashcard_Set_Folders');
  },
};
