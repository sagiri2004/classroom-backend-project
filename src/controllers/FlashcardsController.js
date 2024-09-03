const flashcardService = require("~/services/flashcardService");

class FlashcardsController {
  async createFlashcardSet(req, res) {
    const rawFlashcardSetData = req.body;

    try {
      const result = await flashcardService.createFlashcardSet(rawFlashcardSetData);

      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        EM: "Internal server error",
        EC: 1,
      });
    }
  }

  async getFlashcardSet(req, res) {
    const { id } = req.params;

    try {
      const result = await flashcardService.getFlashcardSet(id);

      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        EM: "Internal server error",
        EC: 1,
      });
    }
  }

  async editFlashcardSet(req, res) {
    const rawData = req.body;

    try {
      const result = await flashcardService.editFlashcardSet(rawData);

      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        EM: "Internal server error",
        EC: 1,
      });
    }
  }
}

module.exports = new FlashcardsController();
