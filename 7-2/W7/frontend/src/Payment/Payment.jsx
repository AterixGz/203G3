import React from 'react';
import './Payment.css';

function PaymentForm() {
  return (
    <div className="payment-form">
      <h2>การจ่ายเงินด้วยวิธีการโอนเงินเข้าบัญชี</h2>
      <p>บันทึกการจ่ายเงินให้เจ้าหนี้พร้อมแนบหลักฐานการชำระเงิน</p>

      <div className="form-row">
        <label htmlFor="paymentNumber">เลขที่การจ่ายเงิน</label>
        <input type="text" id="paymentNumber" value="PAY04927" readOnly />
      </div>

      <div className="form-row">
        <label htmlFor="paymentDate">วันที่จ่ายเงิน</label>
        <input type="date" id="paymentDate" />
      </div>

      <div className="form-row">
        <label htmlFor="paymentMethod">วิธีการจ่ายเงิน</label>
        <select id="paymentMethod">
          <option value="transfer">โอนเงินเข้าบัญชี</option>
          {/* เพิ่มตัวเลือกวิธีการจ่ายเงิน */}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="bankAccount">บัญชีธนาคารที่ใช้จ่ายเงิน</label>
        <select id="bankAccount">
          <option value="">เลือกบัญชีธนาคาร</option>
          {/* เพิ่มตัวเลือกบัญชีธนาคาร */}
        </select>
      </div>

      <div className="invoice-list">
        <h3>รายการใบแจ้งหนี้</h3>
        <input type="text" placeholder="ค้นหาใบแจ้งหนี้" />

        <div className="invoice-row">
          <p>กรุณาค้นหาใบแจ้งหนี้ที่ต้องการจ่ายเงิน</p>
        </div>
      </div>

      <div className="attachment">
        <label htmlFor="attachment">แนบหลักฐานการชำระเงิน</label>
        <input type="file" id="attachment" />
      </div>

      <div className="notes">
        <label htmlFor="notes">หมายเหตุ</label>
        <textarea id="notes" />
      </div>

      <div className="form-actions">
        <button className="cancel-button">ยกเลิก</button>
        <button className="submit-button">บันทึกการจ่ายเงิน</button>
      </div>
    </div>
  );
}

export default PaymentForm;