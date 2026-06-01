const API_URL = '/tasks';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const statsEl = document.getElementById('stats');

async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Ошибка загрузки задач:', error);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  // Показываем пустое состояние если задач нет
  if (tasks.length === 0) {
    emptyState.classList.add('visible');
    statsEl.textContent = '';
    return;
  }

  emptyState.classList.remove('visible');

  // Подсчёт статистики
  const doneCount = tasks.filter(t => t.completed).length;
  statsEl.textContent = `Выполнено: ${doneCount} из ${tasks.length}`;

  // Создаём элемент для каждой задачи
  tasks.forEach(task => {
    const li = createTaskElement(task);
    taskList.appendChild(li);
  });
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  // Чекбокс
  const checkbox = document.createElement('div');
  checkbox.className = 'task-checkbox';
  checkbox.textContent = task.completed ? '✓' : '';
  checkbox.title = task.completed ? 'Снять отметку' : 'Отметить выполненной';
  checkbox.addEventListener('click', () => toggleTask(task.id, !task.completed));

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.title = 'Удалить задачу';
  deleteBtn.textContent = '✕';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(checkbox);
  li.appendChild(text);
  li.appendChild(deleteBtn);

  return li;
}

async function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    taskInput.focus();
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (response.ok) {
      taskInput.value = '';
      await loadTasks();
    }
  } catch (error) {
    console.error('Ошибка добавления задачи:', error);
  }
}

// === Переключение статуса задачи ===
async function toggleTask(id, completed) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });

    if (response.ok) {
      await loadTasks();
    }
  } catch (error) {
    console.error('Ошибка изменения задачи:', error);
  }
}

// === Удаление задачи ===
async function deleteTask(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await loadTasks();
    }
  } catch (error) {
    console.error('Ошибка удаления задачи:', error);
  }
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

loadTasks();
