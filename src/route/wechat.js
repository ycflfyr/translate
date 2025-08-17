const express = require('express');
const axios = require('axios');
const router  = express.Router();

// 微信登录
router.post('/wechat-login', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: '缺少微信code' });

  try {
    const { data } = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid     : process.env.WECHAT_APP_ID,
        secret    : process.env.WECHAT_SECRET,
        js_code   : code,
        grant_type: 'authorization_code'
      }
    });

    if (!data.openid) return res.status(401).json({ error: '微信登录失败' });

    // TODO：根据 openid 创建或更新用户
    const token = 'your_JWT_token'; // 用你自己的 JWT 签发
    res.json({ token, openid: data.openid });
  } catch (err) {
    res.status(500).json({ error: '微信登录异常' });
  }
});

// 统一下单（微信支付）
router.post('/wx-pay', async (req, res) => {
  const { openid, body, out_trade_no, total_fee } = req.body;

  const params = {
    appid           : process.env.WECHAT_APP_ID,
    mch_id          : process.env.WECHAT_MCH_ID,
    nonce_str       : Math.random().toString(36).substr(2, 15),
    body,
    out_trade_no,
    total_fee,      // 分
    spbill_create_ip: req.ip || '127.0.0.1',
    notify_url      : 'https://yourdomain.com/api/wx-notify',
    trade_type      : 'JSAPI',
    openid
  };

  const crypto = require('crypto');
  const qs = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&') + `&key=${process.env.WECHAT_KEY}`;
  params.sign  = crypto.createHash('md5').update(qs, 'utf8').digest('hex').toUpperCase();

  const xml = `<xml>${Object.keys(params).map(k => `<${k}>${params[k]}</${k}>`).join('')}</xml>`;

  try {
    const { data } = await axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', xml, {
      headers: { 'Content-Type': 'text/xml' }
    });
    res.type('text/xml').send(data);
  } catch (err) {
    res.status(500).json({ error: '创建支付订单失败' });
  }
});

module.exports = router;
