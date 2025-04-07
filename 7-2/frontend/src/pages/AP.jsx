import React, { useState, useEffect } from "react";

const FinancialDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());

  // ฟังก์ชันสำหรับเปิด/ปิดแถว
  const toggleRowExpansion = (index) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  // ดึงข้อมูลจาก API
  useEffect(() => {
    fetch("http://localhost:3000/api/purchase-orders")
      .then((response) => response.json())
      .then((data) => {
        // แปลงข้อมูลให้ตรงกับโครงสร้างที่ใช้ในตาราง
        const formattedData = data.map((po) => ({
          id: po.poNumber,
          type: po.vendorInfo.name,
          number: po.vendorInfo.taxId,
          amount: po.remainingBalance,
          date: po.poDate,
          status: po.status,
        }));
        setTransactions(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // คำนวณข้อมูลสรุป
  const totalOutstanding = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalPaid = transactions
    .filter((t) => t.status === "ชำระแล้ว")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalRemaining = totalOutstanding - totalPaid;
  const unpaidVendors = transactions.filter((t) => t.status !== "ชำระแล้ว").length;
  
  return (
    <div className="bg-gray-50 p-4 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* ส่วนแรก */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-800">ยอดคงเหลือเจ้าหนี้</h2>
            <p className="text-sm text-gray-500">
              ข้อมูลของเจ้าหนี้ที่มีการลงบัญชีแล้ว อาจจะยังไม่ได้ชำระเงิน
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded bg-white text-sm">
              เลือกรายงาน
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded bg-white text-sm">
              ดาวน์โหลด
            </button>
          </div>
        </div>
  
        {/* ส่วนที่สอง */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">ยอดคงค้างยกไป</div>
            <div className="text-2xl font-semibold text-gray-900">
              {formatNumber(totalOutstanding)} บาท
            </div>
            <div className="text-xs text-gray-500">รวม {transactions.length} รายการ</div>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">ยอดชำระระหว่างงวด</div>
            <div className="text-2xl font-semibold text-red-500">
              {formatNumber(totalPaid)} บาท
            </div>
            <div className="text-xs text-gray-500">
              คิดเป็น {((totalPaid / totalOutstanding) * 100).toFixed(2)}% จากยอดคงค้าง
            </div>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">ยอดคงเหลือ</div>
            <div className="text-2xl font-semibold text-gray-900">
              {formatNumber(totalRemaining)} บาท
            </div>
            <div className="text-xs text-gray-500">
              คิดเป็น {((totalRemaining / totalOutstanding) * 100).toFixed(2)}% จากยอดคงค้าง
            </div>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">เจ้าหนี้ที่ค้างชำระ</div>
            <div className="text-2xl font-semibold text-gray-900">{unpaidVendors} ราย</div>
            <div className="text-xs text-gray-500">จาก {transactions.length} บริษัททั้งหมด</div>
          </div>
        </div>
  
        {/* ส่วนที่สาม */}
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4 mb-6">
          <h3 className="text-md font-medium text-gray-800 mb-4">รายการทั้งหมด</h3>
          {/* ตาราง */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-300">
                  <th className="pb-2 font-medium"></th>
                  <th className="pb-2 font-medium">รหัสเจ้าหนี้</th>
                  <th className="pb-2 font-medium">ชื่อบัญชี</th>
                  <th className="pb-2 font-medium">เลขประจำตัวผู้เสียภาษี</th>
                  <th className="pb-2 font-medium">ยอดคงเหลือ บาท</th>
                  <th className="pb-2 font-medium">วันครบกำหนดชำระ</th>
                  <th className="pb-2 font-medium">สถานะการชำระ</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <React.Fragment key={index}>
                    <tr
                      className="border-b border-gray-300 text-sm hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleRowExpansion(index)}
                    >
                      <td className="py-3 pr-2">
                        <div className="p-1 hover:bg-gray-200 rounded transition-colors">
                          <svg
                            className={`w-4 h-4 transform transition-transform ${
                              expandedRows.has(index) ? "rotate-90" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="py-3">{transaction.id}</td>
                      <td className="py-3">{transaction.type}</td>
                      <td className="py-3">{transaction.number}</td>
                      <td className="py-3">{formatNumber(transaction.amount)} บาท</td>
                      <td className="py-3">{transaction.date}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === "ชำระแล้ว"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "ชำระบางส่วน"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-4 text-sm">
            <div className="text-gray-500">
              แสดง 5 รายการ จากทั้งหมด 5 รายการ
            </div>
            <div className="flex space-x-1">
              <button className="h-8 w-8 flex items-center justify-center rounded border border-gray-300 bg-gray-800 text-white">
                1
              </button>
              <button className="h-8 px-3 flex items-center justify-center rounded border border-gray-300 text-gray-700">
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
