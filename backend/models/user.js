const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30
  },
  about:{
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30
  },
  avatar:{
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(http|https):\/\/(www\.)?[a-zA-Z0-9._~:/?%#[\]@!$&'()*+,;=-]+$/.test(v);
      },
      message: props => `${props.value} não é um link válido para o avatar!`
    }
  },
});


module.exports = mongoose.model('user', userSchema);