const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email.'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.statics.findByToken = function(token) {
    let User = this;
    console.log(token);
    let decoded;

    try {
        decoded = jwt.verify(token, '123abc');
        // console.log(decoded);
    } catch (e) {
        return Promise.reject();
    }
    // console.log(decoded._id);
    return User.findOne({
        '_id': decoded.id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
    // .then((doc) => console.log(doc));
    
    // .then((doc) => Promise.resolve(doc));
};

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({'id': user._id.toHexString(), access}, '123abc').toString();
    user.tokens.push({token, access});
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.toJSON = function() {
    let user = this;
    return _.pick(user, ['_id', 'email']);
};


let User = mongoose.model('User', UserSchema);

module.exports = {
    User
};