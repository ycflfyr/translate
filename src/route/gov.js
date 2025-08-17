const express = require('express');
const router  = express.Router();

const govTerms = {
  '南海'                : 'the South China Sea',
  '开绿灯'              : 'facilitate bilateral cooperation',
  '人类命运共同体'      : 'a community with a shared future for mankind',
  '新型大国关系'        : 'a new model of major-country relationship',
  '南南合作'            : 'South-South Cooperation',
  '全球发展倡议'        : 'Global Development Initiative',
  '多边主义'            : 'multilateralism',
  '中国方案'            : 'China-proposed solutions'
};

router.post('/gov-translate', (req, res) => {
  let { text, targetLang = 'en' } = req.body;
  for (const [zh, en] of Object.entries(govTerms)) {
    text = text.replace(new RegExp(zh, 'gi'), en);
  }
  res.json({ translated: text });
});

module.exports = router;
