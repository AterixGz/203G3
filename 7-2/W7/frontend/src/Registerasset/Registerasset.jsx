import React from 'react';
import './RegisterAsset.css';

function RegisterAsset() {
  return (
    <div className="register-asset">
      <h2>การขึ้นทะเบียนสินทรัพย์ถาวร</h2>
      <p>ขึ้นทะเบียนสินทรัพย์ถาวรจากข้อมูลการตั้งหนี้</p>

      <div className="form-row">
        <label htmlFor="invoiceNumber">เลขที่ใบแจ้งหนี้</label>
        <input type="text" id="invoiceNumber" />
      </div>

      <div className="form-row">
        <label htmlFor="vendor">ผู้ขาย/ผู้ให้บริการ</label>
        <input type="text" id="vendor" />
      </div>

      <div className="item-list">
        <h3>รายการสินทรัพย์</h3>
        <p>กรุณาเลือกใบแจ้งหนี้เพื่อดูรายการสินทรัพย์</p>

        <div className="item-row">
          <label htmlFor="itemDetails">รายละเอียด</label>
          <input type="text" id="itemDetails" />
          <label htmlFor="quantity">จำนวน</label>
          <input type="number" id="quantity" />
          <label htmlFor="unitPrice">ราคาต่อหน่วย</label>
          <input type="number" id="unitPrice" />
          <label htmlFor="totalAmount">จำนวนเงิน</label>
          <input type="text" id="totalAmount" readOnly />
        </div>
      </div>

      <div className="form-actions">
        <button className="cancel-button">ยกเลิก</button>
        <button className="submit-button">บันทึกการขึ้นทะเบียนสินทรัพย์</button>
      </div>
    </div>
  );
}

export default RegisterAsset;