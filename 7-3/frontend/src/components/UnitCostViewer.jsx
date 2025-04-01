"use client"

import { useState, useEffect } from "react"

function UnitCostViewer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [inventoryItems, setInventoryItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/inventory")
      .then((res) => res.json())
      .then((data) => {
        setInventoryItems(data)
        setFilteredItems(data)
      })
      .catch((err) => console.error("Error fetching data:", err))
  }, [])

  const handleSearch = () => {
    const filtered = inventoryItems.filter(
      (item) => item.name.includes(searchTerm) || item.code.includes(searchTerm)
    )
    setFilteredItems(filtered)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handlePrint = (documentType) => {
    // Format current date
    const today = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Create print window content
    const printContent = `
      <html>
        <head>
          <title>${documentType}</title>
          <style>
            body { font-family: 'Sarabun', sans-serif; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .header { text-align: center; margin-bottom: 20px; }
            .summary { margin-top: 20px; }
            .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-box { text-align: center; width: 200px; }
            .signature-line { border-top: 1px solid #000; margin-top: 50px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${documentType}</h2>
            <p>วันที่: ${today}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>รหัสพัสดุ</th>
                <th>รายการ</th>
                <th>จำนวนคงเหลือ</th>
                <th>ต้นทุนต่อหน่วย</th>
                <th>มูลค่าคงเหลือ</th>
                <th>สถานที่เก็บ</th>
              </tr>
            </thead>
            <tbody>
              ${filteredItems.map(item => `
                <tr>
                  <td>${item.code}</td>
                  <td>${item.name}</td>
                  <td>${item.quantity} ชิ้น</td>
                  <td>${item.unitCost?.toLocaleString()} บาท</td>
                  <td>${(item.quantity * item.unitCost)?.toLocaleString()} บาท</td>
                  <td>${item.location}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <p>มูลค่ารวมทั้งสิ้น: ${filteredItems
              .reduce((sum, item) => sum + item.quantity * item.unitCost, 0)
              .toLocaleString()} บาท</p>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <p>ผู้จัดทำ</p>
              <p>วันที่: ${today}</p>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <p>ผู้ตรวจสอบ</p>
              <p>วันที่: ${today}</p>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <p>ผู้อนุมัติ</p>
              <p>วันที่: ${today}</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Open print window
    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
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

        <div className="print-buttons">
          <button className="btn-outline" onClick={() => handlePrint('ใบขอซื้อพัสดุ')}>
            <span className="icon"></span> พิมพ์ใบขอซื้อ
          </button>
          <button className="btn-outline" onClick={() => handlePrint('ใบสั่งซื้อพัสดุ')}>
            <span className="icon"></span> พิมพ์ใบสั่งซื้อ
          </button>
          <button className="btn-outline" onClick={() => handlePrint('ใบรับพัสดุ')}>
            <span className="icon"></span> พิมพ์ใบรับพัสดุ
          </button>
          <button className="btn-outline" onClick={() => handlePrint('ใบเบิกพัสดุ')}>
            <span className="icon"></span> พิมพ์ใบเบิกพัสดุ
          </button>
          <button className="btn-outline" onClick={() => handlePrint('ใบส่งพัสดุ')}>
            <span className="icon"></span> พิมพ์ใบส่งพัสดุ
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>รหัสพัสดุ</th>
              <th>รายการ</th>
              <th>จำนวนคงเหลือ</th>
              <th>ต้นทุนต่อหน่วย</th>
              <th>มูลค่าคงเหลือก่อนรับ</th>
              <th>มูลค่าคงเหลือหลังรับ</th>
              <th>สถานที่เก็บ</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity} ชิ้น</td>
                  <td>{item.unitCost?.toLocaleString()} บาท</td>
                  <td>{(item.quantity * item.unitCost)?.toLocaleString()} บาท</td>
                  <td>{((item.quantity + (item.pending_receive || 0)) * item.unitCost)?.toLocaleString()} บาท</td>
                  <td>{item.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">
                  ไม่พบรายการพัสดุ
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredItems.length > 0 && (
          <div className="total-summary">
            <div className="summary-grid">
              <p>
                มูลค่าพัสดุคงเหลือก่อนรับ:{" "}
                {filteredItems
                  .reduce((sum, item) => sum + item.quantity * item.unitCost, 0)
                  .toLocaleString()} บาท
              </p>
              <p>
                มูลค่าพัสดุคงเหลือหลังรับ:{" "}
                {filteredItems
                  .reduce((sum, item) => 
                    sum + (item.quantity + (item.pending_receive || 0)) * item.unitCost, 0)
                  .toLocaleString()} บาท
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnitCostViewer
