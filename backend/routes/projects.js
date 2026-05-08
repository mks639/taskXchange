const express = require('express');
const { createProject, getProjects } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .post(protect, admin, createProject)
  .get(protect, getProjects);

module.exports = router;
