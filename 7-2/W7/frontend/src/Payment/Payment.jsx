import React, { useState, useEffect } from 'react';
import './Payment.css';
import api from '../utils/axios';

function PaymentForm() {
  // Initial form state
  const initialFormData = {
    paymentNumber: 'PAY-',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'transfer',
    bankAccount: '',
    notes: '',
    status: 'draft'
  };

  // States
  const [formData, setFormData] = useState(initialFormData);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch initial data
  useEffect(() => {
    fetchBankAccounts();
    fetchInvoices();
  }, []);

  // Fetch bank accounts
  const fetchBankAccounts = async () => {
    try {
      const response = await api.get('/api/bank-accounts');
      const additionalAccounts = [
        { id: '1', bankName: 'ออมสิน', accountNumber: '123-456-7890' },
        { id: '2', bankName: 'ไทยพาณิชย์', accountNumber: '987-654-3210' }
      ];
      setBankAccounts([...response.data, ...additionalAccounts]); // รวมข้อมูลจาก API กับข้อมูลตัวอย่าง
    } catch (err) {
      setError('Error fetching bank accounts: ' + err.message);
    }
  };

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/invoices', {
        params: { status: 'pending', search: searchTerm }
      });
      setInvoices(response.data); // อัปเดตรายการใบแจ้งหนี้
    } catch (err) {
      setError('Error fetching invoices: ' + err.message);
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

  // Handle file attachment
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAttachmentFile(file);
  };

  // Handle invoice selection
  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoices(prev => {
      const exists = prev.find(i => i.id === invoice.id);
      if (exists) {
        return prev.filter(i => i.id !== invoice.id);
      }
      return [...prev, invoice];
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const formPayload = new FormData();
      Object.keys(formData).forEach(key => {
        formPayload.append(key, formData[key]);
      });
  
      if (attachmentFile) {
        formPayload.append('attachment', attachmentFile);
      }
  
      formPayload.append('invoices', JSON.stringify(selectedInvoices.map(inv => inv.id)));
  
      const response = await api.post('/api/payments', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      if (response.status === 201) {
        console.log('Payment created successfully');
        fetchInvoices(); // รีเฟรชรายการใบแจ้งหนี้
        setSelectedInvoices([]); // ล้างการเลือกใบแจ้งหนี้
        setFormData(initialFormData); // รีเซ็ตฟอร์ม
      }
    } catch (err) {
      setError('Error creating payment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedInvoices([]);
    setAttachmentFile(null);
    setError(null);
  };

  // Document actions
  const handlePrint = () => {
    window.print();
    setShowDropdown(false);
  };

  const handleShare = async () => {
    try {
      const response = await api.post('/api/payments/share', {
        paymentId: formData.paymentNumber
      });
      console.log('Document shared:', response.data);
    } catch (err) {
      setError('Error sharing document: ' + err.message);
    }
    setShowDropdown(false);
  };

  const handleForward = async () => {
    try {
      const response = await api.post('/api/payments/forward', {
        paymentId: formData.paymentNumber
      });
      console.log('Document forwarded:', response.data);
    } catch (err) {
      setError('Error forwarding document: ' + err.message);
    }
    setShowDropdown(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="payment-form">
      {error && <div className="error-message">{error}</div>}

      <div className="header-section">
        <h2>การจ่ายเงินด้วยวิธีการโอนเงินเข้าบัญชี</h2>
        <div className="print-button-container">
          <button 
            className="print-button"
            onClick={() => setShowDropdown(!showDropdown)}
            title="ตัวเลือกเอกสาร"
          >
            🖨️
          </button>
          {showDropdown && (
            <div className="print-dropdown">
              <button onClick={handlePrint}>
                🖨️ พิมพ์เอกสาร
              </button>
              <button onClick={handleShare}>
                📤 แชร์เอกสาร
              </button>
              <button onClick={handleForward}>
                ↪️ ส่งต่อ
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="paymentNumber">เลขที่การจ่ายเงิน</label>
        <input 
          type="text" 
          id="paymentNumber" 
          value={formData.paymentNumber}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="paymentDate">วันที่จ่ายเงิน</label>
        <input 
          type="date" 
          id="paymentDate"
          value={formData.paymentDate}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="paymentMethod">วิธีการจ่ายเงิน</label>
        <select 
          id="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleInputChange}
        >
          <option value="transfer">โอนเงินเข้าบัญชี</option>
          <option value="check">เช็ค</option>
          <option value="cash">เงินสด</option>
        </select>
      </div>

      {/* แสดงฟิลด์บัญชีธนาคารเฉพาะเมื่อ paymentMethod ไม่ใช่ "cash" */}
{formData.paymentMethod !== 'cash' && (
  <div className="form-row">
    <label htmlFor="bankAccount">บัญชีธนาคารที่ใช้จ่ายเงิน</label>
    <select 
      id="bankAccount"
      value={formData.bankAccount}
      onChange={handleInputChange}
      required
    >
      <option value="">เลือกบัญชีธนาคาร</option>
      {bankAccounts.map(account => (
        <option key={account.id} value={account.id}>
          {account.bankName} - {account.accountNumber}
        </option>
      ))}
    </select>
  </div>
)}

      <div className="invoice-list">
        <h3>รายการใบแจ้งหนี้</h3>
        <input 
          type="text" 
          placeholder="ค้นหาใบแจ้งหนี้"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            fetchInvoices();
          }}
        />

        <div className="invoice-table">
          {invoices.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>เลือก</th>
                  <th>เลขที่</th>
                  <th>วันที่</th>
                  <th>จำนวนเงิน</th>
                  <th>เจ้าหนี้</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedInvoices.some(i => i.id === invoice.id)}
                        onChange={() => handleInvoiceSelect(invoice)}
                      />
                    </td>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.invoiceDate}</td>
                    <td>{invoice.amount}</td>
                    <td>{invoice.vendorName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>ไม่พบรายการใบแจ้งหนี้</p>
          )}
        </div>
      </div>

      <div className="attachment">
        <label htmlFor="attachment">แนบหลักฐานการชำระเงิน</label>
        <input 
          type="file" 
          id="attachment"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>

      <div className="notes">
        <label htmlFor="notes">หมายเหตุ</label>
        <textarea 
          id="notes"
          value={formData.notes}
          onChange={handleInputChange}
        />
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
          disabled={loading || selectedInvoices.length === 0}
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกการจ่ายเงิน'}
        </button>
      </div>
    </div>
  );
}

export default PaymentForm;