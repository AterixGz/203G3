const express = require('express');
const app = express();
const budgetRoutes = require('./routes/budgetRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use('/api/budget', budgetRoutes);
app.use('/api/purchaseOrder', purchaseOrderRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
