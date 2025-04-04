import React, { useState } from 'react';
import MemberForm from './memberFrom';

const MemberManagement = () => {
  const [members, setMembers] = useState([
    { id: 'U-00123', name: 'สมชาย โสดี', email: 'somchai@company.co.th', department: 'จัดซื้อ', position: 'ผู้จัดการฝ่ายจัดซื้อ', userGroup: 'ผู้ดูแลระบบ', status: 'ใช้งาน' },
    { id: 'U-00124', name: 'วิภา สุขศันต์', email: 'wipa@company.co.th', department: 'จัดซื้อ', position: 'เจ้าหน้าที่จัดซื้อ', userGroup: 'ผู้ใช้งานทั่วไป', status: 'ใช้งาน' },
    { id: 'U-00125', name: 'ประภา โสดี', email: 'prapa@company.co.th', department: 'บัญชี', position: 'ผู้จัดการฝ่ายบัญชี', userGroup: 'ผู้อนุมัติ', status: 'ใช้งาน' },
    { id: 'U-00126', name: 'มานี มีทรัพย์', email: 'manee@company.co.th', department: 'การเงิน', position: 'เจ้าหน้าที่การเงิน', userGroup: 'ผู้ใช้งานทั่วไป', status: 'ใช้งาน' },
    { id: 'U-00127', name: 'สมศักดิ์ ผู้จัดการ', email: 'somsak@company.co.th', department: 'ผู้บริหาร', position: 'ผู้อำนวยการ', userGroup: 'ผู้อนุมัติ', status: 'ไม่ได้ใช้งาน' },
    { id: 'U-00128', name: 'นิภา นักบัญชี', email: 'nipa@company.co.th', department: 'บัญชี', position: 'เจ้าหน้าที่บัญชี', userGroup: 'ผู้ใช้งานทั่วไป', status: 'รอการยืนยัน' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [showActions, setShowActions] = useState(null);

  const handleAddMember = (newMember) => {
    setMembers([...members, newMember]);
    setShowForm(false);
  };

  const handleEditMember = (updatedMember) => {
    setMembers(members.map(member => 
      member.id === updatedMember.id ? updatedMember : member
    ));
    setEditMember(null);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('คุณต้องการลบสมาชิกนี้ใช่หรือไม่?')) {
      setMembers(members.filter(member => member.id !== id));
    }
  };

  const getUserGroupBadge = (userGroup) => {
    switch (userGroup) {
      case 'ผู้ดูแลระบบ':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">ผู้ดูแลระบบ</span>;
      case 'ผู้ใช้งานทั่วไป':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">ผู้ใช้งานทั่วไป</span>;
      case 'ผู้อนุมัติ':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">ผู้อนุมัติ</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{userGroup}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ใช้งาน':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">ใช้งาน</span>;
      case 'ไม่ได้ใช้งาน':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">ไม่ได้ใช้งาน</span>;
      case 'รอการยืนยัน':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">รอการยืนยัน</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-800">จัดการสมาชิกและสิทธิ์การใช้งาน</h1>
        <p className="text-sm text-gray-600">จัดการสมาชิก กลุ่มผู้ใช้ และสิทธิ์การใช้งานระบบ</p>
      </div>

      {/* <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-base font-medium mb-2">รายชื่อสมาชิก</h2>
          </div>
        </div>
        <div className="flex-1 min-w-64">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-base font-medium mb-2">กลุ่มและสิทธิ์</h2>
          </div>
        </div>
        <div className="flex-1 min-w-64">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-base font-medium mb-2">สำเนาผู้ใช้งาน</h2>
            <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold absolute -top-1 -right-1">
              2
            </div>
          </div>
        </div>
      </div> */}

      <div className="bg-white rounded shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">รายชื่อสมาชิก</h2>
          <button 
            onClick={() => setShowForm(true)} 
            className="px-4 py-2 bg-black text-white rounded flex items-center gap-2"
          >
            <span className="w-5 h-5 flex items-center justify-center text-white bg-transparent">+</span>
            เพิ่มสมาชิกใหม่
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">จัดการสมาชิกในระบบ</p>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded"
                placeholder="ค้นหาสมาชิก..."
              />
            </div>
          </div>
          <div className="w-64">
            <div className="relative">
              <select className="block appearance-none w-full bg-white border border-gray-300 rounded py-2 px-3 pr-8">
                <option>แผนกทั้งหมด</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-64">
            <div className="relative">
              <select className="block appearance-none w-full bg-white border border-gray-300 rounded py-2 px-3 pr-8">
                <option>สถานะทั้งหมด</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="text-left border-b border-gray-300">
                <th className="py-3 px-4 font-medium text-sm text-gray-600">รหัสสมาชิก</th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600">ชื่อ-นามสกุล</th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600">อีเมล</th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600">แผนก</th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600">ตำแหน่ง</th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600">กลุ่มผู้ใช้</th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600">สถานะ</th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                      {member.id}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-blue-600">{member.name}</td>
                  <td className="py-3 px-4">{member.email}</td>
                  <td className="py-3 px-4">{member.department}</td>
                  <td className="py-3 px-4">{member.position}</td>
                  <td className="py-3 px-4">{getUserGroupBadge(member.userGroup)}</td>
                  <td className="py-3 px-4">{getStatusBadge(member.status)}</td>
                  <td className="py-3 px-4">
                    <div className="relative">
                      <button 
                        className="p-1"
                        onClick={() => setShowActions(showActions === member.id ? null : member.id)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showActions === member.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setEditMember(member);
                                setShowActions(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              แก้ไขข้อมูล
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteMember(member.id);
                                setShowActions(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              ลบสมาชิก
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <MemberForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddMember}
        />
      )}

      {editMember && (
        <MemberForm
          isEdit
          member={editMember}
          onClose={() => setEditMember(null)}
          onSubmit={handleEditMember}
        />
      )}
    </div>
  );
};

export default MemberManagement;