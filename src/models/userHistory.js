"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserHistory extends Model {
    static associate(models) {
      // Liên kết với User
      UserHistory.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // Liên kết với FlashcardSet
      UserHistory.belongsTo(models.FlashcardSet, {
        foreignKey: "flashcardSetId",
        as: "flashcardSet",
      });
    }
  }

  // Định nghĩa các cột của bảng UserHistory
  UserHistory.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User", // Sử dụng tên model "User" thay vì chuỗi "Users"
          key: "id",
        },
        onDelete: "CASCADE",
      },
      flashcardSetId: {
        type: DataTypes.INTEGER,
        references: {
          model: "FlashcardSet", // Sử dụng tên model "FlashcardSet" thay vì chuỗi "Flashcard_Sets"
          key: "id",
        },
        onDelete: "CASCADE",
      },
      activityType: {
        type: DataTypes.STRING,
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
      modelName: "UserHistory",
      tableName: "User_Histories",
    }
  );

  return UserHistory;
};
