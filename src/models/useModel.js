const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/.+\@.+\..+/, '请输入有效的邮箱']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^1[3-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} 不是有效的手机号!`
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('User', UserSchema);
