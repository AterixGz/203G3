import { useState, useEffect, useRef } from 'react'
import './Approve.css'
import { Check, AlertCircle, Clock, Edit2, Save } from 'react-feather'

const Approve = ({ userRole }) => {
  const [pendingOrders, setPendingOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('managementBudget')
    return saved ? parseFloat(saved) : 1000000
  })
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [tempBudget, setTempBudget] = useState(budget)
  const [refreshInterval, setRefreshInterval] = useState(5000) // 5 seconds
  const refreshTimer = useRef(null)

  // Split permissions for viewing and editing
  const canEdit = userRole === 'management'
  const canApprove = userRole === 'management' || userRole === 'finance'
  const showBudget = userRole === 'management' || userRole === 'finance'

  // Add useEffect to fetch budget from server
  useEffect(() => {
    fetchBudget()
    fetchPendingOrders()
  }, [])

  // Add budget fetching function
  const fetchBudget = async () => {
    try {
      const response = await fetch('http://localhost:3000/management-budget')
      const data = await response.json()
      setBudget(data.budget || 1000000)
    } catch (error) {
      console.error('Error fetching budget:', error)
    }
  }

  useEffect(() => {
    localStorage.setItem('managementBudget', budget.toString())
  }, [budget])

  const handleBudgetEdit = () => {
    setIsEditingBudget(true)
    setTempBudget(budget)
  }

  // Update handleBudgetSave to sync with server
  const handleBudgetSave = async () => {
    const newBudget = parseFloat(tempBudget)
    if (!isNaN(newBudget) && newBudget >= 0) {
      try {
        const response = await fetch('http://localhost:3000/management-budget', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: newBudget })
        })

        if (!response.ok) {
          throw new Error('Failed to update budget')
        }

        setBudget(newBudget)
        setIsEditingBudget(false)
      } catch (error) {
        console.error('Error updating budget:', error)
        alert('เกิดข้อผิดพลาดในการอัปเดตวงเงิน')
      }
    }
  }

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/pending-orders')
      const data = await response.json()
      console.log(data)
      setPendingOrders(data)
    } catch (error) {
      console.error('Error fetching pending orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (orderId) => {
    const order = pendingOrders.find(o => o.id === orderId)
    if (!order) return

    // Only check budget for management users
    if (userRole === 'management' && order.total > budget) {
      alert('วงเงินไม่เพียงพอสำหรับการอนุมัติรายการนี้')
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/approve-order/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          comment: comment,
          userRole: userRole
        })
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.message || 'เกิดข้อผิดพลาดในการอนุมัติรายการ')
        return
      }

      const data = await response.json()
      
      // Update budget only for management users
      if (userRole === 'management' && data.newBudget !== undefined) {
        setBudget(data.newBudget)
      }
      
      fetchPendingOrders()
      setSelectedOrder(null)
      setComment('')
    } catch (error) {
      console.error('Error approving order:', error)
      alert('เกิดข้อผิดพลาดในการอนุมัติรายการ')
    }
  }

  const handleReject = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/approve-order/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          comment: comment
        })
      })
      if (response.ok) {
        fetchPendingOrders() // Refresh the list
        setSelectedOrder(null)
        setComment('')
      }
    } catch (error) {
      console.error('Error rejecting order:', error)
    }
  }

  useEffect(() => {
    let ws = null;
    let reconnectTimer = null;

    const connectWebSocket = () => {
      ws = new WebSocket('ws://localhost:8080');
      
      ws.onopen = () => {
        console.log('WebSocket connected');
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'budget-update') {
            setBudget(data.budget);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected. Reconnecting...');
        // Try to reconnect after 3 seconds
        reconnectTimer = setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, []);

  useEffect(() => {
    // Only set up auto-refresh for finance users
    if (userRole === 'finance') {
      console.log('Setting up 5-second refresh interval for finance user')
      
      const autoRefresh = () => {
        fetchBudget()
        fetchPendingOrders()
      }
  
      // Initial fetch
      autoRefresh()
  
      // Set up 5-second interval
      const intervalId = setInterval(autoRefresh, 5000)
  
      // Cleanup on unmount or when dependencies change
      return () => {
        console.log('Cleaning up refresh interval')
        clearInterval(intervalId)
      }
    }
  }, [userRole]) // Remove refreshInterval from dependencies since it's now fixed

  const handleManualRefresh = () => {
    fetchBudget()
    fetchPendingOrders()
  }

  return (
    <div className="approve-container">
      <div className="approve-card">
        <div className="approve-header">
          <div className="header-left">
            <h2>รายการรออนุมัติ</h2>
            {userRole === 'finance' && (
              <span className="refresh-info">
                รีเฟรชอัตโนมัติทุก {refreshInterval / 1000} วินาที
              </span>
            )}
          </div>
          {showBudget && (
            <div className="budget-display">
              <span>วงเงินคงเหลือ: </span>
              {canEdit && isEditingBudget ? (
                <div className="budget-edit">
                  <input
                    type="number"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    min="0"
                  />
                  <button className="btn-sm" onClick={handleBudgetSave}>
                    <Save size={14} />
                  </button>
                </div>
              ) : (
                <div className={`budget-value ${!canEdit ? 'view-only' : ''}`} 
                  onClick={canEdit ? handleBudgetEdit : undefined}>
                  {budget.toLocaleString('th-TH')} บาท
                  {canEdit && <Edit2 size={14} className="edit-icon" />}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="approve-content">
          {isLoading ? (
            <div className="loading">กำลังโหลดข้อมูล...</div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>เลขที่คำสั่งซื้อ</th>
                    <th>วันที่</th>
                    <th>ผู้จำหน่าย</th>
                    <th>ยอดรวม</th>
                    <th>สถานะ</th>
                    <th>การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.po_number}</td>
                      <td>{new Date(order.date).toLocaleDateString('th-TH')}</td>
                      <td>{order.supplier_name}</td>
                      <td>{order.total.toLocaleString('th-TH')} บาท</td>
                      <td>
                        <span className="status-pending">
                          <Clock size={14} />
                          รออนุมัติ
                        </span>
                      </td>
                      <td>
                        {canApprove ? (
                          <button 
                            className="btn-sm btn-primary"
                            onClick={() => setSelectedOrder(order)}
                          >
                            พิจารณา
                          </button>
                        ) : (
                          <span className="view-only">รอการพิจารณา</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedOrder && canApprove && (
                <div className="approval-form">
                  <h3>พิจารณาคำสั่งซื้อ #{selectedOrder.po_number}</h3>
                  <div className="form-group">
                    <label>ความคิดเห็น</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="เพิ่มความคิดเห็น (ถ้ามี)"
                      rows={4}
                    />
                  </div>
                  <div className="button-group">
                    <button 
                      className="btn-outline"
                      onClick={() => handleReject(selectedOrder.id)}
                    >
                      ไม่อนุมัติ
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => handleApprove(selectedOrder.id)}
                    >
                      อนุมัติ
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Approve