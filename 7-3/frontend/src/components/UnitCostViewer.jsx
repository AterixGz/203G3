"use client"

import { useState } from "react"

function UnitCostViewer() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock inventory data
  const inventoryItems = [
    { id: 1, code: "IT001", name: "คอมพิวเตอร์", quantity: 15, unitCost: 25000, location: "คลังใหญ่" },
    { id: 2, code: "IT002", name: "เมาส์", quantity: 30, unitCost: 500, location: "คลังใหญ่" },
    { id: 3, code: "IT003", name: "คีย์บอร์ด", quantity: 25, unitCost: 890, location: "คลังใหญ่" },
    { id: 4, code: "OF001", name: "โต๊ะทำงาน", quantity: 8, unitCost: 4500, location: "คลังเฟอร์นิเจอร์" },
    { id: 5, code: "OF002", name: "เก้าอี้สำนักงาน", quantity: 12, unitCost: 2200, location: "คลังเฟอร์นิเจอร์" },
  ]

  const [filteredItems, setFilteredItems] = useState(inventoryItems)

  const handleSearch = () => {
    const filtered = inventoryItems.filter((item) => item.name.includes(searchTerm) || item.code.includes(searchTerm))
    setFilteredItems(filtered)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">ต้นทุนต่อหน่วยของพัสดุ</h2>
        <p className="card-description">ตรวจสอบต้นทุนต่อหน่วยและจำนวนคงเหลือของพัสดุในคลัง</p>
      </div>
      <div className="card-content">
        <div className="search-container">
          <input
            placeholder="ค้นหาตามรหัสหรือชื่อพัสดุ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="btn-primary" onClick={handleSearch}>
            <span className="icon">🔍︎</span> ค้นหา
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>รหัสพัสดุ</th>
              <th>รายการ</th>
              <th>จำนวนคงเหลือ</th>
              <th>ต้นทุนต่อหน่วย</th>
              <th>มูลค่ารวม</th>
              <th>สถานที่เก็บ</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitCost.toLocaleString()} บาท</td>
                  <td>{(item.quantity * item.unitCost).toLocaleString()} บาท</td>
                  <td>{item.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  ไม่พบรายการพัสดุ
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredItems.length > 0 && (
          <div className="total-summary">
            <p>
              มูลค่าพัสดุรวมทั้งสิ้น:{" "}
              {filteredItems.reduce((sum, item) => sum + item.quantity * item.unitCost, 0).toLocaleString()} บาท
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnitCostViewer

