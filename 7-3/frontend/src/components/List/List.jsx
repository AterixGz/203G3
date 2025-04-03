import { useState, useEffect } from 'react'
import './List.css'
import { Check, AlertCircle, Clock } from 'react-feather'

const List = () => {
  const [approvedOrders, setApprovedOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchApprovedOrders()
  }, [])

  const fetchApprovedOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/approved-orders')
      const data = await response.json()
      setApprovedOrders(data)
    } catch (error) {
      console.error('Error fetching approved orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>รายการคำสั่งซื้อที่อนุมัติแล้ว</h2>
      </div>
      <div className="list-content">
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
              </tr>
            </thead>
            <tbody>
              {approvedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.po_number}</td>
                  <td>{new Date(order.date).toLocaleDateString('th-TH')}</td>
                  <td>{order.supplier_name}</td>
                  <td className="text-right">{order.total.toLocaleString('th-TH')} บาท</td>
                  <td className="status-cell">
                    <span className="status-approved">
                      <Check size={14} />
                      อนุมัติแล้ว
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default List