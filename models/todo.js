const mongoose = requier('mongoose')

const todoSchema = new mongoose.Schma({
    title: { type: String, require: true},
    description: { type: String, required: true},
    completed: { type: Boolean, required: true}
}, {
    timestamps: true
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo