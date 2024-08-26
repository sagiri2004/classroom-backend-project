const loginRegisterService = require('../services/loginRegisterService');
const jwt = require("jsonwebtoken");

class ApiController {
    async register(req, res) {
        const rawUserData = req.body;
        const result = await loginRegisterService.registerUser(rawUserData);

        res.json(result);
    }

    async login(req, res) {
        const rawUserData = req.body;
        const result = await loginRegisterService.loginUser(rawUserData, res);
        
        res.json(result);
    }

    async profile(req, res) {
        const rawUserData = req.user;
        const result = await loginRegisterService.getProfile(rawUserData);

        res.json(result);
    }

    async refreshToken(req, res) {
        const refreshToken = req?.cookies?.refreshToken;

        console.log(req.cookies);
        console.log(refreshToken);

        if (!refreshToken) {
            return res.status(401).json({ EM: "Refresh token is required", EC: 1 });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const accessToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

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