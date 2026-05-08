const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, project } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedTo,
      project
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    let query = {};
    // Members only see their tasks, Admins see all
    if (req.user.role === 'Member') {
      query.assignedTo = req.user.id;
    }
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('project', 'title');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Admins can update any task, Members only assigned ones
    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, updateTaskStatus, deleteTask };
