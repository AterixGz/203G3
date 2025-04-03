import React, { useState, useEffect } from 'react';
import './ApBalance.css';
import axios from 'axios';

function ApBalance() {
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'after'
  const [apBalanceData, setApBalanceData] = useState([]);
  const [filters, setFilters] = useState({
    vendor: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  // Fetch AP Balance data
  useEffect(() => {
    const fetchApBalance = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/ap-balance', {
          params: filters
        });
        setApBalanceData(response.data);
      } catch (error) {
        console.error('Error fetching AP Balance:', error);
      }
    };

    fetchApBalance();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="ap-balance">
      {/* ...existing code... */}
      <div className="filter-section">
        <div className="filter-row">
          <label htmlFor="vendor">ผู้ขาย/ผู้ให้บริการ</label>
          <input
            id="vendor"
            type="text"
            value={filters.vendor}
            onChange={handleFilterChange}
          />

          <label htmlFor="status">สถานะ</label>
          <select id="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">ทั้งหมด</option>
            <option value="ชำระแล้ว">ชำระแล้ว</option>
            <option value="ยังไม่ชำระ">ยังไม่ชำระ</option>
          </select>

          <label htmlFor="startDate">วันที่เริ่มต้น</label>
          <input
            type="date"
            id="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />

          <label htmlFor="endDate">วันที่สิ้นสุด</label>
          <input
            type="date"
            id="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-actions">
          <button onClick={() => setFilters({ vendor: '', status: '', startDate: '', endDate: '' })}>
            ล้างการค้นหา
          </button>
        </div>
      </div>

      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>เลขที่ใบแจ้งหนี้</th>
              <th>เลขที่ใบสั่งซื้อ</th>
              <th>ผู้ขาย/ผู้ให้บริการ</th>
              <th>วันที่ใบแจ้งหนี้</th>
              <th>วันครบกำหนด</th>
              <th>จำนวนเงิน</th>
              <th>ชำระแล้ว</th>
              <th>สถานะ</th>
              <th>คงเหลือ</th>
            </tr>
          </thead>
          <tbody>
            {apBalanceData.map((row) => (
              <tr key={row.invoice_number}>
                <td>{row.invoice_number}</td>
                <td>{row.po_number}</td>
                <td>{row.vendor}</td>
                <td>{row.invoice_date}</td>
                <td>{row.due_date}</td>
                <td>฿{row.total_amount.toLocaleString()}</td>
                <td>฿{row.paid_amount.toLocaleString()}</td>
                <td>{row.status}</td>
                <td>฿{row.balance.toLocaleString()}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApBalance;