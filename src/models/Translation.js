const mongoose = require('mongoose');

const TranslationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true  // 添加索引提高查询效率
  },
  sourceText: {
    type: String,
    required: true,
    trim: true
  },
  translatedText: {
    type: String,
    required: true,
    trim: true
  },
  sourceLang: {
    type: String,
    required: true,
    enum: ['zh', 'en', 'ja', 'es', 'fr', 'de']  // 限制语言类型
  },
  targetLang: {
    type: String,
    required: true,
    enum: ['zh', 'en', 'ja', 'es', 'fr', 'de']
  },
  translationMode: { 
    type: String, 
    enum: ['conversation', 'academic'],
    default: 'conversation'  // 设置默认值
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true  // 添加索引
  },
});

module.exports = mongoose.model('Translation', TranslationSchema);
