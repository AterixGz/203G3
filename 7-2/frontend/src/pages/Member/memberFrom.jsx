import React from 'react';
import './member.css';

const MemberForm = ({ isEdit, member, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: member?.name || '',
    username: member?.username || '',
    password: member?.password || '',
    role: member?.role || 'user',
  });

  const roles = ['admin', 'purchasing', 'finance', 'management', "itHead", "itAdmin", "it"];

  const handleSubmit = (e) => {
    e.preventDefault();

    // ตรวจสอบข้อมูลก่อนส่ง
    if (!formData.name || !formData.username || !formData.password || !formData.role) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    onSubmit(formData); // ส่งข้อมูลไปยังฟังก์ชัน handleAddMember หรือ handleEditMember
  };

  return (
    <div className="fixed inset-0 background-sudHod flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isEdit ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* ชื่อ-นามสกุล */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* ชื่อผู้ใช้ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            {/* รหัสผ่าน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {/* บทบาท */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                บทบาท
              </label>
              <select
                className="w-full p-2 border rounded"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="">เลือกบทบาท</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มสมาชิก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;