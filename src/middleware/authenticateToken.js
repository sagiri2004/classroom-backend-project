require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({
            EM: "Token is required",
            EC: 1
        }); // Nếu không có token, trả về 401
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    EM: "Token has expired",
                    EC: 2
                }); // Token hết hạn, trả về 401
            }
            return res.status(403).json({
                EM: "Token is not valid",
                EC: 3
            }); // Token không hợp lệ, trả về 403
        }
        req.user = user;
        next(); // Token hợp lệ, tiếp tục xử lý yêu cầu
    });
};

module.exports = authenticateToken;