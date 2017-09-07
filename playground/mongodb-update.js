const MongoClient = require("mongodb").MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
    if(err){
        return console.log("Unable to connect mongodb server !");
    }
    console.log("Connected to mongodb server.");
    
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('59b1506eb61f6e3bd4879c14')
    },{
        $set: {
            completed: true
        }
    },{
        returnOriginal:false
    }).then((result) => {
        console.log(result);
    });

    db.close();
});