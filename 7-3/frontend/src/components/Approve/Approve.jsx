import { useState, useEffect } from 'react'
import './Approve.css'
import { Check, AlertCircle, Clock } from 'react-feather'

const Approve = () => {
  const [pendingOrders, setPendingOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPendingOrders()
  }, [])

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/pending-orders')
      const data = await response.json()
      setPendingOrders(data)
    } catch (error) {
      console.error('Error fetching pending orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/approve-order/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          comment: comment
        })
      })
      if (response.ok) {
        fetchPendingOrders() // Refresh the list
        setSelectedOrder(null)
        setComment('')
      }
    } catch (error) {
      console.error('Error approving order:', error)
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

  return (
    <div className="approve-container">
      <div className="approve-card">
        <div className="approve-header">
          <h2>รายการรออนุมัติ</h2>
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
                      <td className="text-right">{order.total.toLocaleString('th-TH')} บาท</td>
                      <td>
                        <span className="status-pending">
                          <Clock size={14} />
                          รออนุมัติ
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-sm btn-primary"
                          onClick={() => setSelectedOrder(order)}
                        >
                          พิจารณา
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedOrder && (
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