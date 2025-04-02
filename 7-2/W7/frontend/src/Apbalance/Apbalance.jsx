import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApBalance.css';

function ApBalance() {
  const [apData, setApData] = useState([]); // เก็บข้อมูล AP Balance
  const [filteredData, setFilteredData] = useState([]); // เก็บข้อมูลที่กรองแล้ว
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
  const [error, setError] = useState(null); // เก็บข้อความข้อผิดพลาด

  // ตัวกรอง
  const [vendorFilter, setVendorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // ดึงข้อมูลจาก API
    const fetchApBalance = async () => {
      try {
        const response = await axios.get('http://localhost:3000/ap-balance'); // เรียก API
        setApData(response.data); // เก็บข้อมูลใน state
        setFilteredData(response.data); // ตั้งค่าเริ่มต้นข้อมูลที่กรองแล้ว
        setLoading(false); // ปิดสถานะการโหลด
      } catch (err) {
        setError(err.message); // เก็บข้อความข้อผิดพลาด
        setLoading(false);
      }
    };

    fetchApBalance();
  }, []);

  // ฟังก์ชันสำหรับกรองข้อมูล
  const handleFilter = () => {
    let filtered = apData;

    if (vendorFilter) {
      filtered = filtered.filter((row) => row.vendor === vendorFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((row) => row.status === statusFilter);
    }

    if (startDate) {
      filtered = filtered.filter((row) => new Date(row.invoice_date) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter((row) => new Date(row.invoice_date) <= new Date(endDate));
    }

    setFilteredData(filtered);
  };

  // ฟังก์ชันสำหรับล้างตัวกรอง
  const handleClearFilters = () => {
    setVendorFilter('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setFilteredData(apData); // รีเซ็ตข้อมูลที่กรองแล้ว
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <p>เกิดข้อผิดพลาด: {error}</p>;
  }

  return (
    <div className="ap-balance">
      <h2>ยอดคงเหลือเจ้าหนี้ (AP Balance)</h2>
      <p>ดูยอดคงเหลือเจ้าหนี้ทั้งหมด</p>

      <div className="filter-section">
        <div className="filter-row">
          <label htmlFor="vendor">ผู้ขาย/ผู้ให้บริการ</label>
          <select id="vendor" value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)}>
            <option value="">ทั้งหมด</option>
            {[...new Set(apData.map((row) => row.vendor))].map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>

          <label htmlFor="status">สถานะ</label>
          <select id="status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">ทั้งหมด</option>
            <option value="ชำระแล้ว">ชำระแล้ว</option>
            <option value="ยังไม่ชำระ">ยังไม่ชำระ</option>
          </select>

          <label htmlFor="startDate">วันที่เริ่มต้น</label>
          <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

          <label htmlFor="endDate">วันที่สิ้นสุด</label>
          <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div className="filter-actions">
          <button className="clear-button" onClick={handleClearFilters}>
            ล้างการค้นหา
          </button>
          <button className="export-button" onClick={handleFilter}>
            ส่งออกข้อมูล
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
              <th>คงเหลือ</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.invoice_number}>
                <td>{row.invoice_number}</td>
                <td>{row.po_number}</td>
                <td>{row.vendor}</td>
                <td>{new Date(row.invoice_date).toLocaleDateString()}</td>
                <td>{new Date(row.due_date).toLocaleDateString()}</td>
                <td>{row.total_amount.toLocaleString()}</td>
                <td>{row.paid_amount.toLocaleString()}</td>
                <td>{row.balance.toLocaleString()}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="8" style={{ textAlign: 'right' }}>
                ยอดคงเหลือรวม
              </td>
              <td>
                {filteredData
                  .reduce((sum, row) => sum + parseFloat(row.balance || 0), 0)
                  .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default ApBalance;