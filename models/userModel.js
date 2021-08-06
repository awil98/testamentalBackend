const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');
const SALT_WORK_FACTOR = 10;

const url = "mongodb+srv://Aaron:Airjwil1998!@cluster0-ngszm.mongodb.net/test?retryWrites=true";

mongoose.connect(url, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

let userSchema = new mongoose.Schema({
  email: String,
  friends: [{type: mongoose.Schema.ObjectId, ref: "userSchema"}],
  username: {
    type: String,
    unique: true,
    require: true,
  },
  password:{
    type: String,
    require: true,
  },
  historyEasy:{
    type: Array,
    require: true
  },
  historyNormal:{
    type: Array,
    require: true
  },
  historyTrivaNormal:{
    type: Array,
    require: true,
  },
  historyMinisterial:{
    type: Array,
    require: true
  },
  highScoreEasy:{
    type: Number,
    require: true,
  },
  highScoreNormal:{
    type: Number,
    require: true,
  },
  highScoreTrivaNormal:{
    type: Number,
    require: true,
  },
  highScoreMinisterial:{
    type: Number,
    require: true,
  },
  totalPointsEasy:{
    type: Number,
    require: true,
  },
  totalPointsNormal:{
    type: Number,
    require: true,
  },
  totalPointsTrivaNormal:{
    type: Number,
    require: true,
  },
  totalPointsMinisterial:{
    type: Number,
    require: true,
  }
});

userSchema.pre('save', function(next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
