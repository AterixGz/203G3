import React, { useState, useEffect } from 'react';
import './POReceipt.css';
import axios from 'axios';

function POReceiptForm() {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split('T')[0]); // ตั้งค่าเริ่มต้นเป็นวันที่ปัจจุบัน
  const [poNumber, setPoNumber] = useState('');
  const [vendor, setVendor] = useState('');
  const [items, setItems] = useState([
    { id: 1, details: '', orderedQuantity: 0, receivedQuantity: 0, currentReceiveQuantity: 0 },
  ]);

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

    fetchReceiptNumber();
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

  const validateForm = () => {
    if (!poNumber.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return false;
    }
    if (!vendor.trim()) {
      alert('กรุณากรอกชื่อผู้ขาย/ผู้ให้บริการ');
      return false;
    }
    if (items.length === 0) {
      alert('ต้องมีรายการสินค้าขั้นต่ำ 1 รายการ');
      return false;
    }
    for (const item of items) {
      if (!item.details.trim()) {
        alert('กรุณากรอกรายละเอียดสินค้าทุกแถว');
        return false;
      }
      if (item.currentReceiveQuantity <= 0) {
        alert('จำนวนที่รับครั้งนี้ต้องมากกว่า 0');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data = {
      receiptNumber,
      poNumber,
      receiptDate,
      items: items.map(({ id, details, currentReceiveQuantity }) => ({
        details,
        quantity: currentReceiveQuantity || 0, // กำหนดค่าเริ่มต้นเป็น 0 หากไม่มีค่า
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

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>ใบรับสินทรัพย์ (PO Receipt)</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2, h3 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table, th, td { border: 1px solid black; text-align: center; }
            th, td { padding: 8px; }
            .total { font-weight: bold; text-align: right; margin-top: 20px; }
            .info { margin-bottom: 20px; }
            .info p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <h2>ใบรับสินทรัพย์ (PO Receipt)</h2>
          <div class="info">
            <p><strong>เลขที่ใบรับสินทรัพย์:</strong> ${receiptNumber}</p>
            <p><strong>วันที่รับ:</strong> ${receiptDate}</p>
            <p><strong>อ้างอิงใบสั่งซื้อ:</strong> ${poNumber}</p>
            <p><strong>ผู้ขาย/ผู้ให้บริการ:</strong> ${vendor}</p>
          </div>
  
          <h3>รายการสินทรัพย์</h3>
          <table>
            <thead>
              <tr>
                <th>รายละเอียด</th>
                <th>จำนวนตามใบสั่งซื้อ</th>
                <th>จำนวนที่รับแล้ว</th>
                <th>จำนวนที่รับครั้งนี้</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.details}</td>
                  <td>${item.orderedQuantity}</td>
                  <td>${item.receivedQuantity}</td>
                  <td>${item.currentReceiveQuantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
  
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  
  
  return (
    <div className="po-receipt-form">
      <h2>การบันทึกรับสินทรัพย์ถาวร (PO Receipt)</h2>
      <p>บันทึกการรับสินทรัพย์ถาวรตามใบสั่งซื้อ</p>

      <div className="form-row">
        <label htmlFor="receiptNumber">เลขที่ใบรับสินทรัพย์</label>
        <input type="text" id="receiptNumber" value={receiptNumber} readOnly />
      </div>

      <div className="form-row">
        <label htmlFor="receiptDate">วันที่รับสินทรัพย์</label>
        <input
          type="date"
          id="receiptDate"
          value={receiptDate}
          readOnly
        />
      </div>

      <div className="form-row">
        <label htmlFor="poRef">อ้างอิงใบสั่งซื้อ</label>
        <input
          type="text"
          id="poRef"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
        />
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
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>
          เพิ่มรายการ
        </button>

          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

        <button type="button" onClick={() => handleRemoveItem(index)}>
              ลบรายการ
            </button>
      </div>

      <div className="form-actions">
        <button className="cancel-button">ยกเลิก</button>
        <button className="submit-button" onClick={handleSubmit}>
          บันทึกการรับสินทรัพย์
        </button>
        <button className="print-button" onClick={handlePrint}>
        🖨 พิมพ์ใบรับสินทรัพย์
        </button>

      </div>
    </div>
  );
}

export default POReceiptForm;