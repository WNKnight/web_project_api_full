const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name:{
    type: String,
    required : true,
    minLength: 2,
    maxLength: 30
  },
  link:{
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(http|https):\/\/(www\.)?[a-zA-Z0-9._~:/?%#[\]@!$&'()*+,;=-]+$/.test(v);
      },
      message: props => `${props.value} não é um link válido!`
    }
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes:{
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('card', cardSchema);