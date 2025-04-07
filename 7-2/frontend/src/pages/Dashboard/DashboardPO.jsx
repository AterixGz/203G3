import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaPrint } from 'react-icons/fa';

const DashboardPO = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPOs: 0,
    pendingPOs: 0,
    completedPOs: 0,
    totalAmount: 0,
    recentPOs: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/purchase-orders');
        const data = await response.json();
        
        // Calculate dashboard metrics
        const totalPOs = data.length;
        const pendingPOs = data.filter(po => po.status === 'pending').length;
        const completedPOs = data.filter(po => po.status === 'completed').length;
        const totalAmount = data.reduce((sum, po) => sum + po.summary.total, 0);

        // Get most recent POs
        const recentPOs = [...data].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);

        setDashboardData({
          totalPOs,
          pendingPOs,
          completedPOs,
          totalAmount,
          recentPOs
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePrint = (po) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ใบสั่งซื้อ - ${po.poNumber}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @page { 
              size: A4;
              margin: 0.8cm; 
            }
            body { 
              font-family: 'Sarabun', sans-serif;
              font-size: 16px;
              line-height: 1.5;
            }
            table { 
              font-size: 14px;
            }
            .compact-cell {
              padding: 8px !important;
            }
            .header {
              margin-bottom: 0.8cm;
            }
            .content {
              padding: 0 0.8cm;
            }
            h1 {
              font-size: 28px !important;
              margin-bottom: 8px !important;
            }
            .text-base {
              font-size: 18px !important;
            }
            .text-sm {
              font-size: 16px !important;
            }
            .mb-1 {
              margin-bottom: 0.5rem !important;
            }
            .mb-2 {
              margin-bottom: 1rem !important;
            }
            .mt-4 {
              margin-top: 2rem !important;
            }
            .mt-6 {
              margin-top: 2.5rem !important;
            }
            .grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body class="p-4">
          <div class="max-w-4xl mx-auto bg-white">
            <!-- หัวกระดาษ -->
            <div class="text-center header">
              <h1 class="text-xl font-bold mb-1">ใบสั่งซื้อ (Purchase Order)</h1>
              <p class="text-base">เลขที่: ${po.poNumber}</p>
            </div>

            <div class="content">
              <!-- ข้อมูลทั่วไปและผู้ขาย -->
              <div class="grid grid-cols-2 gap-2 text-sm mb-2">
                <div>
                  <p class="mb-1"><strong>วันที่:</strong> ${new Date(po.poDate).toLocaleDateString('th-TH')}</p>
                  <p class="mb-1"><strong>อ้างอิง PR:</strong> ${po.prReference}</p>
                  <p class="mb-1"><strong>สถานะ:</strong> ${po.status}</p>
                </div>
                <div>
                  <p class="mb-1"><strong>ผู้ขาย:</strong> ${po.vendorInfo.name}</p>
                  <p class="mb-1"><strong>เลขประจำตัวผู้เสียภาษี:</strong> ${po.vendorInfo.taxId}</p>
                  <p class="mb-1"><strong>โทร:</strong> ${po.vendorInfo.phone}</p>
                </div>
              </div>

              <!-- ตารางรายการสินค้า -->
              <table class="w-full border-collapse mb-2">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="border compact-cell text-left w-8">ลำดับ</th>
                    <th class="border compact-cell text-left">รายการ</th>
                    <th class="border compact-cell text-right w-16">จำนวน</th>
                    <th class="border compact-cell text-left w-16">หน่วย</th>
                    <th class="border compact-cell text-right w-24">ราคา/หน่วย</th>
                    <th class="border compact-cell text-right w-24">รวมเงิน</th>
                  </tr>
                </thead>
                <tbody>
                  ${po.items.map((item, index) => `
                    <tr>
                      <td class="border compact-cell text-center">${index + 1}</td>
                      <td class="border compact-cell">${item.name}</td>
                      <td class="border compact-cell text-right">${item.quantity}</td>
                      <td class="border compact-cell">${item.unit}</td>
                      <td class="border compact-cell text-right">฿${Number(item.price || item.pricePerUnit).toLocaleString()}</td>
                      <td class="border compact-cell text-right">฿${(Number(item.price || item.pricePerUnit) * Number(item.quantity)).toLocaleString()}</td>
                    </tr>
                  `).join('')}
                  <tr>
                    <td colspan="5" class="border compact-cell text-right font-bold">ยอดรวม</td>
                    <td class="border compact-cell text-right font-bold">฿${po.summary.subtotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colspan="5" class="border compact-cell text-right font-bold">ภาษีมูลค่าเพิ่ม 7%</td>
                    <td class="border compact-cell text-right font-bold">฿${po.summary.vat.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colspan="5" class="border compact-cell text-right font-bold">รวมทั้งสิ้น</td>
                    <td class="border compact-cell text-right font-bold">฿${po.summary.total.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <!-- เงื่อนไขการสั่งซื้อ -->
              <div class="text-sm mb-2">
                <table class="w-full border-collapse">
                  <tr>
                    <td class="border compact-cell"><strong>วิธีการชำระเงิน:</strong> ${po.terms.paymentMethod || '-'}</td>
                    <td class="border compact-cell"><strong>วันที่นัดส่ง:</strong> ${po.terms.deliveryDate}</td>
                  </tr>
                  <tr>
                    <td class="border compact-cell"><strong>สถานที่ส่งมอบ:</strong> ${po.terms.deliveryLocation || '-'}</td>
                    <td class="border compact-cell"><strong>หมายเหตุ:</strong> ${po.terms.notes || '-'}</td>
                  </tr>
                </table>
              </div>

              <!-- ลายเซ็น -->
              <div class="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div class="text-center">
                  <div class="border-t border-gray-300 pt-1">ผู้สั่งซื้อ</div>
                  <div class="mt-6">__________________</div>
                  <div class="mt-1">วันที่: ____/____/____</div>
                </div>
                <div class="text-center">
                  <div class="border-t border-gray-300 pt-1">ผู้อนุมัติ</div>
                  <div class="mt-6">__________________</div>
                  <div class="mt-1">วันที่: ____/____/____</div>
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => window.print(), 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const stats = [
    { 
      title: 'จำนวน PO ทั้งหมด', 
      value: dashboardData.totalPOs, 
      icon: FaFileAlt, 
      color: 'bg-blue-600' 
    },
    { 
      title: 'PO ที่รอดำเนินการ', 
      value: dashboardData.pendingPOs, 
      icon: FaTimesCircle, 
      color: 'bg-yellow-500' 
    },
    { 
      title: 'PO ที่เสร็จสิ้น', 
      value: dashboardData.completedPOs, 
      icon: FaCheckCircle, 
      color: 'bg-green-600' 
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard ใบสั่งซื้อ (PO)</h1>
        <p className="text-gray-500">ภาพรวมใบสั่งซื้อ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <h2 className="text-lg font-semibold">รายการใบสั่งซื้อล่าสุด</h2>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500">
                <th className="pb-3">เลขที่ PO</th>
                <th className="pb-3">อ้างอิง PR</th>
                <th className="pb-3">ผู้ขาย</th>
                <th className="pb-3">มูลค่ารวม</th>
                <th className="pb-3">สถานะ</th>
                <th className="pb-3">วันที่สร้าง</th>
                <th className="pb-3">พิมพ์</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.recentPOs.map((po) => (
                <tr key={po.poNumber} className="text-sm text-gray-700">
                  <td className="py-3">{po.poNumber}</td>
                  <td className="py-3">{po.prReference}</td>
                  <td className="py-3">{po.vendorInfo.name}</td>
                  <td className="py-3">฿{po.summary.total.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      po.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {po.status === 'completed' ? 'เสร็จสิ้น' : 'รอดำเนินการ'}
                    </span>
                  </td>
                  <td className="py-3">{new Date(po.createdAt).toLocaleDateString('th-TH')}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handlePrint(po)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                      title="พิมพ์ใบสั่งซื้อ"
                    >
                      <FaPrint className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPO;