import React, { useState } from 'react';

const PaymentRecord = () => {
  const [date, setDate] = useState('04/03/2025');
  const [amount, setAmount] = useState('85000');
  const [fileInfo, setFileInfo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selected, setSelected] = useState([true, false, false]);

  const invoices = [
    { id: 'INV-00456', date: '12/2/2568', dueDate: '31/3/2568', poNumber: 'PO-00123', totalAmount: 120000, remainAmount: 120000, status: 'ยังไม่ชำระ' },
    { id: 'INV-00432', date: '10/2/2568', dueDate: '17/3/2568', poNumber: 'PO-00120', totalAmount: 85000, remainAmount: 85000, status: 'ยังไม่ชำระ' },
    { id: 'INV-00410', date: '20/1/2568', dueDate: '19/2/2568', poNumber: 'PO-00115', totalAmount: 110000, remainAmount: 40000, status: 'ชำระบางส่วน' }
  ];

  const toggleSelect = (index) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);
  };

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="font-sans bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg font-medium text-gray-800 mb-1">บันทึกการชำระเงิน</h2>
        <p className="text-sm text-gray-500 mb-6">บันทึกข้อมูลการชำระเงินที่ได้รับและแนบหลักฐานการชำระเงิน</p>
        
        <div className="flex mb-4">
          <div className="flex-1 bg-white border-b-2 border-blue-500 text-center py-3 text-blue-600 font-medium text-sm">
            ข้อมูลการชำระเงิน
          </div>
          <div className="flex-1 bg-gray-100 text-center py-3 text-gray-500 text-sm">
            บันทึกการชำระเงิน
          </div>
        </div>
        
        <div className="bg-white rounded-md shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-gray-800 font-medium">V-00123</span>
              <span className="text-gray-600">บัญชี ธีรพัฒน์พงศ์ จำกัด</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full ml-2">เลือกรายการที่ต้องการชำระเงิน</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs border-b border-gray-200">
                  <th className="py-3 px-4 font-medium text-gray-600"></th>
                  <th className="py-3 px-4 font-medium text-gray-600">เลขที่ใบแจ้งหนี้</th>
                  <th className="py-3 px-4 font-medium text-gray-600">วันที่</th>
                  <th className="py-3 px-4 font-medium text-gray-600">วันครบกำหนด</th>
                  <th className="py-3 px-4 font-medium text-gray-600">อ้างอิง PO</th>
                  <th className="py-3 px-4 font-medium text-gray-600">จำนวนเงิน</th>
                  <th className="py-3 px-4 font-medium text-gray-600">ยอดคงเหลือ</th>
                  <th className="py-3 px-4 font-medium text-gray-600">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr key={index} className="border-b border-gray-200 last:border-b-0">
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selected[index]}
                        onChange={() => toggleSelect(index)}
                      />
                    </td>
                    <td className="py-3 px-4 text-blue-600 text-sm">{invoice.id}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{invoice.date}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{invoice.dueDate}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{invoice.poNumber}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{formatCurrency(invoice.totalAmount)} บาท</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{formatCurrency(invoice.remainAmount)} บาท</td>
                    <td className="py-3 px-4">
                      <div className={`px-4 py-1 rounded-full text-xs text-center w-28 ${
                        invoice.status === 'ยังไม่ชำระ' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : invoice.status === 'ชำระบางส่วน'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {invoice.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-600">จำนวนรายการที่เลือกทั้งหมด: <span className="font-medium">1 รายการ</span></div>
            <div>
              <div className="text-sm text-right text-gray-500">ยอดรวมที่ต้องชำระ:</div>
              <div className="text-lg font-semibold text-gray-800">{formatCurrency(85000)} บาท</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-md shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-md font-medium text-gray-800">ข้อมูลการชำระเงิน</h3>
            </div>
            <p className="text-xs text-gray-500 mt-1 pl-7">กรอกข้อมูลการชำระเงินและแนบหลักฐานการชำระ</p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ชำระเงิน <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="border border-gray-300 rounded w-full py-2 px-3 text-sm" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนเงินที่ชำระ (บาท) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded w-full py-2 px-3 text-sm" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">วิธีการชำระเงิน <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="border border-gray-300 rounded w-full py-2 pl-3 pr-10 text-sm appearance-none bg-white">
                  <option>โอนเงินผ่านบัญชี</option>
                  <option>เช็ค</option>
                  <option>เงินสด</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">บัญชีที่ชำระเงินเข้า <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select className="border border-gray-300 rounded w-full py-2 pl-3 pr-10 text-sm appearance-none bg-white">
                    <option>เลือกบัญชีธนาคาร</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เลขที่อ้างอิงการโอนเงิน <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded w-full py-2 px-3 text-sm" 
                  placeholder="เช่น 1234567890"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">ผู้ชำระเงินหรือบริษัท <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="border border-gray-300 rounded w-full py-2 pl-3 pr-10 text-sm appearance-none bg-white">
                  <option>ธนาคารกรุงไทย - 123-4-56789-0 - บัญชี ธีรพัฒน์พงศ์ จำกัด</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">แนบหลักฐานการโอนเงิน (ถ้ามี) <span className="text-red-500">*</span></label>
              <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                <div className="mb-3">
                  <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">ลากไฟล์มาวางที่นี่หรือ</p>
                <p className="text-xs text-gray-400">รองรับไฟล์ JPG, PNG, PDF หรือไฟล์ขนาด 5MB</p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ (ถ้ามีระบุ)</label>
              <textarea 
                className="border border-gray-300 rounded w-full py-2 px-3 text-sm" 
                rows="4"
                placeholder="ระบุรายละเอียดเพิ่มเติมที่ต้องการระบุ (ถ้ามี)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-between pt-4">
              <button className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 bg-white hover:bg-gray-50">
                ยกเลิก
              </button>
              <button className="px-6 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                บันทึกการชำระเงิน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRecord;