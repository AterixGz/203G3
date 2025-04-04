import React, { useState } from 'react';
import './Registerasset.css';

function RegisterAsset() {
  const [items, setItems] = useState([{
    id: 1,
    description: '',
    unit: '',
    quantity: 0,
    receivedDate: '',
    poReference: ''
  }]);

  const handleAddItem = () => {
    setItems([...items, {
      id: items.length + 1,
      description: '',
      unit: '',
      quantity: 0,
      receivedDate: '',
      poReference: ''
    }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="register-asset-AST">
      <h2>การทำรายการรับสินทรัพย์</h2>
      
      <div className="form-header-AST">
        <div className="form-row-AST">
          <label className="label-AST" htmlFor="poReference">อ้างอิงหมายเลขใบสั่งซื้อ</label>
          <select className="select-AST" id="poReference">
            <option value="">เลือกใบสั่งซื้อ</option>
            <option value="PO-047690">PO-047690</option>
          </select>
        </div>
      </div>

      <div className="items-table-AST">
        <h3>รายการรับสินทรัพย์</h3>
        <table className="table-AST">
          <thead>
            <tr>
              <th className="th-AST">คำอธิบายรายการ</th>
              <th className="th-AST">หน่วยนับ</th>
              <th className="th-AST">ปริมาณการรับ</th>
              <th className="th-AST">วันที่รับ</th>
              <th className="th-AST">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="td-AST">
                  <input
                    className="input-AST"
                    type="text"
                    placeholder="รายละเอียดสินทรัพย์"
                    value={item.description}
                  />
                </td>
                <td className="td-AST">
                  <select className="select-AST" value={item.unit}>
                    <option value="">เลือกหน่วย</option>
                    <option value="piece">ชิ้น</option>
                    <option value="unit">หน่วย</option>
                    <option value="set">ชุด</option>
                  </select>
                </td>
                <td className="td-AST">
                  <input
                    className="input-AST"
                    type="number"
                    min="1"
                    value={item.quantity}
                  />
                </td>
                <td className="td-AST">
                  <input
                    className="input-AST"
                    type="date"
                    value={item.receivedDate}
                  />
                </td>
                <td className="td-AST">
                  <button className="cancel-button-AST" onClick={() => handleRemoveItem(index)}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-item-button-AST" onClick={handleAddItem}>
          เพิ่มรายการ
        </button>
      </div>

      <div className="form-actions-AST">
        <button className="cancel-button-AST">ยกเลิก</button>
        <button className="submit-button-AST">บันทึกการรับสินทรัพย์</button>
      </div>
    </div>
  );
}

export default RegisterAsset;