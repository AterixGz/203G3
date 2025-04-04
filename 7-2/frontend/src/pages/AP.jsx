import React, { useState } from "react";

const FinancialDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Add toggle function
  const toggleRowExpansion = (index) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const transactions = [
    {
      id: "V-00125",
      type: "บัญชี ไทยพาณิชย์ จำกัด",
      number: "0-3456-7890-23-4",
      amount: 320000,
      percentage: 30,
      date: "10/2/2568",
      status: "ชำระเรียบร้อย",
    },
    {
      id: "V-00123",
      type: "บัญชี ธีรพัฒน์พงศ์ จำกัด",
      number: "0-1234-5678-01-2",
      amount: 245000,
      percentage: 30,
      date: "10/3/2568",
      status: "ชำระเรียบร้อย",
    },
    {
      id: "V-00127",
      type: "บัญชี เอเชียไอทีเซอร์วิส จำกัด",
      number: "0-5678-9012-45-6",
      amount: 165000,
      percentage: 30,
      date: "15/1/2568",
      status: "ไม่มีการชำระเงิน",
    },
    {
      id: "V-00124",
      type: "บัญชี เมตริกซ์ไซเบอร์ จำกัด",
      number: "0-2345-6789-32-3",
      amount: 78500,
      percentage: 45,
      date: "20/3/2568",
      status: "ชำระเรียบร้อย",
    },
    {
      id: "V-00126",
      type: "บัญชี อุดมการณ์ จำกัด",
      number: "0-4567-8912-34-5",
      amount: 42500,
      percentage: 15,
      date: "25/3/2568",
      status: "ชำระเรียบร้อย",
    },
  ];

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const agingData = [
    { range: "ทั้งหมด", amount: 373500, percentage: 42.68 },
    { range: "1-30 วัน", amount: 137500, percentage: 15.79 },
    { range: "31-60 วัน", amount: 170000, percentage: 19.54 },
    { range: "61-90 วัน", amount: 90000, percentage: 10.33 },
    { range: "มากกว่า 90 วัน", amount: 100000, percentage: 11.66 },
  ];

  return (
    <div className="bg-gray-50 p-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-800">
              ยอดคงเหลือเจ้าหนี้
            </h2>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">ยอดคงค้างยกไป</div>
            <div className="text-2xl font-semibold text-gray-900">
              {formatNumber(871000)} บาท
            </div>
            <div className="text-xs text-gray-500">รวม 5 รายการ</div>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">ยอดชำระระหว่างงวด</div>
            <div className="text-2xl font-semibold text-red-500">
              {formatNumber(457500)} บาท
            </div>
            <div className="text-xs text-gray-500">
              คิดเป็น 52.53% จากยอดคงค้าง
            </div>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">ยอดคงเหลือ</div>
            <div className="text-2xl font-semibold text-gray-900">
              {formatNumber(373500)} บาท
            </div>
            <div className="text-xs text-gray-500">
              คิดเป็น 42.88% จากยอดคงค้าง
            </div>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">
              เจ้าหนี้ที่ค้างชำระ
            </div>
            <div className="text-2xl font-semibold text-gray-900">4 ราย</div>
            <div className="text-xs text-gray-500">จาก 5 บริษัททั้งหมด</div>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4 mb-6">
          <h3 className="text-md font-medium text-gray-800 mb-4">
            การวิเคราะห์อายุหนี้ (Aging Analysis)
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            ข้อมูลแยกตามอายุการค้างชำระของหนี้
          </p>

          <div className="grid grid-cols-5 gap-4 mb-6">
            {agingData.map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className={`text-lg font-medium ${
                    index === 0 ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {formatNumber(item.amount)}
                </div>
                <div className="text-sm text-gray-500">{item.percentage}%</div>
                <div className="text-xs font-medium text-gray-700 mt-1">
                  {item.range}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 rounded p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">
                  การเปลี่ยนแปลงของยอดคงค้าง
                </p>
                <p className="text-xs text-gray-500">(ไม่มีข้อมูล)</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">
                  การคาดการณ์กระแสเงินสดจ่าย
                </p>
                <p className="text-xs text-gray-500">(ไม่มีข้อมูล)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4 mb-6">
          <h3 className="text-md font-medium text-gray-800 mb-4">
            รายการทั้งหมด
          </h3>

          <div className="flex justify-between mb-4">
            <div></div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหารายการ..."
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className="w-4 h-4 absolute left-2 top-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="relative">
                <select className="pl-4 pr-8 py-2 border border-gray-300 rounded text-sm appearance-none">
                  <option>ล่าสุด</option>
                  <option>เก่าสุด</option>
                  <option>ยอดสูงสุด</option>
                  <option>ยอดต่ำสุด</option>
                </select>
                <svg
                  className="w-4 h-4 absolute right-2 top-3 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <button className="p-2 border border-gray-300 rounded">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </button>
            </div>
          </div>

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
                              expandedRows.has(index) ? 'rotate-90' : ''
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
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'ชำระเรียบร้อย' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                    {expandedRows.has(index) && (
                      <tr className="bg-gray-50">
                        <td colSpan="7" className="py-4 px-8 border-b">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">รายละเอียดเจ้าหนี้</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="text-gray-600">ชื่อบริษัท:</span> {transaction.type}</p>
                                <p><span className="text-gray-600">เลขประจำตัวผู้เสียภาษี:</span> {transaction.number}</p>
                                <p><span className="text-gray-600">ประเภทธุรกิจ:</span> บริษัทจำกัด</p>
                                <p><span className="text-gray-600">เงื่อนไขการชำระเงิน:</span> 30 วัน</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">รายการเอกสาร</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="text-gray-600">เลขที่ใบแจ้งหนี้:</span> INV-2024-{transaction.id}</p>
                                <p><span className="text-gray-600">วันที่ใบแจ้งหนี้:</span> {transaction.date}</p>
                                <p><span className="text-gray-600">ยอดชำระ:</span> {formatNumber(transaction.amount)} บาท</p>
                                <p><span className="text-gray-600">ยอดภาษีมูลค่าเพิ่ม:</span> {formatNumber(transaction.amount * 0.07)} บาท</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                              ดูใบแจ้งหนี้
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700">
                              บันทึกการชำระเงิน
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
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
