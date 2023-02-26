// Elemek kiválasztása
const form = document.getElementById('todoform');
const todoInput = document.getElementById('newtodo');
const todosListEl = document.getElementById('todos-list');
const notificationEl = document.querySelector('.notification');
const dateElement = document.getElementById('date');
const clear = document.querySelector('.clear');



// Variánsok
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

// törlés local storage
clear.addEventListener("click", function(){
  localStorage.clear();
  location.reload();
});

// Dátum 
const options = {year : "numeric", weekday : "long", month:"short", day:"numeric"};
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("hu-HU", options);


// render
renderTodos();

// submit gomb
form.addEventListener('submit', function (event) {
  event.preventDefault();

  saveTodo();
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
});

// Mentés TODO
function saveTodo() {
  const todoValue = todoInput.value;

  // todo üres - ellenőrzés
  const isEmpty = todoValue === '';

  // duplikáció ellenőrzése
  const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());

  if (isEmpty) {
    showNotification("A tennivaló mező üres!");
  } else if (isDuplicate) {
    showNotification('A tennivaló már létezik!');
  } else {
    if (EditTodoId >= 0) {
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === EditTodoId ? todoValue : todo.value,
      }));
      EditTodoId = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: 'green',
      }); 
    }

    todoInput.value = '';
  }
}

// 
function renderTodos() {
  if (todos.length === 0) {
    todosListEl.innerHTML = '<center>Nincs tennivaló </center>'; //center nem valid
    return;
  }

  // 
  todosListEl.innerHTML = '';

  // 
  todos.forEach((todo, index) => {
    todosListEl.innerHTML += `
    <div class="todo" id=${index}>
      <i 
        class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
        style="color : ${todo.color}"
        data-action="check"
      ></i>
      <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
      <i class="bi bi-pencil-square" data-action="edit"></i>
      <i class="bi bi-trash" data-action="delete"></i>
    </div>
    `;
  });
}

// Kattintás eseményfigyelőre
todosListEl.addEventListener('click', (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== 'todo') return;

  // t o d o id
  const todo = parentElement;
  const todoId = Number(todo.id);

  // 
  const action = target.dataset.action;

  action === 'check' && checkTodo(todoId);
  action === 'edit' && editTodo(todoId);
  action === 'delete' && deleteTodo(todoId);
});

// Ellenőrzés
function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));

  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Szerkeszztés
function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoId = todoId;
}

// Törlés
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoId = -1;

  // re-render
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}

// ÉRTESÍTÉS MUTATÁSA
function showNotification(msg) {
  // üzenet csere
  notificationEl.innerHTML = msg;

  // értesítés enter
  notificationEl.classList.add('notif-enter');

  // értesítés kilépés
  setTimeout(() => {
    notificationEl.classList.remove('notif-enter');
  }, 2000);
}