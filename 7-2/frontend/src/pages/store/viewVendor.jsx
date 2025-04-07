import React, { useEffect, useState } from 'react';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ดึงข้อมูลจาก backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/company/list');
        if (!res.ok) {
          throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">รายการบริษัทที่บันทึกไว้</h2>

      {loading && <p>กำลังโหลดข้อมูล...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">ชื่อบริษัท</th>
                <th className="border px-3 py-2">ผู้ติดต่อ</th>
                <th className="border px-3 py-2">เบอร์โทร</th>
                <th className="border px-3 py-2">อีเมล</th>
                <th className="border px-3 py-2">จังหวัด</th>
                <th className="border px-3 py-2">วันที่บันทึก</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((item, index) => (
                <tr key={item.id}>
                  <td className="border px-3 py-2 text-center">{index + 1}</td>
                  <td className="border px-3 py-2">{item.companyName}</td>
                  <td className="border px-3 py-2">{item.contactName}</td>
                  <td className="border px-3 py-2">{item.phone}</td>
                  <td className="border px-3 py-2">{item.email}</td>
                  <td className="border px-3 py-2">{item.province}</td>
                  <td className="border px-3 py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">
                    ไม่มีข้อมูลบริษัท
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompanyList;