const {MongoClient, ObjectID} = require('mongodb');

// let obj = new ObjectID();
// console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
    if(err){
        console.log('Unable to conenct to mongoDB server');
    }
    else{
        console.log('Connected to MongoDB server');
        // db.collection('Todos').deleteMany({text: 'Something to do'})
        //     .then((result)=>{
        //         console.log(result.result);
        //         db.close();
        //     },(err)=>{
        //         console.log('Error');
        //     });
        db.collection('Users').deleteMany({name: 'Omkar'})
        .then((result)=>{
            console.log(result);
            db.close();
        },(err)=>{
            console.log('Error');
        });
    }
});