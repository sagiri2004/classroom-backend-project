const express = require("express");
const router = express.Router();
const libraryController = require("~/controllers/LibraryController");
const authenticateToken = require("~/middleware/authenticateToken");

// router.post("/folder/add", authenticateToken, libraryController.addFlashcardSetsToFolder);
router.post("/folder", authenticateToken, libraryController.createFolder);
router.get("/folder/:id", authenticateToken, libraryController.getFolder);
router.get("/my-flashcard-sets", authenticateToken, libraryController.getFlashcardSetsCreatedByUser);
router.put("/folder/:id", authenticateToken, libraryController.updateFlashcardSetsInFolder);
router.get("/", authenticateToken, libraryController.getLibrary);

module.exports = router;
