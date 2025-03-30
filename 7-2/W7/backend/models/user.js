const { readDataFromFile, writeDataToFile } = require('../config/database');

const getUserPermissions = (userId) => {
    const data = readDataFromFile();
    return data.users ? data.users[userId] : null;
};

const createUser = (userId, permissions) => {
    const data = readDataFromFile();
    if (!data.users) data.users = {};
    data.users[userId] = { permissions };
    writeDataToFile(data);
};

const updateUserPermissions = (userId, permissions) => {
    const data = readDataFromFile();
    if (data.users && data.users[userId]) {
        data.users[userId].permissions = permissions;
        writeDataToFile(data);
    }
};

module.exports = { getUserPermissions, createUser, updateUserPermissions };
