import { useState } from 'react'
import PurchaseOrder from './PurchaseOrder/PurchaseOrder'
import Requisition from "./Requisition/Requisition"
import POReceipt from './POReceipt/POReceipt'
import Invoice from './Invoice/Invoice'
import ApBalance from './Apbalance/Apbalance'
import Payment from './Payment/Payment'
import ApBalanceAfter from './Apbalanceafter/Apbalanceafter'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('requisition')

  const renderContent = () => {
    switch(currentPage) {
      case 'requisition':
        return <Requisition />
      case 'purchaseOrder':
        return <PurchaseOrder />
      case 'poReceipt':
        return <POReceipt />
      case 'invoice':
        return <Invoice />
      case 'apBalance':
        return <ApBalance />
      case 'payment':
        return <Payment />
      case 'apBalanceAfter':
        return <ApBalanceAfter />
      default:
        return <Requisition />
    }
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <nav className="nav-menu">
          <button 
            className={`nav-item ${currentPage === 'requisition' ? 'active' : ''}`}
            onClick={() => setCurrentPage('requisition')}
          >
            📝 ใบขอซื้อ
          </button>
          <button 
            className={`nav-item ${currentPage === 'purchaseOrder' ? 'active' : ''}`}
            onClick={() => setCurrentPage('purchaseOrder')}
          >
            📋 ใบสั่งซื้อ
          </button>
          <button 
            className={`nav-item ${currentPage === 'poReceipt' ? 'active' : ''}`}
            onClick={() => setCurrentPage('poReceipt')}
          >
            📦 ใบรับสินค้า
          </button>
          <button 
            className={`nav-item ${currentPage === 'invoice' ? 'active' : ''}`}
            onClick={() => setCurrentPage('invoice')}
          >
            🧾 ใบแจ้งหนี้
          </button>
          <button 
            className={`nav-item ${currentPage === 'apBalance' ? 'active' : ''}`}
            onClick={() => setCurrentPage('apBalance')}
          >
            💰 ยอดคงเหลือเจ้าหนี้
          </button>
          <button 
            className={`nav-item ${currentPage === 'payment' ? 'active' : ''}`}
            onClick={() => setCurrentPage('payment')}
          >
            💸 การจ่ายเงิน
          </button>
          <button 
            className={`nav-item ${currentPage === 'apBalanceAfter' ? 'active' : ''}`}
            onClick={() => setCurrentPage('apBalanceAfter')}
          >
            📊 ยอดคงเหลือหลังจ่าย
          </button>
        </nav>
      </aside>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
