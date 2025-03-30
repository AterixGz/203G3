const userModel = require('../models/user');

const getUserPermissions = (req, res) => {
    const userId = req.params.user_id;
    const permissions = userModel.getUserPermissions(userId);
    if (permissions) {
        res.json(permissions);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const createUser = (req, res) => {
    const { user_id, permissions } = req.body;
    userModel.createUser(user_id, permissions);
    res.status(201).json({ message: 'User created successfully' });
};

const updateUserPermissions = (req, res) => {
    const { user_id, permissions } = req.body;
    userModel.updateUserPermissions(user_id, permissions);
    res.json({ message: 'User permissions updated successfully' });
};

module.exports = { getUserPermissions, createUser, updateUserPermissions };
