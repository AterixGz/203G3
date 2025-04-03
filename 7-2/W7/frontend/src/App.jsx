import { useState } from 'react'
import PurchaseOrder from './PurchaseOrder/PurchaseOrder'
import Requisition from "./Requisition/Requisition"
import POReceipt from './Poreceipt/poreceipt'
import Invoice from './Invoice/Invoice'
import ApBalance from './Apbalance/Apbalance'
import Payment from './Payment/Payment'
import DocumentViewer from './Documentviewer/Documentviewer'
import Sidebar from './bar/bar'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('requisition')
  const [showDocViewer, setShowDocViewer] = useState(false)

  const handleNavigation = (page) => {
    setCurrentPage(page)
    setShowDocViewer(false) // Close document viewer when navigating
  }

  const handleDocViewer = () => {
    setShowDocViewer(true)
    setCurrentPage('') // Clear current page when showing doc viewer
  }

  const renderContent = () => {
    if (showDocViewer) {
      return <DocumentViewer onClose={() => setShowDocViewer(false)} />
    }

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
      default:
        return <Requisition />
    }
  }

  return (
    <div className="layout">
      <Sidebar 
        currentPage={currentPage}
        showDocViewer={showDocViewer}
        onNavigate={handleNavigation}
        onDocViewer={handleDocViewer}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
