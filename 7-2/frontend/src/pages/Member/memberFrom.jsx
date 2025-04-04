import React from 'react';
import './member.css'

const MemberForm = ({ isEdit, member, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    id: member?.id || '',
    name: member?.name || '',
    email: member?.email || '',
    department: member?.department || '',
    position: member?.position || '',
    userGroup: member?.userGroup || 'ผู้ใช้งานทั่วไป',
    status: member?.status || 'ใช้งาน',
  });

  const departments = ['จัดซื้อ', 'บัญชี', 'การเงิน', 'ผู้บริหาร'];
  const userGroups = ['ผู้ใช้งานทั่วไป', 'ผู้ดูแลระบบ', 'ผู้อนุมัติ'];
  const statuses = ['ใช้งาน', 'ไม่ได้ใช้งาน', 'รอการยืนยัน'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รหัสสมาชิก
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
                disabled={isEdit}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                แผนก
              </label>
              <select
                className="w-full p-2 border rounded"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                required
              >
                <option value="">เลือกแผนก</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ตำแหน่ง
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                กลุ่มผู้ใช้
              </label>
              <select
                className="w-full p-2 border rounded"
                value={formData.userGroup}
                onChange={(e) => setFormData({...formData, userGroup: e.target.value})}
                required
              >
                {userGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                สถานะ
              </label>
              <select
                className="w-full p-2 border rounded"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                required
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
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