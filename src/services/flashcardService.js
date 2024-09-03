const db = require("~/models");

async function getFlashcardSet(flashcardSetId) {
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
  const flashcardOrderIdsArray = flashcardOrderIds.map((flashcardOrder) => flashcardOrder.flashcardId);

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

async function createFlashcardSet(rawFlashcardSetData) {
  const { title, description, flashcards } = rawFlashcardSetData;

  // Tạo FlashcardSet
  const flashcardSet = await db.FlashcardSet.create({
    title,
    description,
  });

  // Tạo flashcards và flashcard orders
  const flashcardOrderPromises = flashcards.map(async (flashcard, index) => {
    const { word, definition } = flashcard;

    console.log(flashcardSet.id);

    // Tạo Flashcard
    const createdFlashcard = await db.Flashcard.create({
      word,
      definition,
    });

    // Tạo FlashcardOrder
    return db.FlashcardOrder.create({
      flashcardId: createdFlashcard.id,
      flashcardSetId: flashcardSet.id,
      orderIndex: index,
    });
  });

  // Đợi tất cả flashcards và flashcard orders được tạo ra
  await Promise.all(flashcardOrderPromises);

  return {
    EM: "Create flashcard set successfully",
    EC: 0,
  };
}

async function editFlashcardSet(rawData) {
  
}

module.exports = {
  getFlashcardSet,
  createFlashcardSet,
  editFlashcardSet,
};
