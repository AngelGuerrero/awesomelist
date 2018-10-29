var express = require('express');
var router = express.Router();

import todolist from '../data/list.json';
import _ from 'lodash';

let todolistArray = todolist;

// api/v1/todolist/all
router.get('/all', (req, res) => {
    res.status(200).json(todolistArray);
});

// api/v1/todolist/show/:id
router.get('/show/:id', (req, res) => {
    const task = _.find(todolistArray, {"id": req.params.id});

    if (task) {
        res.status(200).json(task);
    } else {
        res.send(404, { error: `No existe la tarea ${req.params.id}`});
    }
});

// api/v1/todolist/new
router.post('/new', (req, res) => {
    if (req.body) {
        let _id = 1;

        if (!_.isEmpty(todolistArray)) {
            _id = parseInt(_.last(todolistArray).id) + 1;
        }

        let newTask = req.body;
        newTask.id = _id.toString();
        newTask.created_at = (new Date()).toJSON();
        newTask.updated_at = (new Date()).toJSON();
        todolistArray.push(newTask);
        res.status(200).json(newTask);

    } else {
        res.status(500).json("Request body is empty");
    }
});

// api/v1/todolist/edit/:id
router.post('/edit/:id', (req, res) => {
    if (req.body) {
        var task = _.find(todolistArray, { "id": req.params.id });

        if (task) {
            if (req.body.name) task.name = req.body.name;
            if (req.body.highlight) task.highlight = req.body.highlight;
            if (req.body.startDate) task.startDate = req.body.startDate;
            if (req.body.finalDate) task.finalDate = req.body.finalDate;
            if (req.body.done) task.done = req.body.done;
            task.updated_at = (new Date()).toJSON();

            todolistArray.forEach(t => {
                if (t.id === task.id) {
                    t = task;
                    return true;
                }
            });
            res.status(200).json("ok");

        } else {
            res.status(404).json(`No existe la tarea con el id: ${req.body.id}`);
        }
    } else {
        res.status(500).json("Request body is empty");
    }
});

// api/v1/todolist/delete/:id
router.delete('/delete/:id', (req, res) => {
    const task = _.remove(todolistArray, {"id": req.params.id });
    
    if (!_.isEmpty(task)) {
        console.log(task);
        
        res.status(200).json(`ok`);
    } else {
        res.status(500).json(`Error trying delete item ${req.params.id}`);
    }

});


module.exports = router;