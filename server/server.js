const _ = require('lodash');
const express = require('express');
const bodyparser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyparser.json());

app.post('/todos',(req,res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.post('/todos/writebig',(req,res) => {
    var todos = [];
    try{
        for(var i = 0;i <800000;i++){
            var todo = new Todo({
                text: 'Yapılacak İşlem '+ i
            });
            todos.push(todo);
            console.log(todo);
        }
        Todo.collection.insert(todos,function(){
            console.log('saved completed...');
        })
        res.status(200).send();
    }catch(e){
        res.status(400).send();
    }
    
});

app.get('/todos',(req,res) => {
    //var stream = Todo.find().stream();
    
   
    // Todo.find().then((data) => {
    //     res.send(data);
    //     return next();
    //   }).catch((err) => console.log(err));
    
    Todo.find().then((todos) => {
        var strjson = JSON.stringify(todos);
        res.status(200).send(strjson);
        console.log(strjson);
        
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id',(req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});

    }).catch((e) => {
        res.status(400).send();
    })
});

app.delete('/todos/:id',(req,res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send(todo);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getDate();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id,{$set: body},{new:true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send(e);
    })

});


// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
  
    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
  });


// get my user information
app.get('/users/me',authenticate,(req,res) => {
    res.send(req.user);
})

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
  
    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send();
    });
});

app.delete('/users/me/token',authenticate,(req,res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    },() => {
        res.status(400).send();
    });
})

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};