import React, { useState } from 'react';

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
    prNumber: '',
    date: '',
    requester: '',
    department: '',
    purpose: '',
    items: [{ name: '', quantity: '', unit: '', price: '' }],
    note: '',
    approver: '',
    approvalDate: ''
  });

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
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: '', unit: '', price: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Add API call here
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
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="PR-00001"
            required
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
          <label className="block text-sm mb-1">ผู้ขอ<span className="text-red-500">*</span></label>
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
            <div className="col-span-5">
              <input 
                type="text" 
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="รายละเอียดสินค้า"
                required
              />
            </div>
            <div className="col-span-2">
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
            <div className="col-span-2">
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
                placeholder="ราคา"
                min="0"
                required
              />
            </div>
            <div className="col-span-1 flex items-center justify-center">
              {formData.items.length > 1 && (
                <button 
                  type="button"
                  onClick={() => removeItem(index)} 
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
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
      
      {/* <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1">ผู้อนุมัติ</label>
          <input 
            type="text" 
            name="approver"
            value={formData.approver}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ชื่อผู้อนุมัติ" 
          />
        </div>
        <div>
          <label className="block text-sm mb-1">วันที่อนุมาร</label>
          <input 
            type="date" 
            name="approvalDate"
            value={formData.approvalDate}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div> */}
      
      <button 
        type="submit" 
        className="w-full bg-gray-800 text-white py-3 rounded font-medium hover:bg-gray-700 transition-colors mt-6"
      >
        ส่งแบบฟอร์ม
      </button>
    </form>
  );
};

export default PurchaseRequestForm;