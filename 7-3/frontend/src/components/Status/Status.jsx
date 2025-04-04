import { useState, useEffect } from 'react'
import { Check, AlertCircle, Clock } from 'react-feather'
import './Status.css'

const Status = ({ user }) => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const endpoint = 'http://localhost:3000/my-orders'
      const response = await fetch(endpoint)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="status-pending">
            <Clock size={14} />
            รออนุมัติ
          </span>
        )
      case 'approved':
        return (
          <span className="status-approved">
            <Check size={14} />
            อนุมัติแล้ว
          </span>
        )
      case 'rejected':
        return (
          <span className="status-rejected">
            <AlertCircle size={14} />
            ไม่อนุมัติ
          </span>
        )
      default:
        return status
    }
  }

  return (
    <div className="status-container">
      <div className="status-header">
        <h2>สถานะคำสั่งซื้อ</h2>
      </div>
      <div className="status-content">
        {isLoading ? (
          <div className="loading">กำลังโหลดข้อมูล...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>เลขที่คำสั่งซื้อ</th>
                <th>วันที่</th>
                <th>ผู้จำหน่าย</th>
                <th>ยอดรวม</th>
                <th>สถานะ</th>
                <th>หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.po_number}</td>
                  <td>{new Date(order.date).toLocaleDateString('th-TH')}</td>
                  <td>{order.supplier_name}</td>
                  <td className="text-right">{order.total.toLocaleString('th-TH')} บาท</td>
                  <td>{getStatusDisplay(order.status)}</td>
                  <td>{order.comment || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Status