const redisService = require('../services/redisService');
const Task = require('../models/taskModel');

// Fetch tasks from Redis and MongoDB
exports.fetchAllTasks = async (req, res) => {
  redisService.getTasks(async (err, redisTasks) => {
    if (err) throw err;
    const mongoTasks = await Task.find({});
    const allTasks = [...redisTasks, ...mongoTasks];
    res.json(allTasks);
  });
};

// Add task to Redis and move tasks to MongoDB if Redis exceeds 50 tasks
exports.addTask = async (task) => {
  redisService.addTask(task, async (err) => {
    if (err) throw err;

    // Emit the task back to the WebSocket client after adding it to Redis
    socket.emit('taskAdded', task);
    
    redisService.getTaskCount(async (err, count) => {
      if (err) throw err;

      if (count > 50) {
        redisService.getTasks(async (err, tasks) => {
          if (err) throw err;
          await Task.insertMany(tasks.map(task => ({ task: task.task, completed: false })));
          redisService.flushTasks();
        });
      }
    });
  });
};


