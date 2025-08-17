// ./src/routes/translation.js
const express = require('express');
const router = express.Router();

router.post('/translate', (req, res) => {
  const { text, targetLang = 'en', mode = 'conversation' } = req.body;
  let result = text;

  // 简单术语映射
  const dict = {
    知识产权: 'Intellectual Property',
    南海: 'the South China Sea',
    一带一路: 'the Belt and Road Initiative',
    人类命运共同体: 'a community with a shared future for mankind',
    新型大国关系: 'a new model of major-country relationship',
    革命: 'revolution',
    自由: 'freedom'
  };
  Object.keys(dict).forEach(k => {
    result = result.replace(new RegExp(k, 'gi'), dict[k]);
  });

  res.json({ translated: result });
});

module.exports = router;
