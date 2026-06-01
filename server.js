const express    = require('express');
const path       = require('path');
const taskRoutes = require('./private/routes');

const app  = express();
const PORT = 3000;

app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));

app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});