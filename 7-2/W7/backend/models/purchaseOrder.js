const { readDataFromFile, writeDataToFile } = require('../config/database');

const createPurchaseOrder = (departmentId, items) => {
    const data = readDataFromFile();
    const orderId = Date.now(); // ใช้เวลาในปัจจุบันเป็น order ID
    const totalAmount = items.reduce((total, item) => total + item.unit_price * item.quantity, 0);
    
    const order = {
        order_id: orderId,
        department_id: departmentId,
        items: items,
        total_amount: totalAmount,
        status: 'pending'
    };
    
    if (!data.purchaseOrders) data.purchaseOrders = [];
    data.purchaseOrders.push(order);
    writeDataToFile(data);

    return order;
};

const getPurchaseOrders = (departmentId) => {
    const data = readDataFromFile();
    return data.purchaseOrders ? data.purchaseOrders.filter(po => po.department_id === departmentId) : [];
};

module.exports = { createPurchaseOrder, getPurchaseOrders };
