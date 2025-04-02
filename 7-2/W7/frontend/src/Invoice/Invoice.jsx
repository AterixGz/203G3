import React, { useState } from 'react';
import './Invoice.css';
import axios from 'axios';

function InvoiceForm() {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [poRef, setPoRef] = useState('');
  const [vendor, setVendor] = useState('');
  const [items, setItems] = useState([
    { id: 1, details: '', receivedQuantity: 0, invoicedQuantity: 0, currentInvoiceQuantity: 0, unitPrice: 0, totalAmount: 0 },
  ]);
  const [attachment, setAttachment] = useState(null);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === 'currentInvoiceQuantity' || field === 'unitPrice') {
      const currentInvoiceQuantity = parseFloat(updatedItems[index].currentInvoiceQuantity) || 0;
      const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].totalAmount = currentInvoiceQuantity * unitPrice;
    }

    setItems(updatedItems);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // ประเภทไฟล์ที่อนุญาต
      if (allowedTypes.includes(file.type)) {
        setAttachment(file); // บันทึกไฟล์ลงใน state
      } else {
        alert('กรุณาอัปโหลดไฟล์รูปภาพ (JPEG, PNG) หรือ PDF เท่านั้น');
        e.target.value = ''; // รีเซ็ต input file
      }
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('invoiceNumber', invoiceNumber);
    formData.append('invoiceDate', invoiceDate);
    formData.append('dueDate', dueDate);
    formData.append('poRef', poRef);
    formData.append('vendor', vendor);
    formData.append('attachment', attachment); // แนบไฟล์
    formData.append(
      'items',
      JSON.stringify(
        items.map(({ details, currentInvoiceQuantity, unitPrice }) => ({
          details,
          quantity: currentInvoiceQuantity || 0,
          unitPrice,
        }))
      )
    );
  
    try {
      const response = await axios.post('http://localhost:3000/invoice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(`Invoice created successfully: ID ${response.data.invoiceId}`);
    } catch (error) {
      console.error('Error creating invoice:', error.response?.data || error.message);
      alert('Failed to create invoice');
    }
  };

  return (
    <div className="invoice-form">
      <h2>การบันทึกตั้งหนี้โดยอ้างอิงใบสั่งซื้อ</h2>
      <p>บันทึกการตั้งหนี้พร้อมตรวจสอบงบประมาณคงเหลือ</p>

      <div className="form-row">
        <label htmlFor="invoiceNumber">เลขที่ใบแจ้งหนี้</label>
        <input type="text" id="invoiceNumber" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
      </div>

      <div className="form-row">
        <label htmlFor="invoiceDate">วันที่ใบแจ้งหนี้</label>
        <input type="date" id="invoiceDate" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
      </div>

      <div className="form-row">
        <label htmlFor="dueDate">วันที่ครบกำหนดชำระ</label>
        <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>

      <div className="form-row">
        <label htmlFor="poRef">อ้างอิงใบสั่งซื้อ</label>
        <input type="text" id="poRef" value={poRef} onChange={(e) => setPoRef(e.target.value)} />
      </div>

      <div className="form-row">
        <label htmlFor="vendor">ผู้ขาย/ผู้ให้บริการ</label>
        <input type="text" id="vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} />
      </div>

      <div className="form-row">
        <label htmlFor="attachment">แนบไฟล์ใบแจ้งหนี้</label>
        <input type="file" id="attachment" onChange={handleFileChange} />
      </div>

      <div className="item-list">
        <h3>รายการสินค้า/บริการ</h3>
        {items.map((item, index) => (
          <div className="item-row" key={item.id}>
            <label>รายละเอียด</label>
            <input
              type="text"
              value={item.details}
              onChange={(e) => handleItemChange(index, 'details', e.target.value)}
            />
            <label>จำนวนที่รับแล้ว</label>
            <input
              type="number"
              value={item.receivedQuantity}
              onChange={(e) => handleItemChange(index, 'receivedQuantity', parseFloat(e.target.value) || 0)}
            />
            <label>จำนวนที่ตั้งหนี้แล้ว</label>
            <input
              type="number"
              value={item.invoicedQuantity}
              onChange={(e) => handleItemChange(index, 'invoicedQuantity', parseFloat(e.target.value) || 0)}
            />
            <label>จำนวนที่ตั้งหนี้ครั้งนี้</label>
            <input
              type="number"
              value={item.currentInvoiceQuantity}
              onChange={(e) => handleItemChange(index, 'currentInvoiceQuantity', parseFloat(e.target.value) || 0)}
            />
            <label>ราคาต่อหน่วย</label>
            <input
              type="number"
              value={item.unitPrice}
              onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
            />
            <label>จำนวนเงิน</label>
            <input type="text" value={item.totalAmount.toFixed(2)} readOnly />
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button className="cancel-button">ยกเลิก</button>
        <button className="submit-button" onClick={handleSubmit}>
          บันทึกการตั้งหนี้
        </button>
      </div>
    </div>
  );
}

export default InvoiceForm;