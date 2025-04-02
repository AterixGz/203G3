import React, { useState, useEffect } from 'react';
import './Requisition.css';
import api from '../utils/axios';

function PurchaseRequisitionForm() {
  const initialFormData = {
    prNumber: 'PR07677',
    creator: '',
    requestDate: '',
    vendorName: '',
    vendorContact: '',
    description: '',
    status: 'draft',
    paymentTerms: 'cash',
    refPR: ''
  };

  const initialItemData = {
    description: '',
    unit: 'piece',
    requiredDate: '',
    quantity: 1,
    price: 0,
    amount: 0
  };

  // State declarations
  const [formData, setFormData] = useState(initialFormData);
  const [items, setItems] = useState([initialItemData]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchRequisitionData();
  }, []);

  // Fetch requisition data
  const fetchRequisitionData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/requisitions');
      if (response.data) {
        setFormData({
          ...initialFormData,
          ...response.data
        });
        setItems(response.data.items || [initialItemData]);
        calculateTotal(response.data.items || [initialItemData]);
      }
    } catch (error) {
      setError('Error fetching data: ' + error.message);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setTotalAmount(total);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // Recalculate amount if quantity or price changes
    if (field === 'quantity' || field === 'price') {
      newItems[index].amount = newItems[index].quantity * newItems[index].price;
    }

    setItems(newItems);
    calculateTotal(newItems);
  };

  // Add new item
  const handleAddItem = () => {
    setItems([...items, { ...initialItemData }]);
  };

  // Remove item
  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateTotal(newItems);
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...formData,
        items,
        totalAmount,
        submittedAt: new Date().toISOString()
      };

      const response = await api.post('/api/requisitions', payload);
      
      if (response.status === 201) {
        // Handle success
        console.log('Requisition created successfully');
        // Reset form or redirect
      }
    } catch (error) {
      setError('Error submitting form: ' + error.message);
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData(initialFormData);
    setItems([initialItemData]);
    setTotalAmount(0);
    setError(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handleViewHistory = (type) => {
    switch(type) {
      case 'purchase':
        console.log('View purchase history');
        break;
      case 'receipt':
        console.log('View receipt history');
        break;
      case 'invoice':
        console.log('View invoice history');
        break;
      case 'payment':
        console.log('View payment history');
        break;
      case 'balance':
        console.log('View AP balance history');
        break;
      default:
        break;
    }
    setShowMenu(false);
  };

  return (
    <div className="purchase-requisition-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="header-section">
        <h2>การจัดทำใบขอซื้อ (Purchase Requisition)</h2>
        <div className="header-buttons">
          <button 
            className="menu-button"
            onClick={() => setShowMenu(!showMenu)}
            title="เมนู"
          >
            ...
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <button onClick={() => handleViewHistory('purchase')}>
                📋 ประวัติการสั่งซื้อ
              </button>
              <button onClick={() => handleViewHistory('receipt')}>
                📦 ประวัติรับสินค้า
              </button>
              <button onClick={() => handleViewHistory('invoice')}>
                📄 ประวัติใบแจ้งหนี้
              </button>
              <button onClick={() => handleViewHistory('balance')}>
                💵 ประวัติยอดคงเหลือเจ้าหนี้
              </button>
              <button onClick={() => handleViewHistory('payment')}>
                💰 ประวัติการจ่ายเงิน
              </button>
            </div>
          )}
        </div>
      </div>
      <p>กรอกข้อมูลเพื่อสร้างใบขอซื้อ พร้อมตรวจสอบงบประมาณคงเหลือ</p>

      <div className="form-row">
        <label htmlFor="prNumber">เลขที่ใบขอซื้อ</label>
        <input 
          type="text" 
          id="prNumber" 
          value={formData.prNumber} 
          readOnly 
        />
      </div>

      <div className="form-row">
        <label htmlFor="creator">ผู้จัดทำ</label>
        <input 
          type="text" 
          id="creator" 
          value={formData.creator}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="requestDate">วันที่ขอซื้อ</label>
        <input 
          type="date" 
          id="requestDate" 
          value={formData.requestDate}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="vendorName">ชื่อผู้ขาย</label>
        <input 
          type="text" 
          id="vendorName" 
          placeholder="ระบุชื่อผู้ขาย" 
          value={formData.vendorName}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="vendorContact">ชื่อผู้ติดต่อของผู้ขาย</label>
        <input 
          type="text" 
          id="vendorContact" 
          placeholder="ระบุชื่อผู้ติดต่อ" 
          value={formData.vendorContact}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="description">คำอธิบายหัวเรื่อง</label>
        <textarea 
          id="description" 
          placeholder="รายละเอียดการขอซื้อ" 
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="status">สถานะ</label>
        <select 
          id="status"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="draft">แบบร่าง</option>
          <option value="pending">รออนุมัติ</option>
          <option value="approved">อนุมัติแล้ว</option>
          <option value="rejected">ไม่อนุมัติ</option>
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="paymentTerms">เงื่อนไขการชำระเงิน</label>
        <select 
          id="paymentTerms"
          value={formData.paymentTerms}
          onChange={handleInputChange}
        >
          <option value="cash">เงินสด</option>
          <option value="credit30">เครดิต 30 วัน</option>
          <option value="credit60">เครดิต 60 วัน</option>
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="refPR">เลขที่อ้างอิงใบขอซื้อ</label>
        <input 
          type="text" 
          id="refPR" 
          placeholder="ระบุเลขที่อ้างอิง" 
          value={formData.refPR}
          onChange={handleInputChange}
        />
      </div>

      <div className="item-list">
        <h3>รายการสินค้า/บริการ</h3>
        <button className="add-item-button" onClick={handleAddItem}>เพิ่มรายการ</button>

        {items.map((item, index) => (
          <div className="item-details" key={index}>
            <div className="row">
              <label>คำอธิบายรายการ</label>
              <input 
                type="text" 
                placeholder="รายละเอียดสินค้า/บริการ" 
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              />
              
              <label>หน่วยนับ</label>
              <select 
                value={item.unit}
                onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
              >
                <option value="piece">ชิ้น</option>
                <option value="unit">หน่วย</option>
                <option value="set">ชุด</option>
              </select>

              <label>วันที่ต้องการ</label>
              <input 
                type="date" 
                value={item.requiredDate}
                onChange={(e) => handleItemChange(index, 'requiredDate', e.target.value)}
              />
            </div>
            <div className="row">
              <label>ปริมาณ</label>
              <input 
                type="number" 
                min="1" 
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              />

              <label>ราคาต่อหน่วย</label>
              <input 
                type="number" 
                min="0" 
                step="0.01" 
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              />

              <label>จำนวนเงิน</label>
              <input 
                type="number" 
                readOnly 
                value={item.amount}
              />
            </div>
            <button className="remove-item-button" onClick={() => handleRemoveItem(index)}>ลบรายการ</button>
          </div>
        ))}
      </div>

      <div className="total">
        <label>จำนวนเงินรวม</label>
        <input type="text" value={`฿${totalAmount.toFixed(2)}`} readOnly />
      </div>

      <div className="form-actions">
        <button 
          className="cancel-button" 
          onClick={handleReset}
          disabled={loading}
        >
          ยกเลิก
        </button>
        <button 
          className="submit-button" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกใบขอซื้อ'}
        </button>
      </div>
    </div>
  );
}

export default PurchaseRequisitionForm;