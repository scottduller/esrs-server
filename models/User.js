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

UserSchema.plugin(passportLocalMongoose, { usernameField: 'username' });

const User = mongoose.model('User', UserSchema);

module.exports = User;
