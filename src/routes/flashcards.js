const express = require("express");
const router = express.Router();
const flashcardsController = require("~/controllers/FlashcardsController");

router.post("/create", flashcardsController.createFlashcardSet);
router.put("/edit", flashcardsController.editFlashcardSet);
router.get("/:id", flashcardsController.getFlashcardSet);

module.exports = router;
