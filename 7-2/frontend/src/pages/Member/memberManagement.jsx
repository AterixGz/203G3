import React, { useState, useEffect } from "react";
import MemberForm from "./memberFrom";

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMember, setEditMember] = useState(null);

  // ดึงข้อมูลสมาชิกจาก Backend
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/members");
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        } else {
          console.error("Failed to fetch members");
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  // เพิ่มสมาชิกใหม่
  const handleAddMember = async (newMember) => {
    try {
      const response = await fetch("http://localhost:3000/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });
  
      if (response.ok) {
        const result = await response.json();
        setMembers((prev) => [...prev, result.member]); // เพิ่มสมาชิกใหม่ใน state
        setShowForm(false); // ปิดฟอร์ม
        alert("เพิ่มสมาชิกสำเร็จ");
      } else {
        const errorData = await response.json();
        alert(`เกิดข้อผิดพลาด: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  // แก้ไขข้อมูลสมาชิก
  const handleEditMember = async (updatedMember) => {
    try {
      // ตรวจสอบว่า updatedMember มีข้อมูลที่จำเป็นครบถ้วน
      if (!updatedMember.id || !updatedMember.username || !updatedMember.name || !updatedMember.role) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }
  
      const response = await fetch(
        `http://localhost:3000/api/members/${updatedMember.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMember),
        }
      );
  
      if (response.ok) {
        const result = await response.json();
        setMembers((prev) =>
          prev.map((member) =>
            member.id === updatedMember.id ? result.member : member
          )
        );
        setEditMember(null);
        alert("แก้ไขข้อมูลสำเร็จ");
      } else {
        const errorData = await response.json();
        alert(`เกิดข้อผิดพลาด: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error editing member:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  // ลบสมาชิก
  const handleDeleteMember = async (id) => {
    if (window.confirm("คุณต้องการลบสมาชิกนี้ใช่หรือไม่?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/members/${id}`, // ตรวจสอบว่า id เป็นตัวเลข
          {
            method: "DELETE",
          }
        );
  
        if (response.ok) {
          // ลบสมาชิกออกจาก state
          setMembers((prev) => prev.filter((member) => member.id !== id));
          alert("ลบสมาชิกสำเร็จ");
        } else {
          const errorData = await response.json();
          alert(`เกิดข้อผิดพลาด: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error deleting member:", error);
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-800">
          จัดการสมาชิกและสิทธิ์การใช้งาน
        </h1>
        <p className="text-sm text-gray-600">
          จัดการสมาชิก กลุ่มผู้ใช้ และสิทธิ์การใช้งานระบบ
        </p>
      </div>

      <div className="bg-white rounded shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">รายชื่อสมาชิก</h2>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-black text-white rounded flex items-center gap-2"
          >
            <span className="w-5 h-5 flex items-center justify-center text-white bg-transparent">
              +
            </span>
            เพิ่มสมาชิกใหม่
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="text-left border-b border-gray-300">
                <th className="py-3 px-4 font-medium text-sm text-gray-600">
                  รหัสสมาชิก
                </th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600">
                  ชื่อ-นามสกุล
                </th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600">
                  บทบาท
                </th>
                <th className="py-3 px-4 font-medium text-sm text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-gray-300 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{member.id}</td>
                  <td className="py-3 px-4">{member.name}</td>
                  <td className="py-3 px-4">{member.role}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setEditMember(member)}
                      className="text-blue-600 hover:underline"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-600 hover:underline ml-4"
                    >
                      ลบ
                    </button>
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