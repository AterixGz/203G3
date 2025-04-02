import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PurchaseOrder.css";

const PurchaseOrder = () => {
  const [items, setItems] = useState([{ id: 1, name: "", quantity: 0, price: 0 }]);
  const [vendor, setVendor] = useState("");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]); // วันที่ปัจจุบัน
  const [poNumber, setPoNumber] = useState(""); // PO Number

  // ดึง PO Number จาก Backend เมื่อโหลดหน้า
  useEffect(() => {
    const fetchPoNumber = async () => {
      try {
        const response = await axios.get("http://localhost:3000/next-po-number");
        setPoNumber(response.data.poNumber);
      } catch (error) {
        console.error("Error fetching PO Number:", error);
      }
    };

    fetchPoNumber();
  }, []);

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

  const handleSubmit = async () => {
    const data = {
      poNumber,
      orderDate,
      vendor,
      items: items.map(({ id, ...rest }) => rest), // ลบ `id` ออกจากรายการสินค้า
    };

    try {
      const response = await axios.post("http://localhost:3000/purchase-order", data);
      alert(`Purchase Order created successfully: ID ${response.data.purchaseOrderId}`);
    } catch (error) {
      console.error("Error creating purchase order:", error.response?.data || error.message);
      alert("Failed to create purchase order");
    }
  };

  return (
    <div className="purchase-order-container">
      <h2>จัดทำใบสั่งซื้อ (Purchase Order)</h2>
      <div className="order-info">
        <label>
          เลขที่ใบสั่งซื้อ:
          <input type="text" value={poNumber} readOnly />
        </label>
        <label>
          วันที่:
          <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
        </label>
      </div>

      <div className="supplier-info">
        <label>
          ผู้จำหน่าย:
          <input
            type="text"
            placeholder="ชื่อผู้จำหน่าย"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
          />
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
                  onChange={(e) => handleChange(index, "quantity", parseFloat(e.target.value) || 0)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleChange(index, "price", parseFloat(e.target.value) || 0)}
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

      <button className="add-item" onClick={handleAddItem}>
        + เพิ่มรายการ
      </button>

      <div className="actions">
        <button className="cancel">ยกเลิก</button>
        <button className="save" onClick={handleSubmit}>
          บันทึกใบสั่งซื้อ
        </button>
      </div>
    </div>
  );
};

export default PurchaseOrder;