// routes/userRoutes.js
const express = require('express');
const { getAllUsers, getUserById, createUser, deleteUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// REST API Endpoints
router.get('/', getAllUsers);       // Get all users
router.get('/:id', getUserById);    // Get user by ID
router.post('/', createUser);       // Create a new user
router.post('/login', loginUser);   // Login a user
router.delete('/:id', deleteUser);  // Delete user by ID

module.exports = router;
