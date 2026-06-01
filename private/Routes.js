const express = require('express');
const router  = express.Router();
const db = require('./Db');

router.get('/', (req, res) => {
  const tasks = db.readTasks();
  res.json(tasks);
});

router.post('/', (req, res) => {
  const { text, zone, createdAt } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Текст задачи не может быть пустым' });
  }

  const tasks = db.readTasks();
  const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

  const newTask = {
    id: newId,
    text: text.trim(),
    completed: false,
    zone: zone || 'personal',
    createdAt: createdAt || new Date().toISOString()
  };

  tasks.push(newTask);
  db.saveTasks(tasks);

  res.status(201).json(newTask);
});

router.put('/:id', (req, res) => {
  const taskId    = parseInt(req.params.id);
  const { completed } = req.body;

  const tasks = db.readTasks();
  const task  = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  task.completed = completed;
  db.saveTasks(tasks);

  res.json(task);
});

router.delete('/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const tasks  = db.readTasks();
  const index  = tasks.findIndex(t => t.id === taskId);

  if (index === -1) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  tasks.splice(index, 1);
  db.saveTasks(tasks);

  res.json({ success: true });
});

module.exports = router;
