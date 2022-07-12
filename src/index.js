const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "Mensagem do erro" });
  }
  request.user = user;
  return next();

  // Complete aqui
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const verifyUserExists = users.some((user) => user.username === username);

  if (verifyUserExists) {
    return response.status(400).json({ error: "Mensagem do erro" });
  }

  if (name && username) {
    const user = {
      name,
      username,
      id: uuidv4(),
      todos: [],
    };
    users.push(user);
    return response.status(201).json(user);
  } else {
    if (!name) {
      return response.status(400).json({ message: "name not found" });
    } else {
      return response.status(400).json({ message: "username not found" });
    }
  }

  // Complete aqui
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(201).json(user.todos);

  // Complete aqui
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  user.todos.push(todo);
  return response.status(201).json(todo);

  // Complete aqui
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todoEdit = user.todos.find((todo) => todo.id === id);

  if (!todoEdit) {
    return response.status(404).json({ error: "Mensagem do erro" });
  }

  todoEdit.title = title;
  todoEdit.deadline = new Date(deadline);

  user.todos.filter((todo) => (todo.id === id ? (todo = todoEdit) : todo));

  return response.status(201).json(todoEdit);

  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoEdit = user.todos.find((todo) => todo.id === id);

  if (!todoEdit) {
    return response.status(404).json({ error: "Mensagem do erro" });
  }

  todoEdit.done = !todoEdit.done;
  user.todos.filter((todo) => (todo.id === id ? (todo = todoEdit) : todo));

  return response.status(201).json(todoEdit);

  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoEdit = user.todos.find((todo) => todo.id === id);

  if (!todoEdit) {
    return response.status(404).json({ error: "Mensagem do erro" });
  }
  user.todos.splice(todoEdit, 1);

  return response.status(204).send();

  // Complete aqui
});

module.exports = app;
