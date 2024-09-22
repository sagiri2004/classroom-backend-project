require('dotenv').config();
const jwt = require('jsonwebtoken');

const checkUserLoggedIn = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // tra ve req.user = null de check xem user co dang nhap hay khong
        req.user = null;
        return next(); // Nếu không có token, tiếp tục xử lý yêu cầu
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

module.exports = checkUserLoggedIn;