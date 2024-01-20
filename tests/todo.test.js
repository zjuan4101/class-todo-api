const mongoose = require('mongoose')
const app = require('../app')
const { MongoMemoryServer } = require('mongodb-memory-server')
const request = require('supertest')
const server = app.listen('8080', () => console.log('Lets test'))
const Todo = require('../models/todo')
let mongoServer

beforeAll(async() => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async() => {
    await mongoose.connection.close()
    mongoServer.stop()
    server.close()
})



describe('Testing Todo Endpoints For A RESTFUL JSON API', () => {
    test('It should display a list of todos', async () => {
        const todo = new Todo({ title: 'test todo', description: 'test', completed: true })
        await todo.save()

        const response = await request(app).get('/todos')

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()

        for(let i = 0; i < response.body.length; i++){
            expect(response.body[i]).toHaveProperty('title')
            expect(response.body[i]).toHaveProperty('description')
            expect(response.body[i]).toHaveProperty('completed')
            expect(response.body[i]).toHaveProperty('createdAt')
        }
    })

    test('It should create a new todo', async () => {
        const response = await request(app).post('/todos').send({
            title: "my todo",
            description: "things i need to do",
            completed: false
        })
        
        expect(response.body.title).toEqual('my todo')
        expect(response.body.description).toEqual('things i need to do')
        expect(response.body.completed).toBeFalsy()
    })
    test('Given a valid body it should update a todo and return it', async () => {
        const todo = new Todo({ title: 'test todo', description: 'test', completed: true })
        await todo.save()

        const response = await request(app).put(`/todos/${todo._id}`).send({
            description: 'This is sparta'
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.description).toEqual('This is sparta')
        
    })
    test('It should delete a pre-existing todo given a valid todo id', async () => {
        const todo = new Todo({ title: 'test todo', description: 'test', completed: true })
        await todo.save()

        const response = await request(app).delete(`/todos/${todo._id}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.msg).toEqual(`The todo with the Id of ${todo._id}  was deleted from the MongoDB database, no further action necessary`)
        
    })
    test('It should show a pre-existing todo given an id', async () => {
        const todo = new Todo({ title: 'test todo', description: 'test', completed: true })
        await todo.save()

        const response = await request(app).get(`/todos/${todo._id}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.title).toEqual('test todo')
        expect(response.body.description).toEqual('test')
        expect(response.body.completed).toBeTruthy()

})

})