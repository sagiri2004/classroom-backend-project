const express = require("express");
const router = express.Router();
const flashcardsController = require("~/controllers/FlashcardsController");

router.post("/create", flashcardsController.createFlashcardSet);
router.put("/terms/save", flashcardsController.editFlashcard);
router.delete("/terms/:id", flashcardsController.deleteFlashcard);
router.get("/:id", flashcardsController.getFlashcardSet);
router.delete("/:id", flashcardsController.deleteFlashcardSet);

module.exports = router;
