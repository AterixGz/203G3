import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';

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