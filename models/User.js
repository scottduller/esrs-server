const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Create Schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level',
        required: true,
      },
    ],
  },
  { timestamps: true, strict: false },
);

const User = mongoose.model('User', UserSchema);

User.plugin(passportLocalMongoose, { usernameField: 'username' });

module.exports = User;
