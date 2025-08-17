// ./src/routes/term.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { id: 1, term: '龙', description: '象征吉祥、权力和尊贵，是中华民族的文化图腾' },
    { id: 2, term: '知识分子', description: '指具有较高文化水平和专业知识的群体' }
  ]);
});

module.exports = router;
