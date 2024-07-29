const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// model
const TodoTask = require("./models/TodoTask");


dotenv.config();

// to access the public folder and CSS
app.use("/static", express.static("public"));


// Urlencoded will allow us to extract the data from the form by adding her to the body property of the request.
app.use(express.urlencoded({ extended: true }));

// connection to DB
mongoose.connect(process.env.DB_CONNECT).then(() => {
    console.log("Connected to DB!");
    app.listen(3000, () => console.log("Server Up and running..."));
});

// View engine configuration
app.set("view engine", "ejs");


// GET METHOD : READ
// getting todos
async function getTodos() {
    const Todos = await TodoTask.find({});
    return Todos
}
app.get("/", (req, res) => {
    // rendering todos
    getTodos().then(function (tasks) {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});


// POST METHOD : CREATE
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        // we will be redirected to home/index page
        res.redirect("/");
    }
});


// UPDATE
app.route("/edit/:id").get((req, res) => {
    const id = req.params.id; // get the ID
    getTodos().then(function (tasks) {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
}).post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, res.redirect("/")).catch(function (err) {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});


// DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndDelete(id, res.redirect("/")).catch(function (err) {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});
