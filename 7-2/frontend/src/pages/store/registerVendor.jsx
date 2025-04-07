import React, { useState } from 'react';

const CompanyInformationForm = () => {
  // สร้าง state สำหรับการแสดงสถานะการส่งข้อมูล
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  // สร้าง state สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    companyName: '',
    taxId: '',
    address: '',
    province: '',
    district: '',
    postalCode: '',
    contactName: '',
    position: '',
    phone: '',
    email: '',
    businessType: '',
    products: ''
  });

  // ฟังก์ชันสำหรับอัพเดทข้อมูลในฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // ฟังก์ชันสำหรับส่งข้อมูลไปยัง Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      // ส่งข้อมูลไปยัง API endpoint
      const response = await fetch('http://localhost:3000/api/company/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // ตรวจสอบสถานะการตอบกลับ
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }

      const result = await response.json();
      
      // แสดงสถานะการบันทึกสำเร็จ
      setSubmitStatus({
        success: true,
        message: 'บันทึกข้อมูลสำเร็จ'
      });

      // อาจจะทำการ redirect หรือ การกระทำอื่นๆ หลังบันทึกข้อมูลสำเร็จ
      console.log('บันทึกข้อมูลเรียบร้อย:', result);
      
      // สามารถเพิ่มการ redirect ไปยังหน้าถัดไปได้ที่นี่
      // window.location.href = '/next-page';
      
    } catch (error) {
      console.error('Error saving data:', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-1">ข้อมูลบริษัท</h2>
          <p className="text-gray-500 text-sm mb-4">กรุณากรอกข้อมูลบริษัทของคุณให้ครบถ้วน</p>
          
          {/* แสดงข้อความสถานะการส่งข้อมูล */}
          {submitStatus.message && (
            <div className={`p-3 mb-4 rounded ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitStatus.message}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-sm font-medium">ชื่อบริษัท</label>
              <input 
                type="text" 
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2" 
                placeholder="ชื่อบริษัทของคุณ"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">เลขประจำตัวผู้เสียภาษี</label>
              <input 
                type="text" 
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2" 
                placeholder="0-0000-00000-00-0"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">ที่อยู่</label>
            <textarea 
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 h-24" 
              placeholder="ที่อยู่บริษัทของคุณ"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-sm font-medium">จังหวัด</label>
              <input 
                type="text" 
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2" 
                placeholder="จังหวัด"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">อำเภอ/เขต</label>
              <input 
                type="text" 
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2" 
                placeholder="อำเภอ/เขต"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">รหัสไปรษณีย์</label>
              <input 
                type="text" 
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2" 
                placeholder="รหัสไปรษณีย์"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-sm font-medium">ชื่อผู้ติดต่อ</label>
              <input 
                type="text" 
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2" 
                placeholder="ชื่อผู้ติดต่อ"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">ตำแหน่ง</label>
              <input 
                type="text" 
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2" 
                placeholder="ตำแหน่ง"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-sm font-medium">เบอร์โทรศัพท์</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2" 
                placeholder="เบอร์โทรศัพท์"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">อีเมล</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2" 
                placeholder="อีเมล"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">ประเภทธุรกิจ</label>
            <input 
              type="text" 
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2" 
              placeholder="ประเภทธุรกิจของคุณ"
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium">สินค้า/บริการที่จำหน่าย</label>
            <textarea 
              name="products"
              value={formData.products}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 h-24" 
              placeholder="รายละเอียดสินค้าหรือบริการที่คุณจำหน่าย"
            ></textarea>
          </div>
          
          <div className="flex justify-between">
            
            <button
              type="submit"
              className={`py-2 px-10 rounded ${loading ? 'bg-gray-400' : 'bg-black'} text-white`}
              disabled={loading}
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyInformationForm;