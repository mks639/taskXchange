const express = require('express');
const { createTask, getTasks, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .post(protect, admin, createTask)
  .get(protect, getTasks);

router.route('/:id')
  .put(protect, updateTaskStatus)
  .delete(protect, admin, deleteTask);

module.exports = router;
