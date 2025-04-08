import React, { useState, useEffect } from 'react';

// Add generatePRNumber function
const generatePRNumber = () => {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2); // 2 หลักสุดท้ายของปี
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // เดือนแบบ 2 หลัก
  const day = today.getDate().toString().padStart(2, '0'); // วันแบบ 2 หลัก
  const random = Math.floor(1000 + Math.random() * 9000); // สุ่มเลข 4 หลัก
  
  // รูปแบบ: PR-YYMMDDxxxx
  // YY = ปี 2 หลัก, MM = เดือน, DD = วัน, xxxx = เลขสุ่ม 4 หลัก
  return `PR-${year}${month}${day}${random}`;
};

const calculateAmount = (item) => {
  const quantity = parseFloat(item.quantity) || 0;
  const price = parseFloat(item.price) || 0;
  return quantity * price;
};

const calculateTotalAmount = (items) => {
  return items.reduce((sum, item) => sum + calculateAmount(item), 0);
};

const PurchaseRequestForm = () => {
  // เพิ่ม departments array
  const departments = [
    'ฝ่ายจัดซื้อ',
    'ฝ่ายบัญชี',
    'ฝ่ายการเงิน',
    'ฝ่ายบุคคล',
    'ฝ่ายการตลาด',
    'ฝ่ายขาย'
  ];

  // ปรับปรุง state เพื่อเก็บข้อมูลทั้งหมด
  const [formData, setFormData] = useState({
    prNumber: generatePRNumber(),
    date: new Date().toISOString().split('T')[0],
    requester: '',
    department: '',
    purpose: '',
    requiredDate: new Date().toISOString().split('T')[0],
    items: [{
      name: '',
      description: '',
      quantity: '',
      unit: '',
      price: '',
      amount: 0
    }],
    totalAmount: 0,
    note: '',
    status: 'pending',
    headerDescription: '',
    creator: '',
    creatorPosition: '',
    creatorNote: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add useEffect to generate new PR number on page load/refresh
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      prNumber: generatePRNumber()
    }));
  }, []);

  // Handler functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // คำนวณจำนวนเงินของรายการ
    if (field === 'quantity' || field === 'price') {
      newItems[index].amount = calculateAmount(newItems[index]);
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalAmount: calculateTotalAmount(newItems)
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', description: '', quantity: '', unit: '', price: '', amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        items: newItems,
        totalAmount: calculateTotalAmount(newItems)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch("http://localhost:3000/api/pr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message); // แจ้งเตือนว่าบันทึกสำเร็จ
        setFormData({
          prNumber: generatePRNumber(), // Initialize with generated number
          date: new Date().toISOString().split('T')[0],
          requester: "",
          department: "",
          purpose: "",
          requiredDate: new Date().toISOString().split('T')[0],
          items: [{ name: "", description: "", quantity: "", unit: "", price: "", amount: 0 }],
          totalAmount: 0,
          note: "",
          status: "pending",
          headerDescription: '',
          creator: '',
          creatorPosition: '',
          creatorNote: ''
        }); // รีเซ็ตฟอร์ม
      } else {
        throw new Error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-xl font-medium text-center mb-6">แบบฟอร์มใบขอซื้อ (PR)</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">เลขที่ PR<span className="text-red-500">*</span></label>
          <input 
            type="text" 
            name="prNumber"
            value={formData.prNumber}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm mb-1">วันที่<span className="text-red-500">*</span></label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">ผู้ขอ<span class="text-red-500">*</span></label>
          <input 
            type="text" 
            name="requester"
            value={formData.requester}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ชื่อผู้ขอ"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">แผนก<span className="text-red-500">*</span></label>
          <select 
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">เลือกแผนก</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
</div>
      <div className="mb-6">
        <label className="block text-sm mb-1">วัตถุประสงค์<span className="text-red-500">*</span></label>
        <textarea 
          name="purpose"
          value={formData.purpose}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
          placeholder="ระบุวัตถุประสงค์ในการขอซื้อ"
          required
        ></textarea>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
        <label className="block text-sm mb-1">วันที่ต้องการ<span className="text-red-500">*</span></label>
<input 
  type="date" 
  name="requiredDate"
  value={formData.requiredDate}
  onChange={handleInputChange}
  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  min={new Date().toISOString().split('T')[0]} // กำหนดวันที่ขั้นต่ำเป็นวันนี้
  required
/>
        </div>
        <div>
          <label className="block text-sm mb-1">สถานะ</label>
          <input 
            type="text" 
            value={formData.status}
            className="w-full p-2 border border-gray-300 rounded bg-gray-50"
            readOnly
          />
        </div>
      </div>

      <div className="mb-2 flex justify-between items-center">
        <h2 className="font-medium">รายการสินค้า<span className="text-red-500">*</span></h2>
        <button 
          type="button"
          className="flex items-center bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors" 
          onClick={addItem}
        >
          <span className="mr-1">+</span> เพิ่มรายการ
        </button>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
  {formData.items.map((item, index) => (
    <div key={index} className="grid grid-cols-12 gap-2 mb-2">
      <div className="col-span-3">
        <input
          type="text"
          value={item.name}
          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ชื่อสินค้า"
          required
        />
      </div>
      <div className="col-span-3">
        <input
          type="text"
          value={item.description}
          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="คำอธิบายรายการ"
        />
      </div>
      <div className="col-span-1">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="จำนวน"
          min="1"
          required
        />
      </div>
      <div className="col-span-1">
        <input
          type="text"
          value={item.unit}
          onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="หน่วย"
          required
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={item.price}
          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ราคาต่อหน่วย"
          min="0"
          required
        />
      </div>
      <div className="col-span-2">
        <select
          value={item.itemType || ''}
          onChange={(e) => handleItemChange(index, 'itemType', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">เลือกประเภทสินค้า</option>
          <option value="สินค้าทั่วไป">สินค้าทั่วไป</option>
          <option value="สินค้าถาวร">สินค้าถาวร</option>
        </select>
      </div>
      <div className="col-span-1 flex items-center justify-center">
        {formData.items.length > 1 && (
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            ลบ
          </button>
        )}
      </div>
    </div>
  ))}
</div>

      {/* แก้ไขส่วนแสดงจำนวนเงินรวม */}
      <div className="flex justify-end mt-4">
        <div className="px-4 py-3">
          <span className="text-sm">จำนวนเงินรวม: </span>
          <span className="text-lg ml-2">
            {new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB'
            }).format(formData.totalAmount)}
          </span>
        </div>
      </div>

      <div className="my-6">
        <label className="block text-sm mb-1">หมายเหตุ</label>
        <textarea 
          name="note"
          value={formData.note}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
          placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
        ></textarea>
      </div>

      {/* เพิ่มส่วนคำอธิบายหัวรายการ */}
      <div className="mb-6">
        <label className="block text-sm mb-1">คำอธิบายหัวรายการ</label>
        <textarea 
          name="headerDescription"
          value={formData.headerDescription || ''}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
          placeholder="รายละเอียดเพิ่มเติมของรายการ"
        ></textarea>
      </div>

      {/* เพิ่มส่วนผู้จัดทำ */}
      <div>
        <h2 className="text-lg font-medium mb-4">ข้อมูลผู้จัดทำ</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">ชื่อผู้จัดทำ<span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="creator"
              value={formData.creator || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">ตำแหน่ง</label>
            <input 
              type="text" 
              name="creatorPosition"
              value={formData.creatorPosition || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-1">หมายเหตุจากผู้จัดทำ</label>
          <textarea 
            name="creatorNote"
            value={formData.creatorNote || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
            placeholder="หมายเหตุหรือความคิดเห็นเพิ่มเติม"
          ></textarea>
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full bg-gray-800 text-white py-3 rounded font-medium hover:bg-gray-700 transition-colors mt-6"
      >
        {loading ? 'กำลังส่ง...' : 'ส่งแบบฟอร์ม'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </form>
  );
};

export default PurchaseRequestForm;