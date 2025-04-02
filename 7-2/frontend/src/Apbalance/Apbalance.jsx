import React, { useState } from 'react';
import './ApBalance.css';

function ApBalance() {
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'after'
  const [assetItems, setAssetItems] = useState([{
    id: 1,
    description: '',
    unit: '',
    quantity: 0,
    receivedDate: '',
    poReference: ''
  }]);

  const handleAddItem = () => {
    setAssetItems([...assetItems, {
      id: assetItems.length + 1,
      description: '',
      unit: '',
      quantity: 0,
      receivedDate: '',
      poReference: ''
    }]);
  };

  const handleRemoveItem = (index) => {
    setAssetItems(assetItems.filter((_, i) => i !== index));
  };

  return (
    <div className="ap-balance">
      <div className="header-section">
        {/* <h2>ยอดคงเหลือเจ้าหนี้ (AP Balance)</h2> */}
      </div>
      <div className="tab-buttons">
        <button 
          className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          ยอดคงเหลือเจ้าหนี้ปัจจุบัน
        </button>
        <button 
          className={`tab-button ${activeTab === 'after' ? 'active' : ''}`}
          onClick={() => setActiveTab('after')}
        >
          ยอดคงเหลือเจ้าหนี้หลังการจ่ายเงิน
        </button>
      </div>

      <h2>{activeTab === 'current' ? 'ยอดคงเหลือเจ้าหนี้ (AP Balance)' : 'ยอดคงเหลือเจ้าหนี้หลังการจ่ายเงิน'}</h2>
      <p>{activeTab === 'current' ? 'ดูยอดคงเหลือเจ้าหนี้ทั้งหมด' : 'ดูยอดคงเหลือเจ้าหนี้หลังจากการจ่ายเงิน'}</p>

      <div className="filter-section">
        <div className="filter-row">
          <label htmlFor="vendor">ผู้ขาย/ผู้ให้บริการ</label>
          <select id="vendor">
            <option value="">ทั้งหมด</option>
            {/* เพิ่มตัวเลือกผู้ขาย/ผู้ให้บริการ */}
          </select>

          <label htmlFor="status">สถานะ</label>
          <select id="status">
            <option value="">ทั้งหมด</option>
            {/* เพิ่มตัวเลือกสถานะ */}
          </select>

          <label htmlFor="startDate">วันที่เริ่มต้น</label>
          <input type="date" id="startDate" />

          <label htmlFor="endDate">วันที่สิ้นสุด</label>
          <input type="date" id="endDate" />
        </div>

        <div className="filter-actions">
          <button className="clear-button">ล้างการค้นหา</button>
          <button className="export-button">ส่งออกข้อมูล</button>
        </div>
      </div>

      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>เลขที่ใบแจ้งหนี้</th>
              <th>เลขที่ใบสั่งซื้อ</th>
              <th>ผู้ขาย/ผู้ให้บริการ</th>
              <th>วันที่ใบแจ้งหนี้</th>
              <th>วันครบกำหนด</th>
              <th>จำนวนเงิน</th>
              <th>ชำระแล้ว</th>
              <th>คงเหลือ</th>
              <th>สถานะ</th>
              {activeTab === 'after' && (
                <>
                  <th>วันที่ชำระ</th>
                  <th>วิธีการชำระ</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {activeTab === 'current' ? (
              // Current balance rows
              <>
                <tr>
                  <td>INV00001</td>
                  <td>P000001</td>
                  <td>บริษัท เอ บี ซี จำกัด</td>
                  <td>15/5/2566</td>
                  <td>15/6/2566</td>
                  <td>฿100,000.00</td>
                  <td>฿0.00</td>
                  <td>฿100,000.00</td>
                  <td>ยังไม่ชำระ</td>
                </tr>
                <tr>
                  <td>INV00002</td>
                  <td>P000002</td>
                  <td>บริษัท เอ็กซ์ วาย แซด จำกัด</td>
                  <td>20/5/2566</td>
                  <td>20/6/2566</td>
                  <td>฿15,000.00</td>
                  <td>฿0.00</td>
                  <td>฿15,000.00</td>
                  <td>ยังไม่ชำระ</td>
                </tr>
                <tr>
                  <td>INV00003</td>
                  <td>P000003</td>
                  <td>ห้างหุ้นส่วนจำกัด 123</td>
                  <td>10/4/2566</td>
                  <td>10/5/2566</td>
                  <td>฿50,000.00</td>
                  <td>฿50,000.00</td>
                  <td>฿0.00</td>
                  <td>ชำระแล้ว</td>
                </tr>
              </>
            ) : (
              // After payment rows
              <>
                <tr>
                  <td>INV00001</td>
                  <td>P000001</td>
                  <td>บริษัท เอ บี ซี จำกัด</td>
                  <td>15/5/2566</td>
                  <td>15/6/2566</td>
                  <td>฿100,000.00</td>
                  <td>฿100,000.00</td>
                  <td>฿0.00</td>
                  <td>ชำระแล้ว</td>
                  <td>1/6/2566</td>
                  <td>โอนเงินเข้าบัญชี</td>
                </tr>
              </>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={activeTab === 'current' ? 8 : 10} style={{ textAlign: 'right' }}>
                ยอดคงเหลือรวม
              </td>
              <td>{activeTab === 'current' ? '฿115,000.00' : '฿0.00'}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {activeTab === 'current' && (
        <div className="asset-receipt-section">
          <h3>การรับสินทรัพย์</h3>
          <table>
            <thead>
              <tr>
                <th>อ้างอิงหมายเลขใบสั่งซื้อ</th>
                <th>คำอธิบายรายการ</th>
                <th>หน่วยนับ</th>
                <th>ปริมาณการรับ</th>
                <th>วันที่รับ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {assetItems.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <select>
                      <option value="">เลือกใบสั่งซื้อ</option>
                      <option value="PO-001">PO-001</option>
                      <option value="PO-002">PO-002</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="รายละเอียดสินทรัพย์"
                    />
                  </td>
                  <td>
                    <select>
                      <option value="">เลือกหน่วย</option>
                      <option value="piece">ชิ้น</option>
                      <option value="unit">หน่วย</option>
                      <option value="set">ชุด</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      placeholder="จำนวน"
                    />
                  </td>
                  <td>
                    <input type="date" />
                  </td>
                  <td>
                    <button onClick={() => handleRemoveItem(index)}>ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="asset-actions">
            <button onClick={handleAddItem}>เพิ่มรายการ</button>
            <button className="save">บันทึกการรับ</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApBalance;