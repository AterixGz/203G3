import React, { useState, useEffect } from "react";
import "./PurchaseOrder.css";
import api from '../utils/axios';

const PurchaseOrder = () => {
  // ตั้งค่า initialFormData โดยใช้วันที่ปัจจุบัน
  const initialFormData = {
    poNumber: 'PO-', // ให้ผู้ใช้กรอกเอง
    orderDate: new Date().toISOString().split('T')[0], // วันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
    requisitionRef: '',
    vendorName: '',
    status: 'draft'
  };

  // States
  const [formData, setFormData] = useState(initialFormData);
  const [items, setItems] = useState([{ id: 1, name: "", quantity: 0, price: 0}]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requisitions, setRequisitions] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchRequisitions();
  }, []);

  // Fetch available requisitions
// Fetch available requisitions
const fetchRequisitions = async () => {
  try {
    const response = await api.get('/api/requisitions');
    setRequisitions(response.data); // เก็บข้อมูลใบขอซื้อใน state
  } catch (error) {
    setError('Error fetching requisitions: ' + error.message);
    console.error('Error:', error);
  }
};

  // Handle form input changes
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

 // Handle requisition selection
const handleRequisitionSelect = async (requisitionId) => {
  try {
    setLoading(true);
    const response = await api.get(`/api/requisition/${requisitionId}`);
    const requisitionData = response.data;

    // อัปเดตข้อมูลฟอร์มด้วยข้อมูลใบขอซื้อ
    setFormData(prev => ({
      ...prev,
      requisitionRef: requisitionId,
      vendorName: requisitionData.vendor_name
    }));

    // อัปเดตรายการสินค้าในฟอร์ม
    setItems(requisitionData.items.map(item => ({
      id: item.id,
      name: item.description,
      quantity: item.quantity,
      price: item.price
    })));
  } catch (error) {
    setError('Error loading requisition: ' + error.message);
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

  // Handle item changes
  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { 
      id: items.length + 1, 
      name: "", 
      quantity: 0, 
      price: 0 
    }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Calculate total
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const validateForm = () => {
    if (!formData.poNumber || formData.poNumber.trim() === '') {
      alert('กรุณากรอกเลขที่ใบสั่งซื้อ');
      return false;
    }
    if (!formData.orderDate) {
      alert('กรุณาเลือกวันที่');
      return false;
    }
    if (!formData.vendorName || formData.vendorName.trim() === '') {
      alert('กรุณากรอกชื่อผู้จำหน่าย');
      return false;
    }
    if (items.length === 0 || items.some(item => !item.name || item.quantity <= 0 || item.price <= 0)) {
      alert('กรุณากรอกข้อมูลรายการสินค้าให้ครบถ้วน');
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // หยุดการทำงานหากข้อมูลไม่ครบถ้วน
    }
  

    try {
      setLoading(true);
      setError(null);
  
      const payload = {
        ...formData,
        items,
        totalAmount: calculateTotal(),
        submittedAt: new Date().toISOString().replace("T", " ").replace("Z", "") // ใช้ค่าที่แปลงรูปแบบตรงนี้
      };
  
      const response = await api.post('/api/purchase-orders', payload);
  
      if (response.status === 201) {
        console.log('Purchase order created successfully');
        handleReset(); // รีเซ็ตฟอร์มหลังจากบันทึกสำเร็จ
      }
    } catch (error) {
      setError('Error submitting purchase order: ' + error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData(initialFormData);
    setItems([{ id: 1, name: "", quantity: 0, price: 0 }]);
    setError(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="purchase-order-container">
      {error && <div className="error-message">{error}</div>}
      
      <h2>จัดทำใบสั่งซื้อ (Purchase Order)</h2>
      
      <div className="order-info">
        <label>
          เลขที่ใบสั่งซื้อ:
          <input 
            type="text" 
            value={formData.poNumber} 
            onChange={(e) => handleFormChange('poNumber', e.target.value)} 
            placeholder="กรอกเลขที่ใบสั่งซื้อ"
          />
        </label>
        <label>
          วันที่:
          <input 
            type="date" 
            value={formData.orderDate}
            onChange={(e) => handleFormChange('orderDate', e.target.value)}
          />
        </label>
      </div>

      <div className="supplier-info">
      <label>
    อ้างถึงใบขอซื้อ:
    <select 
      value={formData.requisitionRef}
      onChange={(e) => handleRequisitionSelect(e.target.value)}
    >
      <option value="">เลือกใบขอซื้อ</option>
      {requisitions.map(req => (
        <option key={req.id} value={req.id}>
          {req.requisition_number} - {req.vendor_name}
        </option>
      ))}
    </select>
  </label>
        <label>
          ผู้จำหน่าย:
          <input 
            type="text" 
            value={formData.vendorName}
            onChange={(e) => handleFormChange('vendorName', e.target.value)}
            placeholder="ชื่อผู้จำหน่าย" 
          />
        </label>
      </div>

      <h3>รายการสินค้า</h3>
      <table>
        <thead>
          <tr>
            <th>รายการ</th>
            <th>จำนวน</th>
            <th>ราคาต่อหน่วย</th>
            <th>รวม</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleChange(index, "quantity", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                />
              </td>
              <td>{(item.quantity * item.price).toFixed(2)}</td>
              <td>
                <button onClick={() => handleRemoveItem(index)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-item" onClick={handleAddItem}>+ เพิ่มรายการ</button>

      <div className="summary">
        <p>ยอดรวมทั้งสิ้น: {calculateTotal().toFixed(2)} บาท</p>
      </div>

      <div className="actions">
        <button 
          className="cancel" 
          onClick={handleReset}
          disabled={loading}
        >
          ยกเลิก
        </button>
        <button 
          className="save" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกใบสั่งซื้อ'}
        </button>
      </div>
    </div>
  );
};

export default PurchaseOrder;