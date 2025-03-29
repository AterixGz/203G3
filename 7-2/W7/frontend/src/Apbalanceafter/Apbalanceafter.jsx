import React from 'react';
import './ApBalanceAfter.css';

function ApBalanceAfterPayment() {
  return (
    <div className="ap-balance-after-payment">
      <h2>ยอดคงเหลือเจ้าหนี้หลังการจ่ายเงิน</h2>
      <p>ดูยอดคงเหลือเจ้าหนี้หลังจากการจ่ายเงิน</p>

      <div className="filter-section">
        <div className="filter-row">
          <label htmlFor="vendor">ผู้ขาย/ผู้ให้บริการ</label>
          <select id="vendor">
            <option value="">ทั้งหมด</option>
            {/* เพิ่มตัวเลือกผู้ขาย/ผู้ให้บริการ */}
          </select>

          <label htmlFor="status">สถานะ</label>
          <select id="status">
            <option value="">ทั้งหมด</option>
            {/* เพิ่มตัวเลือกสถานะ */}
          </select>

          <label htmlFor="startDate">วันที่เริ่มต้น</label>
          <input type="date" id="startDate" />

          <label htmlFor="endDate">วันที่สิ้นสุด</label>
          <input type="date" id="endDate" />
        </div>

        <div className="filter-actions">
          <button className="clear-button">ล้างการค้นหา</button>
          <button className="export-button">ส่งออกข้อมูล</button>
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
              <th>วันที่ชำระ</th>
              <th>วิธีการชำระ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>INV00001</td>
              <td>P000001</td>
              <td>บริษัท เอ บี ซี จำกัด</td>
              <td>15/5/2566</td>
              <td>15/6/2566</td>
              <td>$100,000.00</td>
              <td>$100,000.00</td>
              <td>$0.00</td>
              <td>ชำระแล้ว</td>
              <td>1/6/2566</td>
              <td>โอนเงินเข้าบัญชี</td>
            </tr>
            <tr>
              <td>INV00002</td>
              <td>P000002</td>
              <td>บริษัท เอ็กซ์ วาย แซด จำกัด</td>
              <td>20/5/2566</td>
              <td>20/6/2566</td>
              <td>$15,000.00</td>
              <td>$15,000.00</td>
              <td>$0.00</td>
              <td>ชำระแล้ว</td>
              <td>5/6/2566</td>
              <td>โอนเงินเข้าบัญชี</td>
            </tr>
            <tr>
              <td>INV00003</td>
              <td>P000003</td>
              <td>ห้างหุ้นส่วนจำกัด 123</td>
              <td>10/4/2566</td>
              <td>10/5/2566</td>
              <td>$50,000.00</td>
              <td>$50,000.00</td>
              <td>$0.00</td>
              <td>ชำระแล้ว</td>
              <td>5/5/2566</td>
              <td>โอนเงินเข้าบัญชี</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="10" style={{ textAlign: 'right' }}>
                ยอดคงเหลือรวม
              </td>
              <td>$0.00</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default ApBalanceAfterPayment;