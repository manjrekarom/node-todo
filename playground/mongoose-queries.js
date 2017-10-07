const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

let id = "596c9db094db2934c40e60fbd";

if(ObjectId.isValid(id))
    User.findById(id).then((user) => {
        console.log(user);
    }).catch((e) => console.log(e));
else console.log('Some error');