import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Payment.css';

function PaymentForm() {
  const [paymentNumber, setPaymentNumber] = useState(''); // เลขที่การจ่ายเงิน
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [bankAccount, setBankAccount] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [notes, setNotes] = useState('');
  const [invoices, setInvoices] = useState([]); // รายการใบแจ้งหนี้จาก SQL
  const [selectedInvoices, setSelectedInvoices] = useState([]); // ใบแจ้งหนี้ที่เลือก
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState(''); // ใบแจ้งหนี้ที่เลือกจาก Dropdown

  // ดึงข้อมูลใบแจ้งหนี้จาก Backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/invoices');
        setInvoices(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    // สร้างเลขที่การจ่ายเงิน
    const generatePaymentNumber = () => {
      const timestamp = Date.now();
      setPaymentNumber(`PAY${timestamp}`);
    };

    fetchInvoices();
    generatePaymentNumber();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png']; // ประเภทไฟล์ที่อนุญาต
      if (allowedTypes.includes(file.type)) {
        setAttachment(file); // บันทึกไฟล์ลงใน state
      } else {
        alert('กรุณาอัปโหลดไฟล์รูปภาพ (JPEG, PNG) เท่านั้น');
        e.target.value = ''; // รีเซ็ต input file
      }
    }
  };

  const handleAddInvoice = () => {
    const selectedInvoice = invoices.find(
      (invoice) => invoice.invoice_number === selectedInvoiceNumber
    );
    if (selectedInvoice) {
      if (!selectedInvoices.some((invoice) => invoice.invoice_number === selectedInvoice.invoice_number)) {
        setSelectedInvoices((prev) => [
          ...prev,
          { ...selectedInvoice, amount: selectedInvoice.balance }, // กำหนดค่า amount เป็น balance
        ]);
      } else {
        alert('ใบแจ้งหนี้นี้ถูกเลือกแล้ว');
      }
    }
  };

  const handleRemoveInvoice = (invoiceNumber) => {
    setSelectedInvoices((prev) => prev.filter((invoice) => invoice.invoice_number !== invoiceNumber));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('paymentNumber', paymentNumber);
    formData.append('paymentDate', paymentDate);
    formData.append('method', paymentMethod);
    formData.append('bankAccount', bankAccount);
    formData.append('notes', notes);
    formData.append('attachment', attachment); // แนบไฟล์
    formData.append('invoices', JSON.stringify(selectedInvoices)); // ส่งรายการใบแจ้งหนี้
  
    try {
      const response = await axios.post('http://localhost:3000/payment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(`Payment recorded successfully: ID ${response.data.paymentId}`);
    } catch (error) {
      console.error('Error recording payment:', error.response?.data || error.message);
      alert('Failed to record payment');
    }
  };

  return (
    <div className="payment-form">
      <h2>การจ่ายเงินด้วยวิธีการโอนเงินเข้าบัญชี</h2>
      <p>บันทึกการจ่ายเงินให้เจ้าหนี้พร้อมแนบหลักฐานการชำระเงิน</p>

      <div className="form-row">
        <label htmlFor="paymentNumber">เลขที่การจ่ายเงิน</label>
        <input type="text" id="paymentNumber" value={paymentNumber} readOnly />
      </div>

      <div className="form-row">
        <label htmlFor="paymentDate">วันที่จ่ายเงิน</label>
        <input
          type="date"
          id="paymentDate"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="paymentMethod">วิธีการจ่ายเงิน</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="transfer">โอนเงินเข้าบัญชี</option>
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="bankAccount">บัญชีธนาคารที่ใช้จ่ายเงิน</label>
        <select
          id="bankAccount"
          value={bankAccount}
          onChange={(e) => setBankAccount(e.target.value)}
        >
          <option value="">เลือกบัญชีธนาคาร</option>
          <option value="bank1">ธนาคาร A</option>
          <option value="bank2">ธนาคาร B</option>
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="invoiceSelect">กรุณาเลือกรายการใบแจ้งหนี้</label>
        <select
          id="invoiceSelect"
          value={selectedInvoiceNumber}
          onChange={(e) => setSelectedInvoiceNumber(e.target.value)}
        >
          <option value="">เลือกใบแจ้งหนี้</option>
          {invoices.map((invoice) => (
            <option key={invoice.invoice_number} value={invoice.invoice_number}>
              {invoice.invoice_number} - {invoice.vendor} - {invoice.balance.toLocaleString()}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleAddInvoice}>
          เพิ่ม
        </button>
      </div>

      <div className="selected-invoices">
        <h3>ใบแจ้งหนี้ที่เลือก</h3>
        {selectedInvoices.map((invoice) => (
          <div className="selected-invoice-row" key={invoice.invoice_number}>
            <span>{invoice.invoice_number}</span>
            &nbsp; &nbsp;
            <span>{invoice.vendor}</span>
            &nbsp; &nbsp;
            <span>{invoice.balance.toLocaleString()}</span>
            &nbsp; &nbsp;
            <button type="button" onClick={() => handleRemoveInvoice(invoice.invoice_number)}>
              ลบ
            </button>
          </div>
        ))}
      </div>

      <div className="attachment">
        <label htmlFor="attachment">แนบหลักฐานการชำระเงิน</label>
        <input type="file" id="attachment" onChange={handleFileChange} />
      </div>

      <div className="notes">
        <label htmlFor="notes">หมายเหตุ</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button className="cancel-button">ยกเลิก</button>
        <button className="submit-button" onClick={handleSubmit}>
          บันทึกการจ่ายเงิน
        </button>
      </div>
    </div>
  );
}

export default PaymentForm;