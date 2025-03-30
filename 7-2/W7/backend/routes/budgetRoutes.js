const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

router.get('/:department_id', budgetController.getBudget);
router.post('/', budgetController.createBudget);
router.put('/:department_id', budgetController.updateBudget);

module.exports = router;
