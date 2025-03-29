import React from 'react';
import './Requisition.css';

function PurchaseRequisitionForm() {
  return (
    <div className="purchase-requisition-form">
      <h2>การจัดทำใบขอซื้อ (Purchase Requisition)</h2>
      <p>กรอกข้อมูลเพื่อสร้างใบขอซื้อ พร้อมตรวจสอบงบประมาณคงเหลือ</p>

      <div className="form-row">
        <label htmlFor="prNumber">เลขที่ใบขอซื้อ</label>
        <input type="text" id="prNumber" value="PR07677" readOnly />
      </div>

      <div className="form-row">
        <label htmlFor="requestDate">วันที่ขอซื้อ</label>
        <input type="date" id="requestDate" />
      </div>

      <div className="form-row">
        <label htmlFor="department">แผนก/ฝ่าย</label>
        <select id="department">
          <option value="">เลือกแผนก/ฝ่าย</option>
          {/* เพิ่มตัวเลือกแผนก/ฝ่าย */}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="requester">ผู้ขอซื้อ</label>
        <input type="text" id="requester" />
      </div>

      <div className="form-row">
        <label htmlFor="purpose">วัตถุประสงค์การขอซื้อ</label>
        <textarea id="purpose" />
      </div>

      <div className="item-list">
        <h3>รายการสินค้า/บริการ</h3>
        <button className="add-item-button">เพิ่มรายการ</button>

        <div className="item-row">
          <label htmlFor="itemDetails">รายละเอียด</label>
          <input type="text" id="itemDetails" value="รายละเอียดสินค้า/บริการ" />
          <label htmlFor="quantity">จำนวน</label>
          <input type="number" id="quantity" value="1" />
          <label htmlFor="unitPrice">ราคาต่อหน่วย</label>
          <input type="number" id="unitPrice" value="0" />
          <label htmlFor="totalAmount">จำนวนเงิน</label>
          <input type="text" id="totalAmount" value="$0.00" readOnly />
        </div>

        <div className="total">
          <label>รวมทั้งสิ้น</label>
          <input type="text" value="$0.00" readOnly />
        </div>
      </div>

      <div className="form-actions">
        <button className="cancel-button">ยกเลิก</button>
        <button className="submit-button">บันทึกใบขอซื้อ</button>
      </div>
    </div>
  );
}

export default PurchaseRequisitionForm;