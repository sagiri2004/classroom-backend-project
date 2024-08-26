import db from '~/models';

class HomeController {
  async index(req, res) {
    // const data = await db.User.findAll();
    // res.json(data);
    // lay ra user co id = 1 va profile cua user do
    const data = await db.User.findOne({
      where: { id: 1 },
      include: [
        {
          model: db.Profile,
          attributes: ["bio", "avatar"],
        },
      ],
      attributes: ["id", "email"],
    });

    res.status(200).json(data);
  }
}

module.exports = new HomeController();
