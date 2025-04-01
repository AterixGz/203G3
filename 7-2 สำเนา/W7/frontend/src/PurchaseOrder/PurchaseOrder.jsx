
import React, { useState } from "react";
import "./PurchaseOrder.css";

const PurchaseOrder = () => {
  const [items, setItems] = useState([{ id: 1, name: "", quantity: 0, price: 0 }]);

  const handleAddItem = () => {
    setItems([...items, { id: items.length + 1, name: "", quantity: 0, price: 0 }]);
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div className="purchase-order-container">
      <h2>จัดทำใบสั่งซื้อ (Purchase Order)</h2>
      <div className="order-info">
        <label>
          เลขที่ใบสั่งซื้อ:
          <input type="text" value="PO-047690" readOnly />
        </label>
        <label>
          วันที่:
          <input type="date" value="2025-03-27" />
        </label>
      </div>

      <div className="supplier-info">
        <label>
          อ้างถึงใบขอซื้อ:
          <select>
            <option>เลือกใบขอซื้อ</option>
          </select>
        </label>
        <label>
          ผู้จำหน่าย:
          <input type="text" placeholder="ชื่อผู้จำหน่าย" />
        </label>
      </div>

      <h3>รายการสินค้า</h3>
      <table>
        <thead>
          <tr>
            <th>รายการ</th>
            <th>จำนวน</th>
            <th>ราคาต่อหน่วย</th>
            <th>รวม</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleChange(index, "quantity", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                />
              </td>
              <td>{(item.quantity * item.price).toFixed(2)}</td>
              <td>
                <button onClick={() => handleRemoveItem(index)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-item" onClick={handleAddItem}>+ เพิ่มรายการ</button>

      <div className="actions">
        <button className="cancel">ยกเลิก</button>
        <button className="save">บันทึกใบสั่งซื้อ</button>
      </div>
    </div>
  );
};

export default PurchaseOrder;
