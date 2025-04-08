import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import PR from "./pages/PR";
import PO from "./pages/PO";
import AP_PR from "./pages/Approve_PR/Approve_PR";
import RFA from "./pages/RFA/registerFixedAssets";
import AP from "./pages/AP";
import PAY from "./pages/pay";
import MEMBER from "./pages/Member/memberManagement";
import Login from "./pages/Login/Login";
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardPR from './pages/Dashboard/DashboardPR';
import DashboardPO from './pages/Dashboard/DashboardPO';
import Cost from "./pages/inventory/inventory";
import AutoPR from "./pages/autoPR/autoPR";
import Inventory from "./pages/inventory/inventory";
import Vendor from "./pages/store/registerVendor";
import ViewVendor from "./pages/store/viewVendor";
import AP_PR2 from "./pages/Approve_PR2/Approve_PR2";
import BUDGET from "./pages/budget";
import WithDraw from './pages/withDraw/withDraw';
import ApproveWithdraw from './pages/Approve_WD/Approve_WD';

const SidebarNav = ({ role }) => {
  const location = useLocation();

  // กำหนดสิทธิ์การเข้าถึงสำหรับแต่ละ Role
  const navItems = [
    { path: "/", icon: "fas fa-home", label: "Dashboard", roles: ["admin", "management"] },
    { path: "/dbpr", icon: "fas fa-tachometer-alt", label: "DashboardPR", roles: ["admin", "it", "itHead"] },
    { path: "/dbpo", icon: "fas fa-tachometer-alt", label: "DashboardPO", roles: ["admin", "purchasing"] },
    { path: "/pr", icon: "fas fa-file-alt", label: "ใบขอซื้อ", roles: ["admin", "it"] },
    { path: "/ap_pr", icon: "fas fa-file-alt", label: "อนุมัติใบขอซื้อ", roles: ["admin", "management", "itHead"] },
    { path: "/ap_pr2", icon: "fas fa-file-alt", label: "อนุมัติใบขอซื้อ 2", roles: ["admin", "itHead"] },
    { path: "/po", icon: "fas fa-shopping-cart", label: "ใบสั่งซื้อ", roles: ["admin", "purchasing"] },
    { path: "/rfa", icon: "fas fa-check-circle", label: "ขึ้นทะเบียนสินทรัพย์ถาวร", roles: ["admin", "finance"] },
    { path: "/ap", icon: "fas fa-check-circle", label: "ดูยอดคงเหลือเจ้าหนี้", roles: ["admin", "finance"] },
    { path: "/pay", icon: "fas fa-check-circle", label: "จ่ายเงิน", roles: ["admin", "finance"] },
    { path: "/member", icon: "fas fa-users", label: "จัดการสมาชิก", roles: ["admin", "itAdmin"] },
    { path: "/cost", icon: "fas fa-dollar-sign", label: "คลังสินค้า", roles: ["admin", "finance", "management"] },
    { path: "/budget", icon: "fas fa-dollar-sign", label: "งบประมาณ", roles: ["admin", "management"] },
    { path: "/auto-pr", icon: "fas fa-sync", label: "ขอซื้ออัตโนมัติ", roles: ["admin", "purchasing"]  },
    { path: "/withdraw", icon: "fas fa-box-open", label: "เบิกจ่ายพัสดุ", roles: ["admin", "it", "finance"] },
    { path: "/approve-withdraw", icon: "fas fa-check-square", label: "อนุมัติการเบิกพัสดุ", roles: ["admin", "management", "itHead"] },
    { path: "/vendor", icon: "fas fa-store", label: "ลงทะเบียนผู้จําหน่าย", roles: ["admin", "purchasing"] },
    { path: "/viewvendor", icon: "fas fa-store", label: "ดูข้อมูลผู้จําหน่าย", roles: ["admin", "purchasing"] },
  ];

  // กรองเฉพาะเมนูที่ Role ปัจจุบันสามารถเข้าถึงได้
  const accessibleNavItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <nav className="mt-4">
      {accessibleNavItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center px-6 py-3 transition-colors ${
            location.pathname === item.path
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
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
  const [user, setUser] = useState(null);

  // ตรวจสอบสถานะการล็อกอิน
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    // หากผู้ใช้ไม่ได้ล็อกอิน ให้เปลี่ยนเส้นทางไปยังหน้า Login
    return <Login onLoginSuccess={(user) => setUser(user)} />;
  }

  const getDefaultRoute = () => {
    if (user.role === "it" || user.role === "itHead") {
      return <Navigate to="/dbpr" />;
    }
    if (user.role === "purchasing") {
      return <Navigate to="/dbpo" />;
    }
    return <Dashboard />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-center">PMS 7-2</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarNav role={user.role} />
            </div>
            <div className="border-t border-gray-200 bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                  <button
                    className="text-sm text-red-600 hover:text-red-800"
                    onClick={handleLogout}
                  >
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 ml-64">
            <div className="p-6">
              <Routes>
                <Route path="/" element={getDefaultRoute()} />
                <Route path="/pr" element={user.role === "it" || user.role === "admin" ? <PR /> : <Navigate to="/" />} />
                <Route path="/dbpr" element={user.role === "it"|| user.role ==="itHead" || user.role === "admin" ? <DashboardPR /> : <Navigate to="/" />} />
                <Route path="/po" element={user.role === "purchasing" || user.role === "admin" ? <PO /> : <Navigate to="/" />} />
                <Route path="/dbpo" element={user.role === "purchasing" || user.role === "admin" ? <DashboardPO /> : <Navigate to="/" />} />
                <Route 
                  path="/ap_pr" 
                  element={
                    ['admin', 'management', 'itHead'].includes(user.role) 
                      ? <AP_PR /> 
                      : <Navigate to="/" />
                  } 
                />
                <Route 
                  path="/ap_pr2" 
                  element={
                    ['admin', 'management', 'itHead'].includes(user.role) 
                      ? <AP_PR2 /> 
                      : <Navigate to="/" />
                  } 
                />
                <Route path="/rfa" element={user.role === "finance" || user.role === "admin" ? <RFA /> : <Navigate to="/" />} />
                <Route path="/ap" element={user.role === "finance" || user.role === "admin" ? <AP /> : <Navigate to="/" />} />
                <Route path="/pay" element={user.role === "finance" || user.role === "admin" ? <PAY /> : <Navigate to="/" />} />
                <Route path="/budget" element={user.role === "management" || user.role === "admin" ? <BUDGET /> : <Navigate to="/" />} />
                <Route path="/member" element={user.role === "itAdmin" || user.role === "admin" ? <MEMBER /> : <Navigate to="/" />} />
                <Route 
                  path="/cost" 
                  element={
                    ['finance', 'management', 'admin'].includes(user.role) 
                      ? <Cost /> 
                      : <Navigate to="/" />
                  } 
                />
                <Route 
                  path="/auto-pr" 
                  element={
                    user.role === "purchasing" || user.role === "admin" 
                      ? <AutoPR /> 
                      : <Navigate to="/" />
                  } 
                />
                <Route 
                  path="/inventory" 
                  element={
                    ['finance', 'management', 'admin'].includes(user.role) 
                      ? <Inventory /> 
                      : <Navigate to="/" />
                  } 
                />
                <Route path="/Vendor" element={user.role === "purchasing" || user.role === "admin" ? <Vendor /> : <Navigate to="/" />} />
                <Route path="/ViewVendor" element={user.role === "purchasing" || user.role === "admin" ? <ViewVendor /> : <Navigate to="/" />} />
                <Route 
                  path="/withdraw" 
                  element={
                    ['admin', 'it', 'finance'].includes(user.role) 
                      ? <WithDraw /> 
                      : <Navigate to="/" />
                  } 
                />
                <Route 
                  path="/approve-withdraw" 
                  element={
                    ['admin', 'management', 'itHead'].includes(user.role) 
                      ? <ApproveWithdraw /> 
                      : <Navigate to="/" />
                  } 
                />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;