const purchaseOrderModel = require('../models/purchaseOrder');

const createPurchaseOrder = (req, res) => {
    const { department_id, items } = req.body;
    const order = purchaseOrderModel.createPurchaseOrder(department_id, items);
    res.status(201).json(order);
};

const getPurchaseOrders = (req, res) => {
    const departmentId = req.params.department_id;
    const orders = purchaseOrderModel.getPurchaseOrders(departmentId);
    res.json(orders);
};

module.exports = { createPurchaseOrder, getPurchaseOrders };
