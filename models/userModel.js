const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  matricule: {
    type: Number,
    required: [true, 'Please provide the matricule!'],
    unique: [true, 'Matricule Exist'],
  },

  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    unique: false,
  },
})
module.exports = mongoose.model.Users || mongoose.model('Users', UserSchema)
