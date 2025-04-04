import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPRs: 0,
    approvedPRs: 0,
    rejectedPRs: 0,
    totalAmount: 0,
    recentPRs: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/pr');
        const data = await response.json();
        
        // Calculate dashboard metrics from real data
        const totalPRs = data.length;
        const approvedPRs = data.filter(pr => pr.status === 'approved').length;
        const rejectedPRs = data.filter(pr => pr.status === 'rejected').length;
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
          totalAmount,
          recentPRs
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { 
      title: 'จำนวน PR ทั้งหมด', 
      value: dashboardData.totalPRs, 
      icon: FaFileAlt, 
      color: 'bg-black' 
    },
    { 
      title: 'PR ที่อนุมัติแล้ว', 
      value: dashboardData.approvedPRs, 
      icon: FaCheckCircle, 
      color: 'bg-gray-700' 
    },
    { 
      title: 'PR ที่ไม่อนุมัติ', 
      value: dashboardData.rejectedPRs, 
      icon: FaTimesCircle, 
      color: 'bg-gray-800' 
    },
    { 
      title: 'มูลค่ารวมทั้งหมด', 
      value: `฿${dashboardData.totalAmount.toLocaleString()}`, 
      icon: FaMoneyBillWave, 
      color: 'bg-gray-900' 
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">ภาพรวมใบขอซื้อ (PR)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className={`p-3 rounded-lg ${stat.color} mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">รายการล่าสุด</h2>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500">
                <th className="pb-3">เลขที่ PR</th>
                <th className="pb-3">ผู้ขอ</th>
                <th className="pb-3">แผนก</th>
                <th className="pb-3">วัตถุประสงค์</th>
                <th className="pb-3">สถานะ</th>
                <th className="pb-3">วันที่</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData.recentPRs.map((pr) => (
                <tr key={pr.prNumber} className="text-sm text-gray-700">
                  <td className="py-3">{pr.prNumber}</td>
                  <td className="py-3">{pr.requester}</td>
                  <td className="py-3">{pr.department}</td>
                  <td className="py-3">{pr.purpose}</td>
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
                  <td className="py-3">{pr.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;