const { readDataFromFile, writeDataToFile } = require('../config/database');

const getBudgetByDepartment = (departmentId) => {
    const data = readDataFromFile();
    return data.budgets ? data.budgets[departmentId] : null;
};

const createBudget = (departmentId, amount) => {
    const data = readDataFromFile();
    if (!data.budgets) data.budgets = {};
    data.budgets[departmentId] = { amount, used: 0 };
    writeDataToFile(data);
};

const updateBudget = (departmentId, amount) => {
    const data = readDataFromFile();
    if (data.budgets && data.budgets[departmentId]) {
        data.budgets[departmentId].amount = amount;
        writeDataToFile(data);
    }
};

module.exports = { getBudgetByDepartment, createBudget, updateBudget };
