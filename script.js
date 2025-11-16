// script.js - Vanilla JS ToDo app

// Select elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const msg = document.getElementById('msg');

let tasks = []; // optional client-side state (not persisted unless you add localStorage)

// Utility: render all tasks from `tasks` array
function renderTasks() {
  taskList.innerHTML = ''; // clear

  if (tasks.length === 0) {
    msg.textContent = 'No tasks yet. Add your first task!';
    return;
  } else {
    msg.textContent = `${tasks.length} task(s)`;
  }

  tasks.forEach((t) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (t.completed) li.classList.add('completed');
    li.dataset.id = t.id;

    li.innerHTML = `
      <div class="task-left">
        <button class="icon-btn toggle-btn" aria-label="Toggle complete" title="Toggle complete">
          <span class="icon">${t.completed ? '✔' : '○'}</span>
        </button>
        <div class="task-text">${escapeHtml(t.text)}</div>
      </div>

      <div class="task-actions">
        <button class="icon-btn remove-btn" aria-label="Remove task" title="Remove task">🗑</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Add task
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    showTempMessage('Please enter a non-empty task.');
    return;
  }

  const task = {
    id: Date.now().toString(),
    text: trimmed,
    completed: false,
  };

  tasks.push(task);
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

// Remove task by id
function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

// Toggle complete status
function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
  renderTasks();
}

// small helper for temporary messages
function showTempMessage(text, ms = 1800) {
  msg.textContent = text;
  setTimeout(() => {
    msg.textContent = tasks.length ? `${tasks.length} task(s)` : 'No tasks yet. Add your first task!';
  }, ms);
}

// simple html escape to avoid injection when showing user input
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

/* Event listeners */

// Add button click
addBtn.addEventListener('click', () => addTask(taskInput.value));

// Press Enter to add
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask(taskInput.value);
  }
});

// Event delegation for toggle and remove actions
taskList.addEventListener('click', (e) => {
  const li = e.target.closest('li.task-item');
  if (!li) return;
  const id = li.dataset.id;

  // If remove button or its children
  if (e.target.closest('.remove-btn')) {
    removeTask(id);
    return;
  }

  // If toggle button or clicking on task-left area -> toggle complete
  if (e.target.closest('.toggle-btn') || e.target.closest('.task-left')) {
    toggleTask(id);
    return;
  }
});

// Initial render
renderTasks();
