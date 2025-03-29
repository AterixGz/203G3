"use client"

import { useState } from "react"
import "./App.css"
import Sidebar from "./components/Sidebar"
import PurchaseOrder from "./components/PurchaseOrder"
import InventoryReceiving from "./components/InventoryReceiving"
import UnitCostViewer from "./components/UnitCostViewer"
import InventoryDisbursement from "./components/InventoryDisbursement"
import AutoRequisition from "./components/AutoRequisition"

function App() {
  const [activeTab, setActiveTab] = useState("purchase-order")

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="content">
        {activeTab === "purchase-order" && <PurchaseOrder />}
        {activeTab === "receiving" && <InventoryReceiving />}
        {activeTab === "unit-cost" && <UnitCostViewer />}
        {activeTab === "disbursement" && <InventoryDisbursement />}
        {activeTab === "auto-requisition" && <AutoRequisition />}
      </main>
    </div>
  )
}

export default App
