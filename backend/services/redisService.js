const redis = require('redis');
const client = redis.createClient();

// Add task to Redis
exports.addTask = (task, callback) => {
  client.lpush('tasks', JSON.stringify(task), callback);
};

// Get all tasks from Redis
exports.getTasks = (callback) => {
  client.lrange('tasks', 0, -1, (err, tasks) => {
    if (err) return callback(err);
    const parsedTasks = tasks.map(task => JSON.parse(task));
    callback(null, parsedTasks);
  });
};

// Get Redis task count
exports.getTaskCount = (callback) => {
  client.llen('tasks', callback);
};

// Flush tasks from Redis
exports.flushTasks = () => {
  client.del('tasks');
};
