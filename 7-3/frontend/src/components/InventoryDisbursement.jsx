"use client"

import { useState } from "react"

function InventoryDisbursement() {
  const [disbursementNumber, setDisbursementNumber] = useState("DSB-" + new Date().getTime().toString().slice(-6))
  const [department, setDepartment] = useState("")
  const [items, setItems] = useState([{ id: 1, itemId: "", name: "", quantity: 1, available: 0 }])

  // Mock inventory data
  const inventoryItems = [
    { id: 1, code: "IT001", name: "คอมพิวเตอร์", available: 15 },
    { id: 2, code: "IT002", name: "เมาส์", available: 30 },
    { id: 3, code: "IT003", name: "คีย์บอร์ด", available: 25 },
    { id: 4, code: "OF001", name: "โต๊ะทำงาน", available: 8 },
    { id: 5, code: "OF002", name: "เก้าอี้สำนักงาน", available: 12 },
  ]

  // Mock departments
  const departments = [
    { id: 1, name: "ฝ่ายไอที" },
    { id: 2, name: "ฝ่ายบุคคล" },
    { id: 3, name: "ฝ่ายการเงิน" },
    { id: 4, name: "ฝ่ายการตลาด" },
  ]

  const addItem = () => {
    const newId = Math.max(...items.map((item) => item.id), 0) + 1
    setItems([...items, { id: newId, itemId: "", name: "", quantity: 1, available: 0 }])
  }

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const handleItemSelect = (id, itemId) => {
    const selectedInventoryItem = inventoryItems.find((item) => item.id === Number(itemId))

    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          itemId,
          name: selectedInventoryItem ? selectedInventoryItem.name : "",
          available: selectedInventoryItem ? selectedInventoryItem.available : 0,
        }
      }
      return item
    })

    setItems(updatedItems)
  }

  const handleQuantityChange = (id, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: value }
      }
      return item
    })
    setItems(updatedItems)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("บันทึกการเบิกจ่ายพัสดุเรียบร้อยแล้ว")
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">การเบิกจ่ายพัสดุ</h2>
        <p className="card-description">บันทึกการเบิกจ่ายพัสดุออกจากคลัง</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="disbursement-number">เลขที่ใบเบิก</label>
              <input
                id="disbursement-number"
                value={disbursementNumber}
                onChange={(e) => setDisbursementNumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="disbursement-date">วันที่เบิก</label>
              <input id="disbursement-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="form-group">
              <label htmlFor="department">หน่วยงานที่เบิก</label>
              <select id="department" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="">เลือกหน่วยงาน</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="requester">ผู้เบิก</label>
              <input id="requester" />
            </div>
          </div>

          <div className="items-section">
            <div className="section-header">
              <h3>รายการพัสดุที่เบิก</h3>
              <button type="button" className="btn-outline" onClick={addItem}>
                <span className="icon">+</span> เพิ่มรายการ
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>รหัสพัสดุ</th>
                  <th>รายการ</th>
                  <th>คงเหลือ</th>
                  <th>จำนวนเบิก</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <select value={item.itemId} onChange={(e) => handleItemSelect(item.id, e.target.value)}>
                        <option value="">เลือกพัสดุ</option>
                        {inventoryItems.map((invItem) => (
                          <option key={invItem.id} value={invItem.id.toString()}>
                            {invItem.code} - {invItem.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.available}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                        min={1}
                        max={item.available}
                        className={item.quantity > item.available ? "input-error" : ""}
                      />
                      {item.quantity > item.available && <p className="error-message">เกินจำนวนที่มี</p>}
                    </td>
                    <td>
                      <button type="button" className="btn-icon" onClick={() => removeItem(item.id)}>
                        <span className="icon">×</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </div>
      <div className="card-footer">
        <button className="btn-outline">ยกเลิก</button>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!department || items.some((item) => !item.itemId || item.quantity > item.available)}
        >
          บันทึกการเบิกจ่าย
        </button>
      </div>
    </div>
  )
}

export default InventoryDisbursement

