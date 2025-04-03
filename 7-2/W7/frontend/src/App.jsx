import { useState } from 'react';
import PurchaseOrder from './PurchaseOrder/PurchaseOrder';
import Requisition from "./Requisition/Requisition";
import POReceipt from './Poreceipt/poreceipt';
import Invoice from './Invoice/Invoice';
import ApBalance from './Apbalance/Apbalance';
import Payment from './Payment/Payment';
import DocumentViewer from './Documentviewer/Documentviewer';
import Sidebar from './bar/bar';
import Login from './Login/login';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('requisition');
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setShowDocViewer(false); // Close document viewer when navigating
  };

  const handleDocViewer = () => {
    setShowDocViewer(true);
    setCurrentPage(''); // Clear current page when showing doc viewer
  };

  const renderContent = () => {
    if (showDocViewer) {
      return <DocumentViewer onClose={() => setShowDocViewer(false)} />;
    }

    switch (currentPage) {
      case 'requisition':
        return <Requisition />;
      case 'purchaseOrder':
        return <PurchaseOrder />;
      case 'poReceipt':
        return <POReceipt />;
      case 'invoice':
        return <Invoice />;
      case 'apBalance':
        return <ApBalance />;
      case 'payment':
        return <Payment />;
      default:
        return <Requisition />;
    }
  };

  return (
    <Router>
      <div className="layout">
        {!isLoggedIn ? (
          <Routes>
            <Route path="/" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <>
            <Sidebar
              currentPage={currentPage}
              showDocViewer={showDocViewer}
              onNavigate={handleNavigation}
              onDocViewer={handleDocViewer}
            />
            <main className="main-content">
              <Routes>
                <Route path="/requisition" element={renderContent()} />
                <Route path="*" element={<Navigate to="/requisition" />} />
              </Routes>
            </main>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;