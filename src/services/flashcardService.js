const db = require("~/models");

// insert in the middle using order index
const insertInMiddle = async (setId, cardId, orderIndex) => {
  try {
    // Tìm flashcardOrder hiện tại
    const flashcardOrder = await db.FlashcardOrder.findOne({
      where: { flashcardSetId: setId, flashcardId: cardId },
    });

    if (!flashcardOrder) {
      return {
        EM: "Flashcard order not found",
        EC: 1,
      };
    }

    const oldOrderIndex = flashcardOrder.orderIndex;

    // Cập nhật orderIndex của flashcardOrder hiện tại
    await flashcardOrder.update({ orderIndex });

    if (orderIndex > oldOrderIndex) {
      // Nếu orderIndex mới lớn hơn oldOrderIndex, cập nhật các bản ghi khác
      const flashcardOrders = await db.FlashcardOrder.findAll({
        where: {
          flashcardSetId: setId,
          orderIndex: {
            [db.Sequelize.Op.gt]: oldOrderIndex,
            [db.Sequelize.Op.lte]: orderIndex,
          },
          flashcardId: { [db.Sequelize.Op.ne]: cardId },
        },
      });

      await Promise.all(
        flashcardOrders.map((flashcardOrder) =>
          flashcardOrder.update({
            orderIndex: flashcardOrder.orderIndex - 1,
          })
        )
      );
    } else if (orderIndex < oldOrderIndex) {
      // Nếu orderIndex mới nhỏ hơn oldOrderIndex, cập nhật các bản ghi khác
      const flashcardOrders = await db.FlashcardOrder.findAll({
        where: {
          flashcardSetId: setId,
          orderIndex: {
            [db.Sequelize.Op.gte]: orderIndex,
            [db.Sequelize.Op.lt]: oldOrderIndex,
          },
          flashcardId: { [db.Sequelize.Op.ne]: cardId },
        },
      });

      await Promise.all(
        flashcardOrders.map((flashcardOrder) =>
          flashcardOrder.update({
            orderIndex: flashcardOrder.orderIndex + 1,
          })
        )
      );
    }

    return {
      EM: "Edit flashcard successfully",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in insertInMiddle:", error);
    return {
      EM: "Failed to edit flashcard",
      EC: 2,
    };
  }
};

const createAndInsertNewFlashcardAtEnd = async (setId, word, definition) => {
  try {
    // Tạo flashcard mới
    const flashcard = await db.Flashcard.create({ word, definition });

    // Tìm flashcardOrder có orderIndex lớn nhất
    const flashcardOrderHighest = await db.FlashcardOrder.findOne({
      where: { flashcardSetId: setId },
      order: [["orderIndex", "DESC"]],
    });

    let flashcardOrderCount = 0;

    if (flashcardOrderHighest) {
      flashcardOrderCount = flashcardOrderHighest.orderIndex + 1;
    }

    // Tạo flashcardOrder mới
    await db.FlashcardOrder.create({
      flashcardId: flashcard.id,
      flashcardSetId: setId,
      orderIndex: flashcardOrderCount,
    });

    return flashcard;
  } catch (error) {
    console.error("Error in createAndInsertNewFlashcardAtEnd:", error);
    return null;
  }
};

async function getFlashcardSet(flashcardSetId, user) {
  const flashcardSet = await db.FlashcardSet.findOne({
    where: { id: flashcardSetId },
    include: [
      {
        model: db.Flashcard,
        as: "flashcards",
        attributes: ["id", "word", "definition"],
        through: {
          model: db.FlashcardOrder,
          as: "flashcardOrder",
          attributes: [],
        },
      },
    ],
  });

  const flashcardOrderIds = await db.FlashcardOrder.findAll({
    where: { flashcardSetId },
    attributes: ["flashcardId", "orderIndex"],
  });

  // tra ve array cac id duoc sap xep theo orderIndex
  flashcardOrderIds.sort((a, b) => a.orderIndex - b.orderIndex);

  // chuyen ve dang array cac id
  const flashcardOrderIdsArray = flashcardOrderIds.map(
    (flashcardOrder) => flashcardOrder.flashcardId
  );

  // // them vao userHistory voi activityType la view
  await db.UserHistory.create({
    userId: user.id,
    flashcardSetId,
    activityType: "view",
  });

  if (!flashcardSet) {
    return {
      EM: "Flashcard set not found",
      EC: 1,
      data: null,
    };
  }

  return {
    EM: "Fetch flashcard set successfully",
    EC: 0,
    data: {
      id: flashcardSet.id,
      title: flashcardSet.title,
      description: flashcardSet.description,
      flashcardOrderIds: flashcardOrderIdsArray,
      createdAt: flashcardSet.createdAt,
      updatedAt: flashcardSet.updatedAt,
      flashcards: flashcardSet.flashcards.map((flashcard) => ({
        id: flashcard.id,
        word: flashcard.word,
        definition: flashcard.definition,
      })),
    },
  };
}

async function createFlashcardSet(rawFlashcardSetData, user) {
  const { title, description } = rawFlashcardSetData;

  // Tạo FlashcardSet
  const flashcardSet = await db.FlashcardSet.create({
    title,
    description,
  });

  if (!flashcardSet) {
    return {
      EM: "Failed to create flashcard set",
      EC: 1,
    };
  }

  // Tạo FlashcardUser
  await db.FlashcardSetUser.create({
    flashcardSetId: flashcardSet.id, 
    userId: user.id,
    isCreator: true,
  });

  return {
    EM: "Create flashcard set successfully",
    EC: 0,
    data: {
      id: flashcardSet.id,
    },
  };
}

async function editFlashcard(rawData) {
  console.log(rawData);
  // rawData co dang nhu sau:
  // [
  //  {
  //   setId: 1,
  //   cardId: 1,
  //   word: "Hello",
  //   definition: "Xin chào",
  //   orderIndex: 0
  //  }
  //  { ... }
  // ]

  // truong hop co 1 object duy nhat trong array rawData
  // thi se co 1 truong hop la thay doi orderIndex
  // khi do phai update lai orderIndex cua flashcardOrder
  // va update lai orderIndex cua cac flashcardOrder khac
  if (
    rawData.length === 1 &&
    rawData[0].cardId !== undefined &&
    rawData[0].orderIndex !== undefined
  ) {
    const { setId, cardId, orderIndex } = rawData[0];

    if (orderIndex !== undefined) {
      const result = await insertInMiddle(setId, cardId, orderIndex);

      return {
        EM: result.EM,
        EC: result.EC,
      };
    }
  }

  // truong hop co nhieu object trong array rawData
  // thi se co 2 truong hop la thay doi noi dung cua flashcard
  // hoac tao moi flashcard
  // truong hop 1: thay doi noi dung cua flashcard
  // object co dang { setId: 1, cardId: 1, word: "Hello", definition: "Xin chào" }
  // truong hop 2: tao moi flashcard
  // object co dang { setId: 1, word: "Hello", definition: "Xin chào", orderIndex: 0 }
  else {
    const flashcardOrderPromises = rawData.map(async (data) => {
      const { setId, cardId, word, definition, orderIndex } = data;

      if (cardId) {
        const flashcard = await db.Flashcard.findOne({
          where: { id: cardId },
        });

        if (!flashcard) {
          return {
            EM: "Flashcard not found",
            EC: 1,
          };
        }

        await flashcard.update({ word, definition });

        return {
          EM: "Edit flashcard successfully",
          EC: 0,
        };
      } else {
        const flashcard = await createAndInsertNewFlashcardAtEnd(
          setId,
          word,
          definition
        );

        if (!flashcard) {
          return {
            EM: "Failed to create flashcard",
            EC: 2,
          };
        }

        const result = await insertInMiddle(setId, flashcard.id, orderIndex);

        return {
          EM: result.EM,
          EC: result.EC,
        };
      }
    });

    await Promise.all(flashcardOrderPromises);

    return {
      EM: "Edit flashcard successfully",
      EC: 0,
    };
  }
}

async function deleteFlashcardSet(flashcardSetId) {
  const flashcardSet = await db.FlashcardSet.findOne({
    where: { id: flashcardSetId },
  });

  if (!flashcardSet) {
    return {
      EM: "Flashcard set not found",
      EC: 1,
    };
  }

  // Tìm các flashcardId liên quan từ FlashcardOrder
  const flashcardOrders = await db.FlashcardOrder.findAll({
    where: { flashcardSetId },
  });

  const flashcardIds = flashcardOrders.map((order) => order.flashcardId);

  // Xóa các bản ghi từ bảng Flashcard dựa trên flashcardIds tìm được
  if (flashcardIds.length > 0) {
    await db.Flashcard.destroy({
      where: { id: flashcardIds },
    });
  }

  // Xóa các bản ghi từ bảng FlashcardOrder dựa trên flashcardSetId
  await db.FlashcardOrder.destroy({
    where: { flashcardSetId },
  });

  // Xóa bản ghi từ bảng FlashcardSet dựa trên flashcardSetId
  await db.FlashcardSet.destroy({
    where: { id: flashcardSetId },
  });

  return {
    EM: "Delete flashcard set successfully",
    EC: 0,
    data: {
      id: flashcardSetId,
    },
  };
}

async function deleteFlashcard(flashcardId) {
  const flashcard = await db.Flashcard.findOne({
    where: { id: flashcardId },
  });

  if (!flashcard) {
    return {
      EM: "Flashcard not found",
      EC: 1,
    };
  }

  await db.FlashcardOrder.destroy({
    where: { flashcardId },
  });

  // cap nhat lai orderIndex cua cac flashcardOrder
  const flashcardOrders = await db.FlashcardOrder.findAll({
    where: { flashcardId: { [db.Sequelize.Op.ne]: flashcardId } },
  });

  flashcardOrders.forEach(async (flashcardOrder, index) => {
    await flashcardOrder.update({ orderIndex: index });
  });

  await db.Flashcard.destroy({
    where: { id: flashcardId },
  });

  return {
    EM: "Delete flashcard successfully",
    EC: 0,
    data: {
      id: flashcardId,
    },
  };
}

async function createFlashcard(setId) {
  const flashcard = await createAndInsertNewFlashcardAtEnd(setId, "", "");

  if (!flashcard) {
    return {
      EM: "Failed to create flashcard",
      EC: 1,
    };
  }

  return {
    EM: "Create flashcard successfully",
    EC: 0,
    data: {
      id: flashcard.id,
    },
  };
}

// get history
async function getHistory(user) {
  // lay ra tat ca cac flashcardSetId ma user da xem va chi lay ra 1 lan cuoi cung
  // Thực thi subquery để lấy danh sách flashcardSetId
  const subquery = await db.UserHistory.findAll({
    where: { userId: user.id, activityType: "view" },
    attributes: ["flashcardSetId"],
    group: ["flashcardSetId"],
    raw: true,
  });
  
  // Trích xuất danh sách flashcardSetId từ kết quả subquery
  const flashcardSetIds = subquery.map(item => item.flashcardSetId);
  
  // Sử dụng danh sách flashcardSetId trong mệnh đề WHERE của truy vấn chính
  const userHistories = await db.UserHistory.findAll({
    where: {
      flashcardSetId: {
        [db.Sequelize.Op.in]: flashcardSetIds
      }
    },
    attributes: ["flashcardSetId", [db.Sequelize.fn("MAX", db.Sequelize.col("createdAt")), "latestView"]],
    group: ["flashcardSetId"],
    order: [[db.Sequelize.literal("latestView"), "DESC"]],
  });

  const flashcardSetIdsArray = userHistories.map(item => item.flashcardSetId);
  
  // lay ra cac flashcardSet tu flashcardSetIds bao gom title, description, userId da tao
  const flashcardSets = await db.FlashcardSet.findAll({
    where: { id: flashcardSetIdsArray },
    include: [
      {
        model: db.User,
        as: "users",
        attributes: ["id"],
        through: {
          model: db.FlashcardSetUser,
          as: "flashcardSetUser",
          attributes: ["isCreator"],
        },
      },
    ],
    attributes: ["id", "title", "description"],
    raw: true,
    nest: true,
  });

  const adjustedFlashcardSets = flashcardSets.map(flashcardSet => ({
    id: flashcardSet.id,
    title: flashcardSet.title,
    description: flashcardSet.description,
    userId: flashcardSet.users.id,
  }));

  // lay ra name va avatar cua user da tao trong bang profile bang cach map qua adjustedFlashcardSets
  // su dung promise.all de chay song song
  await Promise.all(
    adjustedFlashcardSets.map(async (flashcardSet) => {
      const user = await db.User.findOne({
        where: { id: flashcardSet.userId },
        include: [
          {
            model: db.Profile,
            as: "profile",
            attributes: ["firstName", "lastName", "avatar"],
          },
        ],
        raw: true,
        nest: true, // Sử dụng nest để nhận kết quả dưới dạng đối tượng lồng nhau
      });
  
      if (user && user.profile) {
        flashcardSet.name = user.profile.firstName + " " + user.profile.lastName;
        flashcardSet.avatar = user.profile.avatar;
      } else {
        flashcardSet.name = "Unknown User";
        flashcardSet.avatar = null;
      }
    })
  );

  return {
    EM: "Fetch history successfully",
    EC: 0,
    data: {
      flashcardSets: adjustedFlashcardSets,
      userHistories: userHistories,
    },
  };

}

module.exports = {
  getFlashcardSet,
  createFlashcardSet,
  editFlashcard,
  deleteFlashcardSet,
  deleteFlashcard,
  createFlashcard,
  getHistory,
};
