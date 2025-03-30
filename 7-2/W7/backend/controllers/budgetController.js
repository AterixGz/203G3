const budgetModel = require('../models/budget');

const getBudget = (req, res) => {
    const departmentId = req.params.department_id;
    const budget = budgetModel.getBudgetByDepartment(departmentId);
    if (budget) {
        res.json(budget);
    } else {
        res.status(404).json({ message: 'Budget not found' });
    }
};

const createBudget = (req, res) => {
    const { department_id, amount } = req.body;
    budgetModel.createBudget(department_id, amount);
    res.status(201).json({ message: 'Budget created successfully' });
};

const updateBudget = (req, res) => {
    const { department_id, amount } = req.body;
    budgetModel.updateBudget(department_id, amount);
    res.json({ message: 'Budget updated successfully' });
};

module.exports = { getBudget, createBudget, updateBudget };
