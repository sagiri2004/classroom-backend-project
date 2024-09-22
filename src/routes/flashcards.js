const express = require("express");
const router = express.Router();
const flashcardsController = require("~/controllers/FlashcardsController");
const authenticateToken = require("~/middleware/authenticateToken");
const checkUserLoggedIn = require("~/middleware/checkUserLoggedIn");

router.post(
  "/create",
  authenticateToken,
  flashcardsController.createFlashcardSet
);
router.put("/terms/save", flashcardsController.editFlashcard);
router.delete("/terms/:id", flashcardsController.deleteFlashcard);
router.post("/terms", flashcardsController.addFlashcard);
router.get("/history", authenticateToken, flashcardsController.getHistory);
router.get("/:id", checkUserLoggedIn, flashcardsController.getFlashcardSet);
router.delete("/:id", flashcardsController.deleteFlashcardSet);

module.exports = router;
