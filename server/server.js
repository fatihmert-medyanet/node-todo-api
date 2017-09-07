var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo',{
    text: {
        type: String,
        require:true,
        minlenght: 1,
        trim:true
    },
    completed: {
        type:Boolean,
        default: false
    },
    completedAt: {
        type:Number,
        default: null
    }
});

var newTodo = new Todo({
    text: 'Cook dinner'
});

newTodo.save().then((doc) => {
    console.log('Saved todo',doc);
}, (e) => {
    console.log('Unable to save todo');
});

var otherTodo = new Todo({
    text: 'Feed the cat',
    completed: true,
    completedAt: 123
});

otherTodo.save().then((doc) => {
    console.log(JSON.stringify(doc,undefined,2));
}, (e) => {
    console.log('Unable to save',e);
});