"use client";

import { useState, useEffect } from "react";

function InventoryDisbursement() {
  const [disbursementNumber, setDisbursementNumber] = useState(
    "DSB-" + new Date().getTime().toString().slice(-6)
  );
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [department, setDepartment] = useState("");
  const [requester, setRequester] = useState("");
  const [items, setItems] = useState([{ id: 1, itemId: "", quantity: 1 , name: "",storage_location: ""}]);
  const [inventoryItems, setInventoryItems] = useState([]);
  
  // โหลดข้อมูลพัสดุและหน่วยงานจากฐานข้อมูล
  useEffect(() => {
    fetch("http://localhost:3000/api/inventory-items")
      .then((res) => {
        console.log('API Response:', res);
        return res.json();
      })
      .then((data) => {
        console.log('Inventory Items Data:', data);
        setInventoryItems(data);
      })
      .catch((err) => {
        console.error("Error fetching inventory items:", err);
      });
  }, []);

  const handlePrint = (documentType) => {
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
          <title>${documentType}</title>
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
              <h2>${documentType}</h2>
              <p>วันที่: ${today}</p>
              <p>เลขที่: ${disbursementNumber}</p>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <label>วันที่เบิก:</label>
                <span>${date}</span>
              </div>
              <div class="info-item">
                <label>หน่วยงาน:</label>
                <span>${department}</span>
              </div>
              <div class="info-item">
                <label>ผู้เบิก:</label>
                <span>${requester}</span>
              </div>
            </div>
  
            <table>
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>รายการ</th>
                  <th>จำนวน</th>
                  <th>สถานที่เก็บ</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item, index) => {
                  console.log('Item being mapped:', item); // Debug item
                  console.log('All inventory items:', inventoryItems); // Debug inventory items
                  
                  const inventoryItem = inventoryItems.find(inv => inv.id.toString() === item.itemId.toString()) || {};
                  console.log('Found inventory item:', inventoryItem); // Debug matched item
                  
                  return `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${inventoryItem.name || '-'}</td>
                      <td>${item.quantity} ชิ้น</td>
                      <td>${inventoryItem.storage_location || '-'}</td>
                    </tr>
                  `
                }).join('')}
              </tbody>
            </table>
  
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line"></div>
                <p>ผู้เบิก</p>
                <p>วันที่: ${today}</p>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <p>ผู้จ่าย</p>
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
                  <th>พัสดุ</th>
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

          <div className="card-footer">
            <div className="print-buttons">
              <button 
                type="button"
                className="btn-outline"
                onClick={() => handlePrint("ใบเบิกพัสดุ")}
              >
                <span className="icon"></span> พิมพ์ใบเบิกพัสดุ
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => handlePrint("ใบส่งพัสดุ")}
              >
                <span className="icon"></span> พิมพ์ใบส่งพัสดุ
              </button>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!department || !requester || items.some(item => !item.itemId)}
            >
              บันทึกการเบิกจ่าย
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InventoryDisbursement;

