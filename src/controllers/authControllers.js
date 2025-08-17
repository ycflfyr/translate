const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const User = require('../models/userModel'); // 使用MongoDB模型

exports.register = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        
        // 检查用户是否存在
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ error: '用户名或邮箱已存在' });
        }
        
        // 密码加密
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 创建用户
        const newUser = new User({
            username,
            email,
            phone,
            password: hashedPassword
        });
        
        await newUser.save();
        
        res.status(201).json({ 
            message: '注册成功', 
            userId: newUser._id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ 
            $or: [{ username }, { email: username }] 
        });
        
        if (!user) {
            return res.status(401).json({ error: '用户不存在' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: '密码错误' });
        }
        
        const token = JWT.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器内部错误' });
    }
};
