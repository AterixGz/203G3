import { useState, useEffect } from 'react';
import './Approve_WD.css';

const ApproveWithdraw = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');

  const statusOptions = [
    { value: "all", label: "สถานะทั้งหมด" },
    { value: "pending", label: "รอการอนุมัติ" },
    { value: "approved", label: "อนุมัติแล้ว" },
    { value: "rejected", label: "ไม่อนุมัติ" },
  ];

  const fetchWithdrawals = async () => {
    try {
      console.log('Fetching withdrawals...'); // เพิ่ม log
      const response = await fetch('http://localhost:3000/api/withdraw');
      if (!response.ok) throw new Error('Failed to fetch withdrawals');
      const data = await response.json();
      console.log('Fetched withdrawals:', data); // เพิ่ม log
      setWithdrawals(data);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  // เรียกใช้ฟังก์ชันเมื่อ component โหลด
  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleApprove = async () => {
    try {
      // อัพเดทสถานะการเบิก
      const withdrawalResponse = await fetch(`http://localhost:3000/api/withdraw/${selectedWithdrawal.withdrawNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' })
      });

      if (!withdrawalResponse.ok) {
        throw new Error('Failed to approve withdrawal');
      }

      // อัพเดทจำนวนสินค้าในคลัง
      for (const item of selectedWithdrawal.items) {
        const newQuantity = item.available - parseInt(item.quantity);
        
        const response = await fetch(`http://localhost:3000/inventory-items/update-by-name/${encodeURIComponent(item.name)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity: newQuantity
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to update inventory for ${item.name}`);
        }
      }

      alert('อนุมัติการเบิกเรียบร้อยแล้ว');
      fetchWithdrawals();
      setSelectedWithdrawal(null);
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      alert('เกิดข้อผิดพลาดในการอนุมัติ');
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/withdraw/${selectedWithdrawal.withdrawNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' })
      });

      if (!response.ok) throw new Error('Failed to reject withdrawal');

      alert('ปฏิเสธการเบิกเรียบร้อยแล้ว');
      fetchWithdrawals();
      setSelectedWithdrawal(null);
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      alert('เกิดข้อผิดพลาดในการปฏิเสธ');
    }
  };

  const handlePrint = () => {
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <div style="padding: 20px;">
        <h1 style="text-align: center; margin-bottom: 20px;">ใบเบิกพัสดุ</h1>
        <div style="margin-bottom: 20px;">
          <p>เลขที่: ${selectedWithdrawal.withdrawNumber}</p>
          <p>วันที่: ${new Date(selectedWithdrawal.date).toLocaleDateString('th-TH')}</p>
          <p>ผู้ขอเบิก: ${selectedWithdrawal.requester}</p>
          <p>แผนก: ${selectedWithdrawal.department}</p>
          <p>เหตุผลการขอเบิก: ${selectedWithdrawal.reason}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 8px; text-align: left;">รายการ</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">จำนวนที่ขอเบิก</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">จำนวนคงเหลือ</th>
            </tr>
          </thead>
          <tbody>
            ${selectedWithdrawal.items.map(item => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px;">${item.name}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.quantity}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.available}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; margin-top: 40px;">
          <div style="text-align: center; width: 200px;">
            <div>______________________</div>
            <p>ผู้ขอเบิก</p>
            <p>${selectedWithdrawal.requester}</p>
            <p>วันที่: ${new Date().toLocaleDateString('th-TH')}</p>
          </div>
          <div style="text-align: center; width: 200px;">
            <div>______________________</div>
            <p>ผู้อนุมัติ</p>
            <p>${selectedWithdrawal.status === 'approved' ? 'อนุมัติแล้ว' : 'รออนุมัติ'}</p>
            <p>วันที่: ${new Date().toLocaleDateString('th-TH')}</p>
          </div>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>ใบเบิกพัสดุ - ${selectedWithdrawal.withdrawNumber}</title>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // แก้ไข filteredWithdrawals
  const filteredWithdrawals = withdrawals.filter(wd => {
    const matchesSearch = (
      wd.withdrawNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wd.requester?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wd.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || wd.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isActionable = selectedWithdrawal?.status === 'pending';

  return (
    <div className="font-sans min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-1">อนุมัติการเบิกพัสดุ</h1>
          <p className="text-gray-500">ตรวจสอบและอนุมัติการเบิกพัสดุ</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="font-medium text-lg mb-4">รายการเบิกพัสดุ</h2>
            <p className="text-sm text-gray-500 mb-6">
              {filteredWithdrawals.length} รายการกำลังรออนุมัติ
            </p>

            {/* Search Box */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="ค้นหารายการเบิก..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative flex-grow mb-6">
              <select
                className="w-full appearance-none border border-gray-300 rounded-md pl-4 pr-10 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Withdrawal List */}
            <div className="space-y-4">
              {filteredWithdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.withdrawNumber}
                  className={`border ${
                    selectedWithdrawal?.withdrawNumber === withdrawal.withdrawNumber
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  } rounded-lg p-4 cursor-pointer`}
                  onClick={() => setSelectedWithdrawal(withdrawal)}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{withdrawal.withdrawNumber}</span>
                    <span
                      className={`text-sm ${
                        withdrawal.status === "approved"
                          ? "text-green-500"
                          : withdrawal.status === "rejected"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {withdrawal.status === "approved"
                        ? "อนุมัติแล้ว"
                        : withdrawal.status === "rejected"
                        ? "ไม่อนุมัติ"
                        : "รออนุมัติ"}
                    </span>
                  </div>
                  <div className="text-gray-700">ผู้ขอเบิก: {withdrawal.requester}</div>
                  <div className="text-gray-500 text-sm">
                    แผนก: {withdrawal.department}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2">
            {selectedWithdrawal ? (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium text-lg">
                    รายละเอียดการเบิก: {selectedWithdrawal.withdrawNumber}
                  </h2>
                  <button
                    onClick={handlePrint}
                    className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    พิมพ์ใบเบิกพัสดุ
                  </button>
                </div>
                <p className="text-gray-500 mb-4">
                  ผู้ขอเบิก: {selectedWithdrawal.requester}
                </p>
                <p className="text-gray-500 mb-4">
                  แผนก: {selectedWithdrawal.department}
                </p>
                <p className="text-gray-500 mb-4">
                  เหตุผลการขอเบิก: {selectedWithdrawal.reason}
                </p>

                {/* Items Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200 mt-6">
                  <table className="w-full border-collapse bg-white text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">รายการ</th>
                        <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">จำนวนที่ขอเบิก</th>
                        <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">จำนวนคงเหลือ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedWithdrawal.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-left text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 text-center text-gray-600">{item.quantity}</td>
                          <td className="px-6 py-4 text-center text-gray-600">{item.available}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                {isActionable && (
                  <div className="mt-6 flex space-x-4">
                    <button
                      className="w-24 px-4 py-2 rounded-md transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5"
                      onClick={handleApprove}
                    >
                      อนุมัติ
                    </button>
                    <button
                      className="w-24 px-4 py-2 rounded-md transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-100 hover:-translate-y-0.5"
                      onClick={handleReject}
                    >
                      ไม่อนุมัติ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">เลือกรายการเบิกเพื่อดูรายละเอียด</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveWithdraw;