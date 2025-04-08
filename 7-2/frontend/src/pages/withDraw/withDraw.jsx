import { useState, useEffect } from 'react';
import './withDraw.css';

const WithDraw = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    withdrawNumber: '',
    date: new Date().toISOString().split('T')[0],
    requester: '',
    department: '',
    items: [{ name: '', quantity: '', available: 0 }],
    reason: '',
    status: 'pending'
  });

  const departments = [
    'ฝ่ายจัดซื้อ',
    'ฝ่ายบัญชี',
    'ฝ่ายการเงิน',
    'ฝ่ายบุคคล',
    'ฝ่ายการตลาด',
    'ฝ่ายขาย'
  ];

  useEffect(() => {
    fetchInventoryItems();
    generateWithdrawNumber();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/inventory-items');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const generateWithdrawNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    const withdrawNumber = `WD-${year}${month}${day}-${random}`;
    setFormData(prev => ({ ...prev, withdrawNumber }));
  };

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
    
    if (field === 'name') {
      const inventoryItem = items.find(item => item.name === value);
      newItems[index].available = inventoryItem ? parseInt(inventoryItem.quantity) : 0;
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: '', available: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.requester || !formData.department || !formData.reason) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return false;
    }

    for (const item of formData.items) {
      if (!item.name || !item.quantity) {
        alert('กรุณากรอกข้อมูลรายการให้ครบถ้วน');
        return false;
      }

      if (parseInt(item.quantity) > item.available) {
        alert(`จำนวนที่เบิก "${item.name}" เกินจำนวนในคลัง`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      console.log('Submitting withdrawal data:', formData); // เพิ่ม log เพื่อตรวจสอบข้อมูล
      
      const response = await fetch('http://localhost:3000/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit withdrawal request');
      }

      const result = await response.json();
      console.log('Withdrawal response:', result); // เพิ่ม log เพื่อตรวจสอบการตอบกลับ

      alert('ส่งคำขอเบิกเรียบร้อยแล้ว');
      // Reset form
      setFormData({
        withdrawNumber: '',
        date: new Date().toISOString().split('T')[0],
        requester: '',
        department: '',
        items: [{ name: '', quantity: '', available: 0 }],
        reason: '',
        status: 'pending'
      });
      generateWithdrawNumber();
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      alert('เกิดข้อผิดพลาดในการส่งคำขอเบิก');
    }
  };

  return (
    <div className="withdraw-container">
      <h2 className="text-xl font-medium mb-4">เบิกจ่ายพัสดุ</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">เลขที่ใบเบิก</label>
            <input
              type="text"
              value={formData.withdrawNumber}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">วันที่</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ผู้ขอเบิก</label>
            <input
              type="text"
              name="requester"
              value={formData.requester}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">แผนก</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              <option value="">เลือกแผนก</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">รายการที่ขอเบิก</label>
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-2">
              <div>
                <select
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm"
                  required
                >
                  <option value="">เลือกพัสดุ</option>
                  {items.map(inventoryItem => (
                    <option key={inventoryItem.id} value={inventoryItem.name}>
                      {inventoryItem.name} (คงเหลือ: {inventoryItem.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  placeholder="จำนวน"
                  className="block w-full rounded-md border-gray-300 shadow-sm"
                  min="1"
                  max={item.available}
                  required
                />
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            เพิ่มรายการ
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">เหตุผลการขอเบิก</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ส่งคำขอเบิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default WithDraw;