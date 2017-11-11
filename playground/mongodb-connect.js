const {MongoClient, ObjectID} = require('mongodb');

// let obj = new ObjectID();
// console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
    if(err){
        console.log('Unable to conenct to mongoDB server');
    }
    else{
        console.log('Connected to MongoDB server');
    }
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result)=>{
    //     if(err){
    //         return console.log('Unable to create.');
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });
    // db.collection('Users').insertOne({
    //     name: 'Omkar',
    //     age: 21,
    //     location: 'Mumbai'
    // }, (err, result)=>{
    //     if(err){
    //         return console.log('Unable to create.');
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // });
    
    // db.collection('Users').find({
    //     name: 'Omkar'
    // }).toArray().then((docs)=>{
    //     console.log(JSON.stringify(docs, undefined, 2));
    // },(err)=>{
    //     if(err){
    //         console.log('Unable to do that');
    //     }
    // });

    db.collection('Users').find().count().then((result)=>{
        console.log(result);
        db.close();
    });
});