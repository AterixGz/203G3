import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ApBalanceAfter.css';

function ApBalanceAfterPayment() {
  const [apBalanceData, setApBalanceData] = useState([]); // เก็บข้อมูลจาก API
  const [filteredData, setFilteredData] = useState([]); // เก็บข้อมูลที่กรองแล้ว
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [error, setError] = useState(null); // เก็บข้อผิดพลาด

  const [vendorFilter, setVendorFilter] = useState(''); // ตัวกรองผู้ขาย
  const [statusFilter, setStatusFilter] = useState(''); // ตัวกรองสถานะ
  const [startDate, setStartDate] = useState(''); // วันที่เริ่มต้น
  const [endDate, setEndDate] = useState(''); // วันที่สิ้นสุด

  // ดึงข้อมูลจาก API เมื่อ Component ถูกโหลด
  useEffect(() => {
    const fetchApBalanceData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/ap-balance'); // เรียก API
        setApBalanceData(response.data); // เก็บข้อมูลใน state
        setFilteredData(response.data); // ตั้งค่าข้อมูลที่กรองแล้ว
        setLoading(false); // ปิดสถานะการโหลด
      } catch (err) {
        console.error('Error fetching AP Balance data:', err);
        setError(err.message);
        setLoading(false); // ปิดสถานะการโหลด
      }
    };

    fetchApBalanceData();
  }, []);

  // ฟังก์ชันสำหรับกรองข้อมูล
  const handleFilter = () => {
    let filtered = apBalanceData;

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
    setFilteredData(apBalanceData); // รีเซ็ตข้อมูลที่กรองแล้ว
  };

  // ฟังก์ชันสำหรับส่งออกข้อมูล
  const handleExport = () => {
    const csvContent = [
      ['เลขที่ใบแจ้งหนี้', 'เลขที่ใบสั่งซื้อ', 'ผู้ขาย/ผู้ให้บริการ', 'วันที่ใบแจ้งหนี้', 'วันครบกำหนด', 'จำนวนเงิน', 'ชำระแล้ว', 'คงเหลือ', 'สถานะ'],
      ...filteredData.map((row) => [
        row.invoice_number,
        row.po_number || '-',
        row.vendor,
        new Date(row.invoice_date).toLocaleDateString(),
        new Date(row.due_date).toLocaleDateString(),
        row.total_amount,
        row.paid_amount,
        row.balance,
        row.status,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ap_balance.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <p>เกิดข้อผิดพลาด: {error}</p>;
  }

  return (
    <div className="ap-balance-after-payment">
      <h2>ยอดคงเหลือเจ้าหนี้หลังการจ่ายเงิน</h2>
      <p>ดูยอดคงเหลือเจ้าหนี้หลังจากการจ่ายเงิน</p>

      <div className="filter-section">
        <div className="filter-row">
          <label htmlFor="vendor">ผู้ขาย/ผู้ให้บริการ</label>
          <select id="vendor" value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)}>
            <option value="">ทั้งหมด</option>
            {[...new Set(apBalanceData.map((row) => row.vendor))].map((vendor) => (
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
          <button className="export-button" onClick={handleExport}>
            ส่งออกข้อมูล
          </button>
          <button className="filter-button" onClick={handleFilter}>
            กรองข้อมูล
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
                <td>{row.po_number || '-'}</td>
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
              <td colSpan="7" style={{ textAlign: 'right' }}>ยอดคงเหลือรวม</td>
              <td colSpan="2">
                {filteredData
                  .reduce((total, row) => total + row.balance, 0)
                  .toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default ApBalanceAfterPayment;