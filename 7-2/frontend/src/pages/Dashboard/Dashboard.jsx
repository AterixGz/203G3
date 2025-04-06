import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaShoppingCart, FaMoneyBillWave, FaClipboardCheck, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    prCount: 0,
    poCount: 0,
    totalSpending: 0,
    pendingApprovals: 0,
    recentPRs: [],
    recentPOs: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ดึงข้อมูล PR
        const prResponse = await fetch('http://localhost:3000/api/pr');
        const prData = await prResponse.json();
        
        // ดึงข้อมูล PO
        const poResponse = await fetch('http://localhost:3000/api/purchase-orders');
        const poData = await poResponse.json();

        setDashboardData({
          prCount: prData.length,
          poCount: poData.length,
          totalSpending: poData.reduce((sum, po) => sum + (po.summary?.total || 0), 0),
          pendingApprovals: prData.filter(pr => !pr.status || pr.status === 'pending').length,
          recentPRs: prData.slice(-5).reverse(),
          recentPOs: poData.slice(-5).reverse()
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // สร้างการ์ดสรุปข้อมูล
  const summaryCards = [
    {
      title: 'ใบขอซื้อทั้งหมด (PR)',
      value: dashboardData.prCount,
      icon: FaFileAlt,
      color: 'bg-blue-500',
      link: '/pr'
    },
    {
      title: 'ใบสั่งซื้อทั้งหมด (PO)',
      value: dashboardData.poCount,
      icon: FaShoppingCart,
      color: 'bg-green-500',
      link: '/po'
    },
    {
      title: 'มูลค่าการสั่งซื้อรวม',
      value: `฿${dashboardData.totalSpending.toLocaleString()}`,
      icon: FaMoneyBillWave,
      color: 'bg-purple-500',
      link: '/ap'
    },
    {
      title: 'รายการรออนุมัติ',
      value: dashboardData.pendingApprovals,
      icon: FaClipboardCheck,
      color: 'bg-yellow-500',
      link: '/ap_pr'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* หัวข้อและการต้อนรับ */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ยินดีต้อนรับสู่ระบบจัดซื้อจัดจ้าง</h1>
        <p className="text-gray-600 mt-2">ระบบบริหารจัดการการจัดซื้อจัดจ้างแบบครบวงจร</p>
      </div>

      {/* การ์ดแสดงข้อมูลสรุป */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <Link key={index} to={card.link} className="transform transition-transform hover:-translate-y-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`${card.color} px-4 py-2`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* แสดงรายการล่าสุด */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* รายการ PR ล่าสุด */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">ใบขอซื้อล่าสุด (PR)</h2>
            <Link to="/pr" className="text-blue-600 hover:text-blue-700 text-sm">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-sm text-gray-700 border-b">
                <tr>
                  <th className="pb-3 text-left">เลขที่ PR</th>
                  <th className="pb-3 text-left">ผู้ขอ</th>
                  <th className="pb-3 text-left">สถานะ</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {dashboardData.recentPRs.map((pr) => (
                  <tr key={pr.prNumber} className="border-b">
                    <td className="py-2">{pr.prNumber}</td>
                    <td className="py-2">{pr.requester}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* รายการ PO ล่าสุด */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">ใบสั่งซื้อล่าสุด (PO)</h2>
            <Link to="/po" className="text-blue-600 hover:text-blue-700 text-sm">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-sm text-gray-700 border-b">
                <tr>
                  <th className="pb-3 text-left">เลขที่ PO</th>
                  <th className="pb-3 text-left">ผู้ขาย</th>
                  <th className="pb-3 text-right">มูลค่า</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {dashboardData.recentPOs.map((po) => (
                  <tr key={po.poNumber} className="border-b">
                    <td className="py-2">{po.poNumber}</td>
                    <td className="py-2">{po.vendorInfo?.name}</td>
                    <td className="py-2 text-right">
                      ฿{po.summary?.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;