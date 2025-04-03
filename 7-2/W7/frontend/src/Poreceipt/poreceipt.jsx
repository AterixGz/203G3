import React, { useState, useEffect } from 'react';
import './POReceipt.css';
import axios from 'axios';

function POReceiptForm() {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0]);
  const [poNumber, setPoNumber] = useState('');
  const [vendor, setVendor] = useState('');
  const [items, setItems] = useState([
    { id: 1, details: '', orderedQuantity: 0, receivedQuantity: 0, currentReceiveQuantity: 0, unit: '' },
  ]);
  const [purchaseOrders, setPurchaseOrders] = useState([]); // เก็บรายการใบสั่งซื้อ

  // ดึง Receipt Number จาก Backend เมื่อโหลดหน้า
  useEffect(() => {
    const fetchReceiptNumber = async () => {
      try {
        const response = await axios.get('http://localhost:3000/next-receipt-number');
        setReceiptNumber(response.data.receiptNumber);
      } catch (error) {
        console.error('Error fetching Receipt Number:', error);
      }
    };

    const fetchPurchaseOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/purchase-orders');
        setPurchaseOrders(response.data); // เก็บข้อมูลใบสั่งซื้อใน state
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
      }
    };

    fetchReceiptNumber();
    fetchPurchaseOrders();
  }, []);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: items.length + 1, details: '', orderedQuantity: 0, receivedQuantity: 0, currentReceiveQuantity: 0 },
    ]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    const data = {
      receiptNumber,
      poNumber,
      receiptDate,
      items: items.map(({ details, currentReceiveQuantity, unit }) => ({
        details,
        quantity: currentReceiveQuantity || 0,
        unit,
      })),
    };

    try {
      const response = await axios.post('http://localhost:3000/po-receipt', data);
      alert(`PO Receipt created successfully: ID ${response.data.receiptId}`);
    } catch (error) {
      console.error('Error creating PO Receipt:', error.response?.data || error.message);
      alert('Failed to create PO Receipt');
    }
  };

  return (
    <div className="po-receipt-form">
      <h2>การบันทึกรับสินทรัพย์ถาวร (PO Receipt)</h2>
      <p>บันทึกการรับสินทรัพย์ถาวรตามใบสั่งซื้อ</p>

      <div className="form-row">
        <label htmlFor="receiptNumber">เลขที่ใบรับสินทรัพย์</label>
        <input
          type="text"
          id="receiptNumber"
          value={receiptNumber}
          onChange={(e) => setReceiptNumber(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="receiptDate">วันที่รับสินทรัพย์</label>
        <input
          type="date"
          id="receiptDate"
          value={receiptDate}
          onChange={(e) => setReceiptDate(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="poRef">อ้างอิงใบสั่งซื้อ</label>
        <select
          id="poRef"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
        >
          <option value="">-- เลือกใบสั่งซื้อ --</option>
          {purchaseOrders.map((po) => (
            <option key={po.po_number} value={po.po_number}>
              {po.po_number} - {po.vendor_name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="vendor">ผู้ขาย/ผู้ให้บริการ</label>
        <input
          type="text"
          id="vendor"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
        />
      </div>

      {/* ส่วนรายการสินทรัพย์ */}
      <div className="item-list">
        <h3>รายการสินทรัพย์</h3>
        {items.map((item, index) => (
          <div className="item-row" key={item.id}>
            <label>รายละเอียด</label>
            <input
              type="text"
              value={item.details}
              onChange={(e) => handleItemChange(index, 'details', e.target.value)}
            />
            <label>จำนวนตามใบสั่งซื้อ</label>
            <input
              type="number"
              value={item.orderedQuantity}
              onChange={(e) => handleItemChange(index, 'orderedQuantity', parseFloat(e.target.value) || 0)}
            />
            <label>จำนวนที่รับแล้ว</label>
            <input
              type="number"
              value={item.receivedQuantity}
              onChange={(e) => handleItemChange(index, 'receivedQuantity', parseFloat(e.target.value) || 0)}
            />
            <label>จำนวนที่รับครั้งนี้</label>
            <input
              type="number"
              value={item.currentReceiveQuantity}
              onChange={(e) => handleItemChange(index, 'currentReceiveQuantity', parseFloat(e.target.value) || 0)}
            />
            <label>หน่วยนับ</label>
            <select
              value={item.unit}
              onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
            >
              <option value="">-- เลือกหน่วยนับ --</option>
              <option value="piece">ชิ้น</option>
              <option value="unit">หน่วย</option>
              <option value="set">ชุด</option>
            </select>
          </div>
        ))}
        <div className="action-buttons">
          <button type="button" onClick={handleAddItem}>
            เพิ่มรายการ
          </button>
          &nbsp; &nbsp; &nbsp;
          <button
            type="button"
            onClick={() => handleRemoveItem(items.length - 1)}
            disabled={items.length === 0}
          >
            ลบรายการ
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button className="cancel-button">ยกเลิก</button>
        <button className="submit-button" onClick={handleSubmit}>
          บันทึกการรับสินทรัพย์
        </button>
      </div>
    </div>
  );
}

export default POReceiptForm;