import React, { useState, useEffect } from 'react';
import './Invoice.css';
import api from '../utils/axios';

function InvoiceForm() {
  // Initial states
  const initialFormData = {
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    poRef: '',
    vendor: '',
    status: ''
  };

  const initialItemData = {
    itemDetails: '',
    receivedQuantity: 0,
    invoicedQuantity: 0,
    currentInvoiceQuantity: 0,
    unitPrice: 0,
    totalAmount: 0
  };

  // States
  const [formData, setFormData] = useState(initialFormData);
  const [items, setItems] = useState([initialItemData]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  // Fetch purchase orders
  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/purchase-orders', {
        params: { status: 'approved' } // ดึงเฉพาะใบสั่งซื้อที่มีสถานะ "approved"
      });
      console.log('API Response:', response.data); // ตรวจสอบข้อมูลที่ได้รับจาก API
      setPurchaseOrders(response.data); // ตั้งค่า purchaseOrders ด้วยข้อมูลจาก API
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลใบสั่งซื้อ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle PO selection
  const handlePOSelect = async (poId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/purchase-orders/${poId}/items`);
      setFormData(prev => ({
        ...prev,
        poRef: poId,
        vendor: response.data.vendorName,
        status: response.data.status
      }));
      setItems(response.data.items.map(item => ({
        itemDetails: item.description,
        receivedQuantity: item.receivedQuantity,
        currentInvoiceQuantity: 0,
        unitPrice: item.price,
        totalAmount: 0
      })));
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลใบสั่งซื้อ: ' + err.message);
    } finally {
      setLoading(false);
    }
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

    // Calculate total amount if quantity or price changes
    if (field === 'currentInvoiceQuantity' || field === 'unitPrice') {
      newItems[index].totalAmount = 
        newItems[index].currentInvoiceQuantity * newItems[index].unitPrice;
    }

    setItems(newItems);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Calculate total invoice amount
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.totalAmount, 0);
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const formPayload = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        formPayload.append(key, formData[key]);
      });
  
      // Add items
      formPayload.append('items', JSON.stringify(items));
      
      // Add file if selected
      if (selectedFile) {
        formPayload.append('invoiceFile', selectedFile);
      }
  
      const response = await api.post('/api/invoices', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      if (response.status === 201) {
        // Handle success
        console.log('Invoice created successfully');
        handleReset();
      }
    } catch (err) {
      setError('Error submitting invoice: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData(initialFormData);
    setItems([initialItemData]);
    setSelectedFile(null);
    setError(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="invoice-form">
      {error && <div className="error-message">{error}</div>}

      <h2>การบันทึกตั้งหนี้โดยอ้างอิงใบสั่งซื้อ</h2>
      <p>บันทึกการตั้งหนี้พร้อมตรวจสอบงบประมาณคงเหลือ</p>

      <div className="form-row">
        <label htmlFor="invoiceNumber">เลขที่ใบแจ้งหนี้</label>
        <input 
          type="text" 
          id="invoiceNumber" 
          value={formData.invoiceNumber}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="invoiceDate">วันที่ใบแจ้งหนี้</label>
        <input 
          type="date" 
          id="invoiceDate"
          value={formData.invoiceDate}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="dueDate">วันที่ครบกำหนดชำระ</label>
        <input 
          type="date" 
          id="dueDate"
          value={formData.dueDate}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="invoiceFile">แนบไฟล์ใบแจ้งหนี้</label>
        <input 
          type="file" 
          id="invoiceFile"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>

      <div className="form-row">
      <label htmlFor="poRef">อ้างอิงใบสั่งซื้อ</label>
  <select
    id="poRef"
    value={formData.poRef}
    onChange={(e) => handlePOSelect(e.target.value)}
    required
  >
    <option value="">เลือกใบสั่งซื้อ</option>
    {purchaseOrders.map(po => {
      console.log('Purchase Order:', po); // ตรวจสอบข้อมูลแต่ละรายการ
      return (
        <option key={po.id} value={po.id}>
          {po.po_number || 'ไม่มีหมายเลข'} - {po.vendor_name || 'ไม่มีชื่อผู้ขาย'}
        </option>
      );
    })}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="vendor">ผู้ขาย/ผู้ให้บริการ</label>
        <input 
          type="text" 
          id="vendor"
          value={formData.vendor}
          readOnly 
        />
      </div>

      <div className="form-row">
     <label htmlFor="status">สถานะใบสั่งซื้อ</label>
      <input 
       type="text" 
       id="status"
        value={formData.status}
        readOnly 
      />
      </div>

      <div className="item-list">
        <h3>รายการสินค้า/บริการ</h3>
        {items.map((item, index) => (
  <div key={index} className="item-row">
    <label htmlFor={`itemDetails-${index}`}>รายละเอียด</label>
    <input
      type="text"
      id={`itemDetails-${index}`}
      value={item.itemDetails}
      readOnly
    />
    <label htmlFor={`receivedQuantity-${index}`}>จำนวนที่รับแล้ว</label>
    <input
      type="number"
      id={`receivedQuantity-${index}`}
      value={item.receivedQuantity}
      readOnly
    />
    <label htmlFor={`currentInvoiceQuantity-${index}`}>จำนวนที่ตั้งหนี้ครั้งนี้</label>
    <input
      type="number"
      id={`currentInvoiceQuantity-${index}`}
      value={item.currentInvoiceQuantity}
      onChange={(e) => handleItemChange(index, 'currentInvoiceQuantity', Number(e.target.value))}
      min="0"
      max={item.receivedQuantity}
    />
    <label htmlFor={`unitPrice-${index}`}>ราคาต่อหน่วย</label>
    <input
      type="number"
      id={`unitPrice-${index}`}
      value={item.unitPrice}
      onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
      min="0"
      step="0.01"
    />
    <label htmlFor={`totalAmount-${index}`}>จำนวนเงิน</label>
    <input
      type="text"
      id={`totalAmount-${index}`}
      value={item.totalAmount.toFixed(2)}
      readOnly
    />
  </div>
))}
        <p>ยอดรวมทั้งสิ้น: {calculateTotal().toFixed(2)} บาท</p>
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
          disabled={loading || items.every(item => item.currentInvoiceQuantity === 0)}
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งหนี้'}
        </button>
      </div>
    </div>
  );
}

export default InvoiceForm;