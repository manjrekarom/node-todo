const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose.js');  

const port = process.env.PORT || 3000;

if(process.env.PORT){
    mongoose.connect('mongodb://manjrekarom:MOjocool29@ds113505.mlab.com:13505/notes-todo');
}
else{
    mongoose.connect('mongodb://localhost:27017/TodoApp');
    
}

let {Todo} = require('./models/todo.js');
let {User} = require('./models/user.js');

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
    let todo = new Todo({
        text: req.body.text,
    });

    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });

    // console.log(req.body);
});

app.get('/todos', (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    },(e)=>{
        res.status(400).send(e);
    });
   // console.log(req.body);
});

app.get('/todos/:id', (req, res)=>{
    let id = req.params.id;
    // console.log(id);
    if(!ObjectID.isValid(id)) {
        // console.log('Error');
        return res.status(404).send();
    }
    else {
        Todo.findById(id).then((todo) => {
            if(!todo){
                return res.status(404).send();
            }
            res.send({todo});
        }).catch((e) => {
            return res.status(400).send();
        });
    }
   // console.log(req.body);
});


app.listen(port, ()=> {
    console.log(`Listening on port ${port}`);
});

module.exports = {
    app
};