// import React , { useState } from 'react';
// import axios from 'axios';
// import './Requisition.css';

// function PurchaseRequisitionForm() {
//   return (
//     <div className="purchase-requisition-form">
//       <h2>การจัดทำใบขอซื้อ (Purchase Requisition)</h2>
//       <p>กรอกข้อมูลเพื่อสร้างใบขอซื้อ พร้อมตรวจสอบงบประมาณคงเหลือ</p>

//       <div className="form-row">
//         <label htmlFor="prNumber">เลขที่ใบขอซื้อ</label>
//         <input type="text" id="prNumber" value="PR07677" readOnly />
//       </div>

//       <div className="form-row">
//         <label htmlFor="requestDate">วันที่ขอซื้อ</label>
//         <input type="date" id="requestDate" />
//       </div>

//       <div className="form-row">
//         <label htmlFor="department">แผนก/ฝ่าย</label>
//         <select id="department">
//           <option value="">เลือกแผนก/ฝ่าย</option>
//           {/* เพิ่มตัวเลือกแผนก/ฝ่าย */}
//         </select>
//       </div>

//       <div className="form-row">
//         <label htmlFor="requester">ผู้ขอซื้อ</label>
//         <input type="text" id="requester" />
//       </div>

//       <div className="form-row">
//         <label htmlFor="purpose">วัตถุประสงค์การขอซื้อ</label>
//         <textarea id="purpose" />
//       </div>

//       <div className="item-list">
//         <h3>รายการสินค้า/บริการ</h3>
//         <button className="add-item-button">เพิ่มรายการ</button>

//         <div className="item-row">
//           <label htmlFor="itemDetails">รายละเอียด</label>
//           <input type="text" id="itemDetails" value="รายละเอียดสินค้า/บริการ" />
//           <label htmlFor="quantity">จำนวน</label>
//           <input type="number" id="quantity" value="1" />
//           <label htmlFor="unitPrice">ราคาต่อหน่วย</label>
//           <input type="number" id="unitPrice" value="0" />
//           <label htmlFor="totalAmount">จำนวนเงิน</label>
//           <input type="text" id="totalAmount" value="$0.00" readOnly />
//         </div>

//         <div className="total">
//           <label>รวมทั้งสิ้น</label>
//           <input type="text" value="$0.00" readOnly />
//         </div>
//       </div>

//       <div className="form-actions">
//         <button className="cancel-button">ยกเลิก</button>
//         <button className="submit-button">บันทึกใบขอซื้อ</button>
//       </div>
//     </div>
//   );
// }

// export default PurchaseRequisitionForm;

import React, { useState } from 'react';
import axios from 'axios';
import cors from 'cors';
import './Requisition.css';

function PurchaseRequisitionForm() {
  const [formData, setFormData] = useState({
    prNumber: '',
    requestDate: '',
    department: '',
    requester: '',
    purpose: '',
    items: [
      { details: '', quantity: 1, unitPrice: 0, total: 0 },
    ],
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    // คำนวณ total สำหรับแต่ละรายการ
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }

    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { details: '', quantity: 1, unitPrice: 0, total: 0 }],
    });
  };

  const calculateGrandTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า
    try {
      console.log('Submitting form data:', formData); // ตรวจสอบข้อมูลก่อนส่ง
      const response = await axios.post('http://localhost:3000/requisition', formData);
      alert(`Requisition created successfully: ID ${response.data.requisitionId}`);
    } catch (error) {
      console.error('Error creating requisition:', error.response?.data || error.message); // แสดงข้อผิดพลาด
      alert('Failed to create requisition');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>ใบขอซื้อ</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table, th, td { border: 1px solid black; text-align: center; }
            th, td { padding: 8px; }
            .total { font-weight: bold; text-align: right; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h2>ใบขอซื้อ (Purchase Requisition)</h2>
          <p><strong>เลขที่ใบขอซื้อ:</strong> ${formData.prNumber}</p>
          <p><strong>วันที่ขอซื้อ:</strong> ${formData.requestDate}</p>
          <p><strong>แผนก/ฝ่าย:</strong> ${formData.department}</p>
          <p><strong>ผู้ขอซื้อ:</strong> ${formData.requester}</p>
          <p><strong>วัตถุประสงค์:</strong> ${formData.purpose}</p>
          
          <table>
            <thead>
              <tr>
                <th>รายละเอียด</th>
                <th>จำนวน</th>
                <th>ราคาต่อหน่วย</th>
                <th>จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              ${formData.items.map(item => `
                <tr>
                  <td>${item.details}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unitPrice.toFixed(2)}</td>
                  <td>${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <p class="total"><strong>รวมทั้งสิ้น:</strong> ${calculateGrandTotal().toFixed(2)} บาท</p>
          
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
    <form className="purchase-requisition-form" onSubmit={handleSubmit}>
      <h2>การจัดทำใบขอซื้อ (Purchase Requisition)</h2>
      <p>กรอกข้อมูลเพื่อสร้างใบขอซื้อ พร้อมตรวจสอบงบประมาณคงเหลือ</p>

      <div className="form-row">
        <label htmlFor="prNumber">เลขที่ใบขอซื้อ</label>
        <input type="text"
          id="prNumber"
          value={formData.prNumber}
          onChange={handleInputChange} />
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
        <label htmlFor="department">แผนก/ฝ่าย</label>
        <select
          id="department"
          value={formData.department}
          onChange={handleInputChange}
        >
          <option value=""></option>
          <option value="IT">IT</option>
          <option value="Management">Management</option>
          <option value="Procurement Officer">Procurement Officer</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="requester">ผู้ขอซื้อ</label>
        <input
          type="text"
          id="requester"
          value={formData.requester}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="purpose">วัตถุประสงค์การขอซื้อ</label>
        <textarea
          id="purpose"
          value={formData.purpose}
          onChange={handleInputChange}
        />
      </div>

      <div className="item-list">
        <h3>รายการสินค้า/บริการ</h3>
        {formData.items.map((item, index) => (
          <div className="item-row" key={index}>
            <label>รายละเอียด</label>
            <input
              type="text"
              value={item.details}
              onChange={(e) => handleItemChange(index, 'details', e.target.value)}
            />
            <label>จำนวน</label>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
            />
            <label>ราคาต่อหน่วย</label>
    <input
      type="number"
      value={item.unitPrice}
      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
            />
            <label>จำนวนเงิน</label>
            <input type="text" value={item.total.toFixed(2)} readOnly />
          </div>
        ))}
        <button type="button" onClick={addItem}>
          เพิ่มรายการ
        </button>
      </div>

      <div className="total">
        <label>รวมทั้งสิ้น</label>
        <input type="text" value={calculateGrandTotal().toFixed(2)} readOnly />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          บันทึกใบขอซื้อ
        </button>
      </div>
      <div className="form-actions">
      <button type="button" className="print-button" onClick={handlePrint}>
      พิมพ์ใบขอซื้อ
      </button>
      </div>
    </form>
  );
}

export default PurchaseRequisitionForm;