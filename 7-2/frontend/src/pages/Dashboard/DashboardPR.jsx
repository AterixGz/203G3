import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaPrint } from 'react-icons/fa';

const DashboardPR = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPRs: 0,
    approvedPRs: 0,
    rejectedPRs: 0,
    pendingPRs: 0,
    totalAmount: 0,
    recentPRs: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/pr');
        const data = await response.json();
        
        // Calculate dashboard metrics
        const totalPRs = data.length;
        const approvedPRs = data.filter(pr => pr.status === 'approved').length;
        const rejectedPRs = data.filter(pr => pr.status === 'rejected').length;
        const pendingPRs = data.filter(pr => !pr.status || pr.status === 'pending').length;
        
        const totalAmount = data.reduce((sum, pr) => {
          return sum + (pr.items?.reduce((itemSum, item) => 
            itemSum + (Number(item.price) * Number(item.quantity)), 0) || 0)
        }, 0);

        // Get most recent PRs
        const recentPRs = [...data]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setDashboardData({
          totalPRs,
          approvedPRs,
          rejectedPRs,
          pendingPRs,
          totalAmount,
          recentPRs
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePrint = (pr) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title></title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @page { 
              size: A4;
              margin: 1cm;
            }
            body { 
              font-family: 'Sarabun', sans-serif;
              font-size: 16px;
              line-height: 1.5;
              -webkit-print-color-adjust: exact;
            }
            @media print {
              @page { 
                margin: 1cm;
              }
              body { 
                -webkit-print-color-adjust: exact;
                margin: 0;
              }
              .no-print { 
                display: none; 
              }
            }
            /* ซ่อนส่วนหัวและท้ายของ browser */
            @media print {
              @page { margin: 0; }
              body { margin: 1cm; }
              html, body {
                height: initial !important;
                overflow: initial !important;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
          <script>
            // ล้าง URL และ title ก่อนพิมพ์
            function clearHeaderAndPrint() {
              document.title = '';
              if (window.history && window.history.replaceState) {
                window.history.replaceState('', '', '');
              }
              setTimeout(() => {
                window.print();
              }, 100);
            }
          </script>
        </head>
        <body onload="clearHeaderAndPrint()">
          <div class="p-8 max-w-4xl mx-auto">
            <div class="text-center mb-8">
              <h1 class="text-2xl font-bold">ใบขอซื้อ (Purchase Request)</h1>
              <p class="text-xl">เลขที่: ${pr.prNumber}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p><strong>วันที่:</strong> ${new Date(pr.date).toLocaleDateString('th-TH')}</p>
                <p><strong>ผู้ขอ:</strong> ${pr.requester}</p>
                <p><strong>แผนก:</strong> ${pr.department}</p>
              </div>
              <div>
                <p><strong>วัตถุประสงค์:</strong> ${pr.purpose}</p>
                <p><strong>สถานะ:</strong> ${pr.status}</p>
                <p><strong>ผู้อนุมัติ:</strong> ${pr.approver || '-'}</p>
              </div>
            </div>

            <table class="w-full mb-6">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border p-2">ลำดับ</th>
                  <th class="border p-2">รายการ</th>
                  <th class="border p-2">จำนวน</th>
                  <th class="border p-2">หน่วย</th>
                  <th class="border p-2">ราคา/หน่วย</th>
                  <th class="border p-2">รวมเงิน</th>
                </tr>
              </thead>
              <tbody>
                ${pr.items.map((item, index) => `
                  <tr>
                    <td class="border p-2 text-center">${index + 1}</td>
                    <td class="border p-2">${item.name}</td>
                    <td class="border p-2 text-right">${item.quantity}</td>
                    <td class="border p-2">${item.unit}</td>
                    <td class="border p-2 text-right">฿${Number(item.price).toLocaleString()}</td>
                    <td class="border p-2 text-right">฿${(Number(item.price) * Number(item.quantity)).toLocaleString()}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td colspan="5" class="border p-2 text-right font-bold">รวมทั้งสิ้น</td>
                  <td class="border p-2 text-right font-bold">฿${pr.items.reduce((sum, item) => 
                    sum + (Number(item.price) * Number(item.quantity)), 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div class="grid grid-cols-3 gap-8 mt-16">
              <div class="text-center">
                <div class="border-t pt-2">ผู้ขอซื้อ</div>
                <div>${pr.requester}</div>
                <div>วันที่: ${new Date(pr.date).toLocaleDateString('th-TH')}</div>
              </div>
              <div class="text-center">
                <div class="border-t pt-2">ผู้ตรวจสอบ</div>
                <div>_________________</div>
                <div>วันที่: _____/_____/_____</div>
              </div>
              <div class="text-center">
                <div class="border-t pt-2">ผู้อนุมัติ</div>
                <div>${pr.approver || '_________________'}</div>
                <div>วันที่: ${pr.approvalDate ? new Date(pr.approvalDate).toLocaleDateString('th-TH') : '_____/_____/_____'}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // เขียนเนื้อหาและปิด document
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // ล้างข้อมูลที่ไม่ต้องการทันที
    printWindow.document.title = '';
    if (printWindow.history && printWindow.history.replaceState) {
      printWindow.history.replaceState('', '', '');
    }
  };

  const stats = [
    { 
      title: 'จำนวน PR ทั้งหมด', 
      value: dashboardData.totalPRs, 
      icon: FaFileAlt, 
      color: 'bg-blue-600' 
    },
    { 
      title: 'PR ที่อนุมัติแล้ว', 
      value: dashboardData.approvedPRs, 
      icon: FaCheckCircle, 
      color: 'bg-green-600' 
    },
    { 
      title: 'PR ที่ไม่อนุมัติ', 
      value: dashboardData.rejectedPRs, 
      icon: FaTimesCircle, 
      color: 'bg-red-600' 
    },
    { 
      title: 'PR ที่รออนุมัติ', 
      value: dashboardData.pendingPRs, 
      icon: FaTimesCircle, 
      color: 'bg-yellow-500' 
    },
    { 
      title: 'มูลค่ารวมทั้งหมด', 
      value: `฿${dashboardData.totalAmount.toLocaleString()}`, 
      icon: FaMoneyBillWave, 
      color: 'bg-purple-600' 
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard ใบขอซื้อ (PR)</h1>
        <p className="text-gray-500">ภาพรวมใบขอซื้อ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className={`inline-block p-3 rounded-lg ${stat.color} mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">รายการใบขอซื้อล่าสุด</h2>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500">
                <th className="pb-3">เลขที่ PR</th>
                <th className="pb-3">ผู้ขอ</th>
                <th className="pb-3">แผนก</th>
                <th className="pb-3">วัตถุประสงค์</th>
                <th className="pb-3">มูลค่ารวม</th>
                <th className="pb-3">สถานะ</th>
                <th className="pb-3">การอนุมัติ</th>
                <th className="pb-3">วันที่</th>
                <th className="pb-3">พิมพ์</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.recentPRs.map((pr) => {
                const totalAmount = pr.items.reduce((sum, item) => 
                  sum + (Number(item.price) * Number(item.quantity)), 0);
                  
                return (
                  <tr key={pr.prNumber} className="text-sm text-gray-700">
                    <td className="py-3">{pr.prNumber}</td>
                    <td className="py-3">{pr.requester}</td>
                    <td className="py-3">{pr.department}</td>
                    <td className="py-3">{pr.purpose}</td>
                    <td className="py-3">฿{totalAmount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pr.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : pr.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pr.status === 'approved' ? 'อนุมัติแล้ว' 
                          : pr.status === 'rejected' ? 'ไม่อนุมัติ' 
                          : 'รออนุมัติ'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pr.approver 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pr.approver ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
                      </span>
                    </td>
                    <td className="py-3">{pr.date}</td>
                    <td className="py-3">
                      <button
                        onClick={() => handlePrint(pr)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                        title="พิมพ์ใบขอซื้อ"
                      >
                        <FaPrint className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPR;