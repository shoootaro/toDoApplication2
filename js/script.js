const todoList = []
let tabButton, sortMenu, todoMain, inputForm
let displayTarget = "inbox"
let sortIndex = "created-desc"

function createTodoHtmlString(todo) {
  let htmlString = ""
  const editType = todo.isEdit ? "editFixed" : "edit"
  const editButtonLabel = todo.isEdit ? "編集完了" : "編集"
  const doneType = todo.isDone ? "inbox" : "done"
  const doneButtonLabel = todo.isDone ? "未完了" : "完了"
  let todoTextCell = ""
  let priorityCell = ""
  if (todo.isEdit) {
    todoTextCell =
      '<td class="cell-text"><input class="input-edit" type="text" value=' +
      todo.text +
      " /></td>"
    priorityCell =
      '<td class="cell-priority"><input class="input-priority" type="number" value=' +
      todo.priority +
      " /></td>"
  } else {
    todoTextCell = '<td class="cell-text">' + todo.text + "</td>"
    priorityCell = '<td class="cell-priority">' + todo.priority + "</td>"
  }
  htmlString += '<tr id="' + todo.id + '">'
  htmlString +=
    '<td class="cell-edit-button"><button data-type="' +
    editType + 
    '">' + 
    editButtonLabel + 
    "</button></td>"
  htmlString += todoTextCell
  htmlString += '<td class="cell-created-at">' + todo.createdAt + "</td>"
  htmlString += priorityCell
  htmlString += '<td class="cell-done">'
  htmlString += '<button data-type="' + doneType + '">'
  htmlString += doneButtonLabel
  htmlString += "</button></td>"
  htmlString += "</td>"
  htmlString += '<td class="cell-delete">'
  htmlString += '<button data-type="delete">'
  htmlString += '削除'
  htmlString += "</button></td>"
  htmlString += "</tr>"
  return htmlString
}

function updateTodoState(todo, type) {
  todo.isDone = type === "done"
  updateTodoList()
}

function sortTodos(a, b) {
  switch (sortIndex) {
    case "created-desc":
      return Date.parse(b.createdAt) - Date.parse(a.createdAt)
    case "created-asc":
      return Date.parse(a.createdAt) - Date.parse(b.createdAt)
    case "priority-desc":
      return b.priority - a.priority
    case "priority-asc":
      return a.priority - b.priority
    default:
      return todoList
  }
}

function editTodo(todo, type){
  todo.isEdit = type === "edit"
  updateTodoList()
}

function deleteTodo(todo) {
  const index = todoList.findIndex((t) => t.id === todo.id)
  todoList.splice(index, 1)
}

function updateTodoList() {
  let htmlStrings = ""
  todoList
    .filter(todo => todo.isDone !== (displayTarget === "inbox"))
    .sort(sortTodos)
    .forEach(todo => {
      htmlStrings += createTodoHtmlString(todo)
      todoMain.innerHTML = htmlStrings
    })
  todoMain.innerHTML = htmlStrings
  todoList
   .filter(todo => todo.isDone !== (displayTarget === "inbox"))
   .forEach(todo => {
    const todoEl = document.getElementById(todo.id)
      if (todoEl) {
      todoEl.querySelectorAll("button").forEach(btn => {
        const type = btn.dataset.type
        btn.addEventListener("click", event => {
            if (type.indexOf("edit") >= 0) {
              editTodo(todo, type)
            } else if (type.indexOf("delete") >= 0){
              deleteTodo(todo)
              updateTodoList(todo, type)
            } else {
              updateTodoState(todo, type)
          }
        })
      })
        if (todo.isEdit) {
        todoEl.querySelector(".input-edit").addEventListener("input", event => {
          todo.text = event.currentTarget.value
        })
        todoEl
          .querySelector(".input-priority")
          .addEventListener("input", event => {
            todo.priority = parseInt(event.currentTarget.value, 10)
          })
      }
    }
  })
}

function addTodo(todoObj) {
  todoObj.id = "todo-" + (todoList.length + 1)
  todoObj.createdAt = new Date().toLocaleString()
  todoObj.priority = 3
  todoObj.isDone = false
  todoObj.isEdit = false
  todoList.unshift(todoObj)
  updateTodoList()
  clearInputForm()
}

function handleSubmit(event) {
  event.preventDefault()
  const todoObj = {
    text: inputForm["input-text"].value
  }
  addTodo(todoObj)
}

function handleTabClick(event) {
  const me = event.currentTarget
  displayTarget = me.dataset.target
  updateTodoList()
}

function handleSort(e) {
  sortIndex = e.currentTarget.value
  updateTodoList()
}

function registerDOM() {
  tabButton = document.querySelector("#tab").querySelectorAll("button")
  sortMenu = document.querySelector("#sort-menu")
  todoMain = document.querySelector("#todo-main")
  inputForm = document.querySelector("#input-form")
}

function bindEvents() {
  inputForm.addEventListener("submit", event => handleSubmit(event))
  tabButton.forEach(tab => {
    tab.addEventListener("click", event => handleTabClick(event))
  })
  sortMenu.addEventListener("change", event => handleSort(event))
}

function initialize() {
  registerDOM()
  bindEvents()
  updateTodoList()
}

document.addEventListener("DOMContentLoaded", initialize.bind(this))