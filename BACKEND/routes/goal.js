const express = require('express');
const { addGoal, getGoals, updateGoal, deleteGoal } = require('../controllers/goalcontroller');


const router = express.Router();

// Route to add a new goal
router.post('/goals', addGoal);

// Route to get all goals
router.get('/goals', getGoals);

// Route to update a specific goal
router.patch('/goals', updateGoal);

// Route to delete a specific goal
router.delete('/goals/:goalId', deleteGoal);


module.exports = router;
