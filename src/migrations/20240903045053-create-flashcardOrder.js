'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Flashcard_Orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      flashcardSetId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Flashcard_Sets',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      flashcardId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Flashcards',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      orderIndex: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Flashcard_Orders');
  }
};
