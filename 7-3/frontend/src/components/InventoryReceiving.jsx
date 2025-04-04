"use client"

import { useState, useEffect } from "react"

function InventoryReceiving() {
  const [selectedPO, setSelectedPO] = useState("")
  const [receiptNumber, setReceiptNumber] = useState("RCV-" + new Date().getTime().toString().slice(-6))
  const [items, setItems] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [deliveryNote, setDeliveryNote] = useState("")
  const [storageLocations] = useState([
    { id: 1, name: "คลังสินค้า A" },
    { id: 2, name: "คลังสินค้า B" },
    { id: 3, name: "คลังสินค้า C" },
  ])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handlePrint = () => {
    const today = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
  
    // Add content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ใบรับพัสดุ</title>
          <style>
            @media print {
              body { 
                font-family: 'Sarabun', sans-serif;
                padding: 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .info-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-bottom: 20px;
              }
              .info-item {
                display: flex;
                gap: 10px;
              }
              .info-item label {
                font-weight: bold;
              }
              table { 
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td { 
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f3f4f6;
              }
              .total-row {
                font-weight: bold;
              }
              .signature-section {
                margin-top: 50px;
                display: flex;
                justify-content: space-between;
              }
              .signature-box {
                text-align: center;
                width: 200px;
              }
              .signature-line {
                border-top: 1px solid #000;
                margin-top: 50px;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-document">
            <div class="header">
              <h2>ใบรับพัสดุ</h2>
              <p>วันที่: ${today}</p>
              <p>เลขที่: ${receiptNumber}</p>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <label>วันที่รับ:</label>
                <span>${document.getElementById("receipt-date").value}</span>
              </div>
              <div class="info-item">
                <label>เลขที่ใบส่งของ:</label>
                <span>${deliveryNote}</span>
              </div>
              <div class="info-item">
                <label>อ้างอิงใบสั่งซื้อ:</label>
                <span>${selectedPO}</span>
              </div>
            </div>
  
            <table>
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>รหัสสินค้า</th>
                  <th>รายการ</th>
                  <th>จำนวนสั่งซื้อ</th>
                  <th>จำนวนรับ</th>
                  <th>ราคาต่อหน่วย</th>
                  <th>สถานที่จัดเก็บ</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.code}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity} ชิ้น</td>
                    <td>${item.received} ชิ้น</td>
                    <td>${item.unit_price?.toLocaleString()} บาท</td>
                    <td>${item.storageLocation}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
  
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line"></div>
                <p>ผู้รับพัสดุ</p>
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
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `)
  
    printWindow.document.close()
  }

  // โหลดข้อมูลใบสั่งซื้อจากเซิร์ฟเวอร์
  useEffect(() => {
    fetch("http://localhost:3000/purchase-orders")
      .then((res) => res.json())
      .then((data) => setPurchaseOrders(data))
      .catch((err) => console.error("Error fetching purchase orders:", err))
  }, [])

  // โหลดข้อมูลรายการสินค้าจากใบสั่งซื้อที่เลือก
  const handlePOSelect = (poId) => {
    console.log("Selected PO:", poId); // ✅ Debug
  
    setSelectedPO(poId);
    if (!poId) {
      setItems([]);
      return;
    }
  
    Promise.all([
      fetch(`http://localhost:3000/purchase-orders/${poId}`).then(res => res.json()),
      fetch(`http://localhost:3000/purchase-items/${poId}`).then(res => res.json())
    ])
    .then(([poDetails, itemsData]) => {
      console.log("Fetched Items:", itemsData); // ✅ Debug ตรวจสอบข้อมูล
      setItems(itemsData.map((item) => ({
        ...item,
        name: item.name || '',
        code: item.id || '',
        quantity: item.quantity || 0,
        unit_price: item.unit_price || 0,
        received: 0,
        storageLocation: ""
      })));
    })
    .catch((err) => console.error("Error fetching data:", err));
  };

  const handleQuantityChange = (id, value) => {
    setItems(items.map((item) => item.id === id ? { ...item, received: value } : item))
  }

  const handleStorageChange = (id, value) => {
    setItems(items.map((item) => 
      item.id === id ? { ...item, storageLocation: value } : item
    ))
  }

  // ตรวจสอบว่าได้กรอกจำนวนรับครบถ้วนทุกรายการหรือไม่
  const isAllItemsReceived = items.every(item => item.received === item.quantity)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitted(true) // Set submitted state to true

    if (!deliveryNote) {
      return // Stop if delivery note is empty
    }

    if (!isAllItemsReceived) {
      alert("กรุณากรอกจำนวนรับให้ครบถ้วนก่อน")
      return
    }

    const receivingData = {
      receiptNumber,
      date: document.getElementById("receipt-date").value,
      deliveryNote: document.getElementById("delivery-note").value,
      selectedPO,
      items: items.map(item => ({
        ...item,
        storageLocation: item.storageLocation
      }))
    }

    try {
      const response = await fetch("http://localhost:3000/inventory-receiving", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receivingData),
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)

        // บันทึกข้อมูลลงใน inventory_items
        const inventoryItemsData = items.map(item => ({
          item_id: item.id,
          po_id: selectedPO,
          received_quantity: item.received,
          total: item.unit_price * item.received,
        }))
        await fetch("http://localhost:3000/inventory-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inventoryItemsData),
        })

        alert("ข้อมูลการรับพัสดุและสินค้าเข้าสู่คลังสำเร็จ")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้")
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">การรับพัสดุเข้าคลัง</h2>
        <p className="card-description">บันทึกการรับพัสดุตามใบสั่งซื้อ</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="receipt-number">เลขที่ใบรับพัสดุ</label>
              <input id="receipt-number" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="receipt-date">วันที่รับ</label>
              <input id="receipt-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="form-group">
              <label htmlFor="po-select">อ้างอิงใบสั่งซื้อ</label>
              <select id="po-select" value={selectedPO} onChange={(e) => handlePOSelect(e.target.value)}>
                <option value="">เลือกใบสั่งซื้อ</option>
                {purchaseOrders.map((po) => (
                  <option key={po.id} value={po.id}>
                    {po.po_number} - {po.supplier_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="delivery-note">เลขที่ใบส่งของ</label>
              <input 
                id="delivery-note" 
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className={isSubmitted && !deliveryNote ? "error" : ""}
              />
              {isSubmitted && !deliveryNote && 
                <span className="error-message">กรุณากรอกเลขที่ใบส่งของ</span>
              }
            </div>
          </div>

          {selectedPO && (
            <div className="items-section">
              <h3>รายการพัสดุ</h3>

              <table>
                <thead>
                  <tr>
                    <th>รหัสสินค้า</th>
                    <th>รายการ</th>
                    <th>จำนวนสั่งซื้อ</th>
                    <th>จำนวนรับ</th>
                    <th>ราคาต่อหน่วย</th>
                    <th>สถานที่จัดเก็บ</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.code}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity} ชิ้น</td>
                      <td>
                        <input
                          type="number"
                          value={item.received}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          max={item.quantity}
                          min={0}
                        />
                      </td>
                      <td>{item.unit_price?.toLocaleString()} บาท</td>
                      <td>
                        <select
                          value={item.storageLocation}
                          onChange={(e) => handleStorageChange(item.id, e.target.value)}
                          className="storage-select"
                        >
                          <option value="">เลือกสถานที่</option>
                          {storageLocations.map(location => (
                            <option key={location.id} value={location.name}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {item.received === item.quantity ? (
                          <span className="status-complete">
                            <span className="icon">✓</span> ครบถ้วน
                          </span>
                        ) : item.received > 0 ? (
                          <span className="status-partial">บางส่วน</span>
                        ) : (
                          <span className="status-pending">ยังไม่รับ</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </form>
      </div>
      <div className="card-footer">
        <div className="print-button">
          <button 
            type="button"
            className="btn-outline"
            onClick={handlePrint}
            disabled={!selectedPO || items.length === 0}
          >
            <span className="icon"></span> พิมพ์ใบรับพัสดุ
          </button>
        </div>
        
        <div className="action-buttons">
          <button 
            type="button" 
            className="btn-outline"
            onClick={() => window.history.back()}
          >
            ยกเลิก
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSubmit} 
            disabled={!selectedPO || items.length === 0 || !isAllItemsReceived || !deliveryNote}
          >
            บันทึกการรับพัสดุ
          </button>
        </div>
      </div>
    </div>
  )
}

export default InventoryReceiving
