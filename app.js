// 待辦清單資料的本地儲存鍵名稱
const STORAGE_KEY = 'todoListAppData';

// 取得頁面上的 DOM 元素
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const remainingCount = document.getElementById('remainingCount');

// 讀取 localStorage 中的待辦資料
function loadTodos() {
  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY);

    // 若沒有資料則回傳空陣列
    if (!storedTodos) {
      return [];
    }

    const parsedTodos = JSON.parse(storedTodos);

    // 確保資料是陣列，避免異常資料破壞頁面
    return Array.isArray(parsedTodos) ? parsedTodos : [];
  } catch (error) {
    console.error('讀取待辦資料失敗:', error);
    return [];
  }
}

// 儲存待辦資料到 localStorage
function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 計算未完成項目數量
function getRemainingCount(todos) {
  return todos.filter((todo) => !todo.completed).length;
}

// 更新底部的未完成項目數字
function updateRemainingCount(todos) {
  remainingCount.textContent = String(getRemainingCount(todos));
}

// 切換空狀態顯示
function updateEmptyState(todos) {
  if (todos.length === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
  }
}

// 建立一筆待辦的 HTML 元素
function createTodoElement(todo) {
  const item = document.createElement('li');
  item.className = `todo-item${todo.completed ? ' completed' : ''}`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('aria-label', `完成待辦: ${todo.text}`);

  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked;

    const todos = loadTodos();
    const targetIndex = todos.findIndex((existingTodo) => existingTodo.id === todo.id);

    if (targetIndex !== -1) {
      todos[targetIndex].completed = todo.completed;
      saveTodos(todos);
    }

    renderTodos();
  });

  const text = document.createElement('span');
  text.className = 'todo-text';
  text.textContent = todo.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '刪除';
  deleteBtn.setAttribute('aria-label', `刪除待辦: ${todo.text}`);

  deleteBtn.addEventListener('click', () => {
    let todos = loadTodos();
    todos = todos.filter((existingTodo) => existingTodo.id !== todo.id);
    saveTodos(todos);
    renderTodos();
  });

  item.appendChild(checkbox);
  item.appendChild(text);
  item.appendChild(deleteBtn);

  return item;
}

// 將所有待辦渲染到畫面上
function renderTodos() {
  const todos = loadTodos();

  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const item = createTodoElement(todo);
    todoList.appendChild(item);
  });

  updateRemainingCount(todos);
  updateEmptyState(todos);
}

// 新增待辦事項
function addTodo(event) {
  event.preventDefault();

  const text = todoInput.value.trim();

  // 若輸入為空白則不新增
  if (!text) {
    todoInput.focus();
    return;
  }

  const newTodo = {
    id: Date.now() + Math.random(),
    text,
    completed: false,
  };

  const todos = loadTodos();
  todos.push(newTodo);
  saveTodos(todos);

  todoInput.value = '';
  todoInput.focus();
  renderTodos();
}

// 註冊表單提交事件
if (todoForm) {
  todoForm.addEventListener('submit', addTodo);
}

// 頁面啟動時先載入資料並渲染
renderTodos();
