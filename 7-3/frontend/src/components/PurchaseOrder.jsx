"use client"

import { useState } from "react"

function PurchaseOrder() {
  const [poNumber, setPoNumber] = useState("PO-" + new Date().getTime().toString().slice(-6))
  const [items, setItems] = useState([
    { 
      id: 1, 
      name: "", 
      description: "",
      quantity: 0,
      unitPrice: 0, 
      total: 0 
    }
  ])
  const [formErrors, setFormErrors] = useState({})

  // Mock data for branches
  const branches = [
    { id: 1, name: "สาขากรุงเทพ" },
    { id: 2, name: "สาขาเชียงใหม่" },
    { id: 3, name: "สาขาภูเก็ต" },
  ]

  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === "quantity" || field === "unitPrice") {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
        }
        return updatedItem
      }
      return item
    })
    setItems(updatedItems)
  }

  const addItem = () => {
    const newId = Math.max(...items.map((item) => item.id), 0) + 1
    setItems([...items, { 
      id: newId, 
      name: "", 
      description: "", 
      quantity: 0,
      unitPrice: 0, 
      total: 0 
    }])
  }

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const validateForm = () => {
    const errors = {}
    
    // Validate header fields
    if (!poNumber) errors.poNumber = "กรุณากรอกเลขที่ใบสั่งซื้อ"
    if (!document.getElementById("po-date").value) errors.poDate = "กรุณาเลือกวันที่สั่ง"
    if (!document.getElementById("required-date").value) errors.requiredDate = "กรุณาเลือกวันที่ต้องการสินค้า"
    if (!document.getElementById("branch").value) errors.branch = "กรุณาเลือกสาขา"
    if (!document.getElementById("requester").value) errors.requester = "กรุณากรอกชื่อผู้สั่ง"
    if (!document.getElementById("supplier").value) errors.supplier = "กรุณากรอกชื่อผู้จำหน่าย"

    // Validate items
    const itemErrors = items.map(item => ({
      name: !item.name ? "กรุณากรอกชื่อรายการ" : "",
      description: !item.description ? "กรุณากรอกคำอธิบาย" : "",
      quantity: item.quantity <= 0 ? "กรุณากรอกอย่างน้อย 1 ชิ้น" : "",
      unitPrice: item.unitPrice <= 0 ? "กรุณากรอกราคาที่มากกว่า 0 บาท" : ""
    }))

    if (itemErrors.some(error => Object.values(error).some(e => e))) {
      errors.items = itemErrors
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    const orderData = {
      poNumber,
      date: document.getElementById("po-date").value,
      requiredDate: document.getElementById("required-date").value,
      branch: document.getElementById("branch").value,
      requester: document.getElementById("requester").value,
      supplier_name: document.getElementById("supplier").value,
      items,
      total: calculateTotal(),
    };

    try {
      const response = await fetch("http://localhost:3000/purchase-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message); // แจ้งเตือนว่าบันทึกสำเร็จ
      } 
    } catch (error) {
      console.error("Error:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">จัดทำใบสั่งซื้อ (Purchase Order)</h2>
        <p className="card-description">สร้างใบสั่งซื้อโดยใช้ข้อมูลจากใบขอซื้อ</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* PO Number field */}
            <div className="form-group">
              <label htmlFor="po-number">เลขที่ใบสั่งซื้อ</label>
              <input 
                id="po-number" 
                value={poNumber} 
                onChange={(e) => setPoNumber(e.target.value)}
                className={formErrors.poNumber ? "error" : ""}
              />
              {formErrors.poNumber && <span className="error-message">{formErrors.poNumber}</span>}
            </div>

            {/* Date field */}
            <div className="form-group">
              <label htmlFor="po-date">วันที่สั่ง</label>
              <input 
                id="po-date" 
                type="date" 
                defaultValue={new Date().toISOString().split("T")[0]}
                className={formErrors.poDate ? "error" : ""}
              />
              {formErrors.poDate && <span className="error-message">{formErrors.poDate}</span>}
            </div>

            {/* Required date field */}
            <div className="form-group">
              <label htmlFor="required-date">วันที่ต้องการสินค้า</label>
              <input 
                id="required-date" 
                type="date"
                className={formErrors.requiredDate ? "error" : ""}
              />
              {formErrors.requiredDate && <span className="error-message">{formErrors.requiredDate}</span>}
            </div>

            {/* Branch select */}
            <div className="form-group">
              <label htmlFor="branch">สาขาที่สั่ง</label>
              <select 
                id="branch"
                className={formErrors.branch ? "error" : ""}
              >
                <option value="">เลือกสาขา</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {formErrors.branch && <span className="error-message">{formErrors.branch}</span>}
            </div>

            {/* Requester field */}
            <div className="form-group">
              <label htmlFor="requester">ชื่อผู้สั่ง</label>
              <input 
                id="requester"
                className={formErrors.requester ? "error" : ""}
              />
              {formErrors.requester && <span className="error-message">{formErrors.requester}</span>}
            </div>

            {/* Supplier field */}
            <div className="form-group">
              <label htmlFor="supplier">ผู้จำหน่าย</label>
              <input 
                id="supplier"
                className={formErrors.supplier ? "error" : ""}
              />
              {formErrors.supplier && <span className="error-message">{formErrors.supplier}</span>}
            </div>
          </div>

          <div className="items-section">
            <div className="section-header">
              <h3>รายการสินค้า</h3>
              <button type="button" className="btn-outline" onClick={addItem}>
                <span className="icon">+</span> เพิ่มรายการ
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>รายการ</th>
                  <th>คำอธิบาย</th>
                  <th>จำนวน (ชิ้น)</th>
                  <th>ราคาต่อหน่วย (บาท)</th>
                  <th>รวม (บาท)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <input 
                        value={item.name} 
                        onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                        className={formErrors.items?.[index]?.name ? "error" : ""}
                      />
                      {formErrors.items?.[index]?.name && 
                        <span className="error-message">{formErrors.items[index].name}</span>
                      }
                    </td>
                    <td>
                      <input 
                        value={item.description} 
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        className={formErrors.items?.[index]?.description ? "error" : ""}
                      />
                      {formErrors.items?.[index]?.description && 
                        <span className="error-message">{formErrors.items[index].description}</span>
                      }
                    </td>
                    <td style={{ position: 'relative' }}>
                      <input
                        type="text" // Changed from "number" to "text"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '') // Allow only digits
                          handleItemChange(item.id, "quantity", value ? Number(value) : 0)
                        }}
                        className={formErrors.items?.[index]?.quantity ? "error" : ""}
                      />
                      <span className="unit-label">ชิ้น</span>
                      {formErrors.items?.[index]?.quantity && 
                        <span className="error-message">{formErrors.items[index].quantity}</span>
                      }
                    </td>
                    <td style={{ position: 'relative' }}>
                      <input
                        type="text" // Changed from "number" to "text"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.]/g, '') // Allow digits and decimal point
                          if (value === '' || /^\d*\.?\d*$/.test(value)) { // Validate decimal format
                            handleItemChange(item.id, "unitPrice", value ? Number(value) : 0)
                          }
                        }}
                        className={formErrors.items?.[index]?.unitPrice ? "error" : ""}
                      />
                      <span className="unit-label">บาท</span>
                      {formErrors.items?.[index]?.unitPrice && 
                        <span className="error-message">{formErrors.items[index].unitPrice}</span>
                      }
                    </td>
                    <td>{item.total.toFixed(2)} บาท</td>
                    <td>
                      <button type="button" className="btn-icon" onClick={() => removeItem(item.id)}>
                        <span className="icon">×</span>
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan={4} className="text-right">
                    รวมทั้งสิ้น
                  </td>
                  <td>{calculateTotal().toFixed(2)} บาท</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
      </div>
      <div className="card-footer">
        <button className="btn-outline">ยกเลิก</button>
        <button className="btn-primary" onClick={handleSubmit}>
          บันทึกใบสั่งซื้อ
        </button>
      </div>
    </div>
  )
}

export default PurchaseOrder

