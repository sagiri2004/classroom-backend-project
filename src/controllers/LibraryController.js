const db = require("~/models");
const flashcard = require("~/models/flashcard");

async function findUserProfileWithUserId(userId) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await db.User.findOne({
      where: { id: userId },
      include: [
        {
          model: db.Profile,
          as: "profile", // Alias cần khớp với alias định nghĩa trong model
          attributes: ["avatar", "firstName", "lastName"],
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error finding user profile:", error.message);
    throw error;
  }
}

class LibraryController {
  async getLibrary(req, res) {
    try {
      const userId = req.user.id;
      const folders = await db.Folder.findAll({
        where: { userId },
        include: [
          {
            model: db.FlashcardSet,
            as: "flashcardSets",
            through: { attributes: [] },
          },
        ],
      });
      const flashcardSets = await db.User.findOne({
        where: { id: userId },
        include: [
          {
            model: db.FlashcardSet,
            as: "flashcardSets",
            through: { attributes: [] },
          },
          {
            model: db.Profile,
            as: "profile", // Alias cần khớp với alias định nghĩa trong model
            attributes: ["avatar", "firstName", "lastName"],
          },
        ],
      });

      const countFlashcardInFlashcardSets = await db.FlashcardOrder.findAll({
        attributes: [
          "flashcardSetId",
          [db.sequelize.fn("COUNT", "flashcardId"), "count"],
        ],
        group: ["flashcardSetId"],
      });

      res.json({
        EM: "Get library successfully",
        EC: 0,
        data: {
          folders: [
            ...folders.map((folder) => {
              return {
                id: folder.id,
                name: folder.name,
                count: folder.flashcardSets.length,
              };
            }),
          ],
          flashcardSets: flashcardSets.flashcardSets.map((flashcardSet) => {
            return {
              id: flashcardSet.id,
              title: flashcardSet.title,
              count:
                countFlashcardInFlashcardSets.find(
                  (item) => item.flashcardSetId === flashcardSet.id
                )?.dataValues.count || 0,
            };
          }),
          profile: {
            avatar: flashcardSets.profile.avatar,
            fullName: `${flashcardSets.profile.firstName} ${flashcardSets.profile.lastName}`,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createFolder(req, res) {
    try {
      const userId = req.user.id;
      const { name } = req.body;
      const folder = await db.Folder.create({ name, userId });

      res.json({
        EM: "Create folder successfully",
        EC: 0,
        data: {
          id: folder.id,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // them flashcardSet vao folder
  async addFlashcardSetsToFolder(req, res) {
    try {
      const { folderId, flashcardSetIds } = req.body;
      const userId = req.user.id;

      const check = await db.Folder.findOne({
        where: { id: folderId, userId },
      });

      if (!check) {
        return res.status(404).json({ message: "Folder not found" });
      }
      const folder = await db.Folder.findByPk(folderId);
      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }

      const flashcardSets = await db.FlashcardSet.findAll({
        where: { id: flashcardSetIds },
      });

      if (flashcardSets.length !== flashcardSetIds.length) {
        return res.status(404).json({ message: "Flashcard set not found" });
      }

      await folder.addFlashcardSets(flashcardSets);

      res.json({
        EM: "Add flashcard set to folder successfully",
        EC: 0,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getFolder(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
  
      // Tìm folder với các flashcard sets và thêm title của flashcard set
      const folder = await db.Folder.findOne({
        where: { id, userId },
        include: [
          {
            model: db.FlashcardSet,
            as: "flashcardSets",
            attributes: ['id', 'title'], // Lấy cả id và title của flashcardSet
            through: { attributes: [] }, // Không lấy dữ liệu từ bảng trung gian
          },
        ],
      });
  
      // Kiểm tra nếu folder không tồn tại
      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }
  
      // Lấy danh sách flashcardSetId
      const flashcardSetIdWithAuthor = await Promise.all(
        folder.flashcardSets.map(async (flashcardSet) => {
          const creator = await db.FlashcardSetUser.findOne({
            where: { flashcardSetId: flashcardSet.id, isCreator: true },
            include: [
              {
                model: db.User,
                as: "user",
                include: [{ model: db.Profile, as: "profile", attributes: ['firstName', 'lastName', 'avatar'] }],
              },
            ],
          });
  
          return {
            flashcardSetId: flashcardSet.id,
            title: flashcardSet.title, // Thêm title của flashcard set vào kết quả trả về
            author: creator
              ? {
                  name: `${creator.user.profile.firstName} ${creator.user.profile.lastName}`,
                  avatar: creator.user.profile.avatar,
                }
              : null,
          };
        })
      );
  
      // Trả về kết quả
      res.json({
        EM: "Get folder successfully",
        EC: 0,
        data: {
          folderId: folder.id,
          folderName: folder.name, // Nếu folder có trường name
          flashcardSets: flashcardSetIdWithAuthor, // Trả về cả flashcard sets với title và author
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  
}

module.exports = new LibraryController();
