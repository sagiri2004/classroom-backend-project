const flashcardService = require("~/services/flashcardService");

class FlashcardsController {
  async createFlashcardSet(req, res) {
    const rawFlashcardSetData = req.body;
    const user = req.user;
    try {
      const result = await flashcardService.createFlashcardSet(
        rawFlashcardSetData,
        user
      );

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
    const user = req.user;
    try {
      const result = await flashcardService.getFlashcardSet(id, user);

      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        EM: "Internal server error",
        EC: 1,
      });
    }
  }

  async editFlashcard(req, res) {
    const rawData = req.body;

    try {
      const result = await flashcardService.editFlashcard(rawData);

      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        EM: "Internal server error",
        EC: 1,
      });
    }
  }

  async deleteFlashcardSet(req, res) {
    const { id } = req.params;

    try {
      const result = await flashcardService.deleteFlashcardSet(id);

      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        EM: "Internal server error",
        EC: 1,
      });
    }
  }

  async deleteFlashcard(req, res) {
    const { id } = req.params;

    try {
      const result = await flashcardService.deleteFlashcard(id);

      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        EM: "Internal server error",
        EC: 1,
        data: {
          id,
        }
      });
    }
  }

  async addFlashcard(req, res) {
    const { setId } = req.body;

    try {
      const result = await flashcardService.createFlashcard(setId);

      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        EM: "Internal server error",
        EC: 1,
      });
    }
  }

  async getHistory(req, res) {
    const user = req.user;
    try {
      const result = await flashcardService.getHistory(user);

      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        EM: "Internal server error",
        EC: 1,
      });
    }
  }

  async getTop10Viewed(req, res) {
    try {
      const result = await flashcardService.getTop10PopularFlashcardSet();
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        EM: "Internal server error",
        EC: 1,
      });
    }
  }

  async getTop10User(req, res) {
    try {
      const result = await flashcardService.getTop10UserCreatedMostFlashcardSet();
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        EM: "Internal server error",
        EC: 1,
      });
    }
  }

  async getMyFlashcardSets(req, res) {
    const user = req.user;
    try {
      const result = await flashcardService.getMyFlashcardSets(user);
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
