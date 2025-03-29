import React, { useState } from 'react';
import './POReceipt.css';

function POReceiptForm() {
  return (
    <div className="po-receipt-form">
      <h2>การบันทึกรับสินทรัพย์ถาวร (PO Receipt)</h2>
      <p>บันทึกการรับสินทรัพย์ถาวรตามใบสั่งซื้อ</p>

      <div className="form-row">
        <label htmlFor="receiptNumber">เลขที่ใบรับสินทรัพย์</label>
        <input type="text" id="receiptNumber" value="REC02118" readOnly />
      </div>

      <div className="form-row">
        <label htmlFor="receiptDate">วันที่รับสินทรัพย์</label>
        <input type="date" id="receiptDate" />
      </div>

      <div className="form-row">
        <label htmlFor="poRef">อ้างอิงใบสั่งซื้อ</label>
        <input type="text" id="poRef" />
      </div>

      <div className="form-row">
        <label htmlFor="vendor">ผู้ขาย/ผู้ให้บริการ</label>
        <input type="text" id="vendor" />
      </div>

      <div className="item-list">
        <h3>รายการสินทรัพย์</h3>
        <p>กรุณาเลือกใบสั่งซื้อเพื่อดูรายการสินทรัพย์</p>

        <div className="item-row">
          <label htmlFor="itemDetails">รายละเอียด</label>
          <input type="text" id="itemDetails" />
          <label htmlFor="orderedQuantity">จำนวนตามใบสั่งซื้อ</label>
          <input type="number" id="orderedQuantity" />
          <label htmlFor="receivedQuantity">จำนวนที่รับแล้ว</label>
          <input type="number" id="receivedQuantity" />
          <label htmlFor="currentReceiveQuantity">จำนวนที่รับครั้งนี้</label>
          <input type="number" id="currentReceiveQuantity" />
        </div>

        <p>จำนวนรายการที่เลือก: 0 รายการ</p>
      </div>

      <div className="form-actions">
        <button className="cancel-button">ยกเลิก</button>
        <button className="submit-button">บันทึกการรับสินทรัพย์</button>
      </div>
    </div>
  );
}

export default POReceiptForm;