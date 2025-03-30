const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:user_id', userController.getUserPermissions);
router.post('/', userController.createUser);
router.put('/', userController.updateUserPermissions);

module.exports = router;
