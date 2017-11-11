const request = require('supertest');
const expect = require('expect');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {ObjectID} = require('mongodb');

let todos = [
    {
        _id: new ObjectID(),
        text: 'First test todo'
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo'
    }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    })
    .then(() => done());
});

describe('POST /todos', ()=>{
    it('should create a new todo', (done) => {
        let text = 'todo text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
        
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        //// Works with or without this thing
        // .expect((res) => {
        //     expect(res.body).toEqual({
        //         "errors": {
        //             "text": {
        //                 "message": "Path `text` is required.",
        //                 "name": "ValidatorError",
        //                 "properties": {
        //                     "type": "required",
        //                     "message": "Path `{PATH}` is required.",
        //                     "path": "text"
        //                 },
        //                 "kind": "required",
        //                 "path": "text",
        //                 "$isValidatorError": true
        //             }
        //         },
        //         "_message": "Todo validation failed",
        //         "message": "Todo validation failed: text: Path `text` is required.",
        //         "name": "ValidationError"
        //     });
        // })
        .end((err, res) => {
            if(err){
                return done(err);
            }
    
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                // expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('GET /todos', ()=>{
    it('should return all todos', (done) => {
        let text = 'todo text';
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', ()=>{
    it('should return a single todo', (done) => {
        // let id = "59d8d4e2e09a6c324459bdfe";
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        let id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return a 404 for non ObjectID', (done) => {
        let id = "asd69d8d4e2e09a6c324459bdfe";
        request(app)
            .get(`/todos/123abc`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', ()=>{
    it('should delete a single todo', (done) => {
        let id = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                   expect(todo).toNotExist();
                   done();
                }).catch((e) => done(e));
            });
    });

    it('should return a 404 if todo not found', (done) => {
        let id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return a 404 for non ObjectID', (done) => {
        request(app)
            .delete(`/todos/123abc`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', ()=>{
    it('should update a single todo for completed true', (done) => {
        let id = todos[0]._id.toHexString();
        let completed = true;
        let text = 'This is test 1 for patch thingy.';
        request(app)
            .patch(`/todos/${id}`)
            .expect(200)
            .send({completed, text})
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
                expect(res.body.todo.completed).toBe(id);
                expect(res.body.todo.text).toBe(text);
                expect(res.body.completedAt).toExist();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(res.body.todo.completed).toBe(todo.completed);
                    expect(res.body.todo.text).toBe(todo.text);
                    expect(res.body.completedAt).toBe(todo.completedAt);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should update a single todo for completed false', (done) => {
        let id = todos[1]._id.toHexString();
        let completed = false;
        let text = 'This is test 2 for patch thingy.';
        request(app)
            .patch(`/todos/${id}`)
            .expect(200)
            .send({completed, text})
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.text).toBe(text);
                expect(res.body.completedAt).toNotExist();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(res.body.todo.completed).toBe(todo.completed);
                    expect(res.body.todo.text).toBe(todo.text);
                    expect(res.body.completedAt).toBe(todo.completedAt);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return a 404 if todo not found', (done) => {
        let id = new ObjectID().toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return a 404 for non ObjectID', (done) => {
        request(app)
            .patch(`/todos/123abc`)
            .expect(404)
            .end(done);
    });
});