import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import PR from "./pages/PR/PR";
import PO from "./pages/PO";
import AP_PR from "./pages/Approve_PR/Approve_PR";
import RFA from "./pages/RFA/registerFixedAssets";
import AP from "./pages/AP";
import PAY from "./pages/pay";
import MEMBER from "./pages/Member/memberManagement";
import Login from "./pages/Login/Login";

const SidebarNav = ({ role }) => {
  const location = useLocation();

  // กำหนดสิทธิ์การเข้าถึงสำหรับแต่ละ Role
  const navItems = [
    { path: "/", icon: "fas fa-home", label: "Dashboard", roles: ["admin", "purchasing", "finance", "management"] },
    { path: "/pr", icon: "fas fa-file-alt", label: "ใบขอซื้อ", roles: ["admin", "purchasing"] },
    { path: "/ap_pr", icon: "fas fa-file-alt", label: "อนุมัติใบขอซื้อ", roles: ["admin", "management"] },
    { path: "/po", icon: "fas fa-shopping-cart", label: "ใบสั่งซื้อ", roles: ["admin", "purchasing"] },
    { path: "/rfa", icon: "fas fa-check-circle", label: "ขึ้นทะเบียนสินทรัพย์ถาวร", roles: ["admin", "finance"] },
    { path: "/ap", icon: "fas fa-check-circle", label: "ดูยอดคงเหลือเจ้าหนี้", roles: ["admin", "finance"] },
    { path: "/pay", icon: "fas fa-check-circle", label: "จ่ายเงิน", roles: ["admin", "finance"] },
    { path: "/member", icon: "fas fa-users", label: "จัดการสมาชิก", roles: ["admin"] },
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
                <Route path="/pr" element={user.role === "purchasing" || user.role === "admin" ? <PR /> : <Navigate to="/" />} />
                <Route path="/po" element={user.role === "purchasing" || user.role === "admin" ? <PO /> : <Navigate to="/" />} />
                <Route path="/ap_pr" element={user.role === "management" || user.role === "admin" ? <AP_PR /> : <Navigate to="/" />} />
                <Route path="/rfa" element={user.role === "finance" || user.role === "admin" ? <RFA /> : <Navigate to="/" />} />
                <Route path="/ap" element={user.role === "finance" || user.role === "admin" ? <AP /> : <Navigate to="/" />} />
                <Route path="/pay" element={user.role === "finance" || user.role === "admin" ? <PAY /> : <Navigate to="/" />} />
                <Route path="/member" element={user.role === "admin" ? <MEMBER /> : <Navigate to="/" />} />
                <Route path="/" element={<div>Dashboard</div>} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;