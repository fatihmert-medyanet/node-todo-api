const MongoClient = require("mongodb").MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
    if(err){
        return console.log("Unable to connect mongodb server !");
    }
    console.log("Connected to mongodb server.");

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed:false
    // },(err,result) => {
    //     if(err){
    //         return console.log("Unable to insert todo",err);
    //     }

    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });

    db.collection('Users').insertOne({
        name: 'Fatih Mert',
        age:24,
        location: 'Turkey'
    },(err,result) => {
        if(err){
            return console.log("Unable to insert user",err);
        }

        console.log(JSON.stringify(result.ops,undefined,2));
    });


    db.close();
});