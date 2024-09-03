const authService = require("~/services/authService");
const jwt = require("jsonwebtoken");
const redis = require("~/config/redis");

class ApiController {
  async register(req, res) {
    const rawUserData = req.body;
    const result = await authService.registerUser(rawUserData);

    res.json(result);
  }

  async login(req, res) {
    const rawUserData = req.body;
    const result = await authService.loginUser(rawUserData, res);

    res.json(result);
  }

  async logout(req, res) {
    const rawUserData = req.user;
    const result = await authService.logoutUser(rawUserData, res);

    res.json(result);
  }

  async refreshToken(req, res) {
    const refreshToken = req?.cookies?.refreshToken;
    
    if (!refreshToken) {
      // tra ve loi 403
      return res.status(403).json({ EM: "No refresh token provided", EC: 1 });
    }

    // check token trong redis
    const token = await redis.get(refreshToken);

    if (!token) {
      // tra ve loi 403
      return res.status(403).json({ EM: "Invalid refresh token", EC: 1 });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const accessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({
        EM: "Token refreshed successfully",
        EC: 0,
        data: {
          accessToken,
        },
      });
    } catch (error) {
      res.status(403).json({ EM: "Invalid refresh token", EC: 1 });
    }
  }
}

module.exports = new ApiController();
