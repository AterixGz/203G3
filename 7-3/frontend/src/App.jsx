"use client"

import { useState, useEffect } from "react"
import "./App.css"
import Sidebar from "./components/Sidebar"
import PurchaseOrder from "./components/PurchaseOrder"
import InventoryReceiving from "./components/InventoryReceiving"
import UnitCostViewer from "./components/UnitCostViewer"
import InventoryDisbursement from "./components/InventoryDisbursement"
import AutoRequisition from "./components/AutoRequisition"
import NotificationBell from './components/NotificationBell'
import Login from './components/Login/Login'
import Approve from './components/Approve/Approve'
import List from './components/List/List'

function App() {
  const [activeTab, setActiveTab] = useState("purchase-order")
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session on component mount
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setActiveTab("purchase-order")
  }

  // Redirect non-management users if they try to access approve tab
  useEffect(() => {
    if (activeTab === 'approve' && user?.role !== 'management') {
      setActiveTab('purchase-order')
    }
  }, [activeTab, user])

  // Show loading state
  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  // Show login if no user
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // All authenticated users can see all tabs
  return (
    <div className="app-container">
      <NotificationBell />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        user={user}  // Pass user data to Sidebar
      />
      <main className="content">
        {activeTab === "purchase-order" && <PurchaseOrder />}
        {activeTab === "receiving" && <InventoryReceiving />}
        {activeTab === "unit-cost" && <UnitCostViewer />}
        {activeTab === "disbursement" && <InventoryDisbursement />}
        {activeTab === "auto-requisition" && <AutoRequisition />}
        {activeTab === "approve" && user?.role === 'management' && <Approve />}
        {activeTab === "list" && user?.role === 'management' && <List />}
      </main>
    </div>
  )
}

export default App
