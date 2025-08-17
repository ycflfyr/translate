const JWT = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: '未提供认证令牌' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ error: '用户不存在' });
        }
        
        req.user = {
            userId: user._id,
            username: user.username
        };
        
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: '无效的认证令牌' });
    }
};
