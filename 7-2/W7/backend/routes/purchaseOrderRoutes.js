const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controllers/purchaseOrderController');

router.post('/', purchaseOrderController.createPurchaseOrder);
router.get('/:department_id', purchaseOrderController.getPurchaseOrders);

module.exports = router;
