"use client";

import { useState, useEffect } from "react";

function InventoryDisbursement() {
  const [disbursementNumber, setDisbursementNumber] = useState(
    "DSB-" + new Date().getTime().toString().slice(-6)
  );
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [department, setDepartment] = useState("");
  const [requester, setRequester] = useState("");
  const [items, setItems] = useState([{ id: 1, itemId: "", quantity: 1 , name: ""}]);
  const [inventoryItems, setInventoryItems] = useState([]);


  // โหลดข้อมูลพัสดุและหน่วยงานจากฐานข้อมูล
  useEffect(() => {
    fetch("http://localhost:3000/api/inventory-items")
      .then((res) => res.json())
      .then((data) => setInventoryItems(data))
      .catch((err) => console.error("Error fetching inventory items:", err));

  }, []);

  const departments = [

        { id: 1, name: "ฝ่ายไอที" },
    
        { id: 2, name: "ฝ่ายบุคคล" },
    
        { id: 3, name: "ฝ่ายการเงิน" },
    
        { id: 4, name: "ฝ่ายการตลาด" },
    
      ]
  const addItem = () => {
    setItems([...items, { id: items.length + 1, itemId: "", quantity: 1 , name: ""}]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemSelect = (id, itemId) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, itemId } : item
      )
    );
  };

  const handleQuantityChange = (id, quantity) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const disbursementData = {
      disbursementNumber,
      date,
      department,
      requester,
      items,
    };

    try {
      const response = await fetch("http://localhost:3000/api/inventory-disbursement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(disbursementData),
      });

      if (response.ok) {
        alert("บันทึกการเบิกจ่ายสำเร็จ!");
        setDepartment("");
        setRequester("");
        setItems([{ id: 1, itemId: "", quantity: 1 , name: ""}]);
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>การเบิกจ่ายพัสดุ</h2>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>เลขที่ใบเบิก</label>
            <input value={disbursementNumber} readOnly />
          </div>
          <div className="form-group">
            <label>วันที่เบิก</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>หน่วยงานที่เบิก</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="">เลือกหน่วยงาน</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>ผู้เบิก</label>
            <input type="text" value={requester} onChange={(e) => setRequester(e.target.value)} />
          </div>

          <div className="items-section">
            <h3>รายการพัสดุที่เบิก</h3>
            <button type="button" onClick={addItem}>+ เพิ่มรายการ</button>
            <table>
              <thead>
                <tr>
                  <th>รหัสพัสดุ</th>
                  <th>จำนวน</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <select value={item.itemId} onChange={(e) => handleItemSelect(item.id, e.target.value)}>
                        <option value="">เลือกพัสดุ</option>
                        {inventoryItems.map((inv) => (
                          <option key={inv.id} value={inv.id}>
                            {inv.item_id} - {inv.storage_location} - {inv.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, e.target.value)} min="1" />
                    </td>
                    <td>
                      <button type="button" onClick={() => removeItem(item.id)}>ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="submit">บันทึกการเบิกจ่าย</button>
        </form>
      </div>
    </div>
  );
}

export default InventoryDisbursement;

