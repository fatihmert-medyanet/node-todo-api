const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '59b2542c9701b419404f5074';

Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos',todos);
});

Todo.findOne({
    _id: id
}).then((todos) => {
    console.log('Todos',todos);
});
