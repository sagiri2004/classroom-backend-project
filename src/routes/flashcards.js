const express = require("express");
const router = express.Router();
const flashcardsController = require("~/controllers/FlashcardsController");
const authenticateToken = require("~/middleware/authenticateToken");

router.post(
  "/create",
  authenticateToken,
  flashcardsController.createFlashcardSet
);
router.put("/terms/save", flashcardsController.editFlashcard);
router.delete("/terms/:id", flashcardsController.deleteFlashcard);
router.post("/terms", flashcardsController.addFlashcard);
router.get("/:id", flashcardsController.getFlashcardSet);
router.delete("/:id", flashcardsController.deleteFlashcardSet);

module.exports = router;
