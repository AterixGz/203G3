import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PR from './pages/PR/PR';
import PO from './pages/PO';
import AP_PR from './pages/Approve_PR/Approve_PR';
import RFA from './pages/RFA/registerFixedAssets'
import AP from './pages/AP';
import PAY from './pages/pay';

// Create a new component for the sidebar navigation
const SidebarNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/pr', icon: 'fas fa-file-alt', label: 'ใบขอซื้อ' },
    { path: '/ap_pr', icon: 'fas fa-file-alt', label: 'อนุมัติใบขอซื้อ' },
    { path: '/po', icon: 'fas fa-shopping-cart', label: 'ใบสั่งซื้อ' },
    { path: '/rfa', icon: 'fas fa-check-circle', label: 'ขึ้นทะเบียนสินทรัพย์ถาวร' },
    { path: '/ap', icon: 'fas fa-check-circle', label: 'ดูยอดคงเหลือเจ้าหนี้' },
    { path: '/pay', icon: 'fas fa-check-circle', label: 'จ่ายเงิน' },
  ];

  return (
    <nav className="mt-4">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center px-6 py-3 transition-colors ${
            location.pathname === item.path
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
          }`}
        >
          <i className={`${item.icon} text-xl w-8`}></i>
          <span className="font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

function App() {
  return (  
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          {/* Fixed Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 text-center">
            <div className="p-4 border-b border-gray-200 ">
              <h2 className="text-2xl font-bold">PMS 7-2</h2>
            </div>
            <SidebarNav />
          </aside>

          {/* Main Content with left margin to prevent sidebar overlap */}
          <main className="flex-1 ml-64">

            <div className="p-6">
              <Routes>
                <Route path="/pr" element={<PR />} />
                <Route path="/po" element={<PO />} />
                <Route path="/ap_pr" element={<AP_PR />} />
                <Route path="/rfa" element={<RFA />} />
                <Route path="/ap" element={<AP />} />
                <Route path="/pay" element={<PAY />} />
                <Route path="/" element={
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PR001</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Purchase Request</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Office Supplies</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                Pending
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-04-03</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PO002</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Purchase Order</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">IT Equipment</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                Approved
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2025-04-02</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                } />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;