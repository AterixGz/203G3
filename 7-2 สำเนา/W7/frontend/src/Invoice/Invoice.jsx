import React from 'react';
import './Invoice.css';

function InvoiceForm() {
  return (
    <div className="invoice-form">
      <h2>การบันทึกตั้งหนี้โดยอ้างอิงใบสั่งซื้อ</h2>
      <p>บันทึกการตั้งหนี้พร้อมตรวจสอบงบประมาณคงเหลือ</p>

      <div className="form-row">
        <label htmlFor="invoiceNumber">เลขที่ใบแจ้งหนี้</label>
        <input type="text" id="invoiceNumber" />
      </div>

      <div className="form-row">
        <label htmlFor="invoiceDate">วันที่ใบแจ้งหนี้</label>
        <input type="date" id="invoiceDate" />
      </div>

      <div className="form-row">
        <label htmlFor="dueDate">วันที่ครบกำหนดชำระ</label>
        <input type="date" id="dueDate" />
      </div>

      <div className="form-row">
        <label htmlFor="invoiceFile">แนบไฟล์ใบแจ้งหนี้</label>
        <input type="file" id="invoiceFile" />
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
        <h3>รายการสินค้า/บริการ</h3>
        <p>กรุณาเลือกใบสั่งซื้อเพื่อดูรายการสินค้า/บริการ</p>

        <div className="item-row">
          <label htmlFor="itemDetails">รายละเอียด</label>
          <input type="text" id="itemDetails" />
          <label htmlFor="receivedQuantity">จำนวนที่รับแล้ว</label>
          <input type="number" id="receivedQuantity" />
          <label htmlFor="invoicedQuantity">จำนวนที่ตั้งหนี้แล้ว</label>
          <input type="number" id="invoicedQuantity" />
          <label htmlFor="currentInvoiceQuantity">จำนวนที่ตั้งหนี้ครั้งนี้</label>
          <input type="number" id="currentInvoiceQuantity" />
          <label htmlFor="unitPrice">ราคาต่อหน่วย</label>
          <input type="number" id="unitPrice" />
          <label htmlFor="totalAmount">จำนวนเงิน</label>
          <input type="text" id="totalAmount" readOnly />
        </div>
      </div>

      <div className="form-actions">
        <button className="cancel-button">ยกเลิก</button>
        <button className="submit-button">บันทึกการตั้งหนี้</button>
      </div>
    </div>
  );
}

export default InvoiceForm;