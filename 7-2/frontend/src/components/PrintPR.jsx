import React, { useEffect, useState } from 'react';

const PrintPR = ({ prNumber }) => {
  const [prData, setPrData] = useState(null);

  useEffect(() => {
    // ดึงข้อมูล PR จาก API
    const fetchPRData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/pr/${prNumber}`);
        const data = await response.json();
        setPrData(data);
        // เรียกคำสั่งพิมพ์อัตโนมัติเมื่อโหลดข้อมูลเสร็จ
        if (data) setTimeout(() => window.print(), 500);
      } catch (error) {
        console.error('Error fetching PR data:', error);
      }
    };

    fetchPRData();
  }, [prNumber]);

  if (!prData) return <div>Loading...</div>;

  const totalAmount = prData.items.reduce((sum, item) => 
    sum + (Number(item.price) * Number(item.quantity)), 0);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* หัวกระดาษ */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">ใบขอซื้อ (Purchase Request)</h1>
        <p className="text-xl">เลขที่: {prData.prNumber}</p>
      </div>

      {/* ข้อมูลทั่วไป */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>วันที่:</strong> {new Date(prData.date).toLocaleDateString('th-TH')}</p>
          <p><strong>ผู้ขอ:</strong> {prData.requester}</p>
          <p><strong>แผนก:</strong> {prData.department}</p>
        </div>
        <div>
          <p><strong>วัตถุประสงค์:</strong> {prData.purpose}</p>
          <p><strong>สถานะ:</strong> {prData.status}</p>
          <p><strong>ผู้อนุมัติ:</strong> {prData.approver || '-'}</p>
        </div>
      </div>

      {/* ตารางรายการสินค้า */}
      <table className="w-full mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ลำดับ</th>
            <th className="border p-2">รายการ</th>
            <th className="border p-2">จำนวน</th>
            <th className="border p-2">หน่วย</th>
            <th className="border p-2">ราคา/หน่วย</th>
            <th className="border p-2">รวมเงิน</th>
          </tr>
        </thead>
        <tbody>
          {prData.items.map((item, index) => (
            <tr key={index}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2 text-right">{item.quantity}</td>
              <td className="border p-2">{item.unit}</td>
              <td className="border p-2 text-right">฿{Number(item.price).toLocaleString()}</td>
              <td className="border p-2 text-right">
                ฿{(Number(item.price) * Number(item.quantity)).toLocaleString()}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="5" className="border p-2 text-right font-bold">รวมทั้งสิ้น</td>
            <td className="border p-2 text-right font-bold">฿{totalAmount.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      {/* ส่วนลงนาม */}
      <div className="grid grid-cols-3 gap-8 mt-16">
        <div className="text-center">
          <div className="border-t pt-2">ผู้ขอซื้อ</div>
          <div>{prData.requester}</div>
          <div>วันที่: {new Date(prData.date).toLocaleDateString('th-TH')}</div>
        </div>
        <div className="text-center">
          <div className="border-t pt-2">ผู้ตรวจสอบ</div>
          <div>_________________</div>
          <div>วันที่: _____/_____/_____</div>
        </div>
        <div className="text-center">
          <div className="border-t pt-2">ผู้อนุมัติ</div>
          <div>{prData.approver || '_________________'}</div>
          <div>วันที่: {prData.approvalDate ? new Date(prData.approvalDate).toLocaleDateString('th-TH') : '_____/_____/_____'}</div>
        </div>
      </div>
    </div>
  );
};

export default PrintPR;