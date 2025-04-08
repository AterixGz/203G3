import { useState, useEffect } from 'react';
import { Edit2, Save, Trash2, X } from 'react-feather';
import './inventory.css';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unitPrice: '',
    supplier: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState({
    name: '',
    quantity: '',
    unitPrice: '',
    supplier: ''
  });
  const [pendingPOs, setPendingPOs] = useState([]);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [prData, setPrData] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchPendingPOs();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/inventory-items');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch pending POs
  const fetchPendingPOs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/po-registration');
      if (!response.ok) throw new Error('Failed to fetch POs');
      const data = await response.json();
      // กรองเฉพาะ PO ที่มีสถานะการชำระเงินเป็น "ชำระแล้ว" และยังไม่ได้รับเข้าคลัง
      const pendingPOs = data.purchaseOrders.filter(po => 
        po.status === "ชำระแล้ว" && 
        !po.isReceived // เพิ่มฟิลด์ isReceived เพื่อติดตามสถานะการรับเข้าคลัง
      );
      setPendingPOs(pendingPOs);
    } catch (error) {
      console.error('Error fetching POs:', error);
    }
  };

  // Fetch PR data when PO is selected
  const handlePOSelect = async (po) => {
    try {
      const response = await fetch('http://localhost:3000/api/pr');
      if (!response.ok) throw new Error('Failed to fetch PRs');
      const prs = await response.json();
      const matchingPR = prs.find(pr => pr.prNumber === po.prReference);
      if (matchingPR) {
        setSelectedPO(po);
        setPrData(matchingPR);
        setShowReceiveModal(true);
      }
    } catch (error) {
      console.error('Error fetching PR data:', error);
    }
  };

  // Handle receiving items
  const handleReceiveItems = async () => {
    try {
      // ตรวจสอบข้อมูล PR
      const prResponse = await fetch(`http://localhost:3000/api/pr/${selectedPO.prReference}`);
      if (!prResponse.ok) throw new Error('Failed to fetch PR data');
      const prData = await prResponse.json();

      // เช็คว่า PR มีอยู่จริงและได้รับการอนุมัติ
      if (!prData || prData.status !== 'approved') {
        throw new Error('Invalid or unapproved PR reference');
      }

      // อัพเดทสินค้าในคลัง
      for (const item of selectedPO.items) {
        const existingItem = items.find(i => 
          i.name === item.name && 
          i.supplier === selectedPO.vendor.name
        );

        if (existingItem) {
          // อัพเดทสินค้าที่มีอยู่
          await fetch(`http://localhost:3000/inventory-items/update-by-name/${encodeURIComponent(item.name)}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quantity: (Number(existingItem.quantity) + Number(item.quantity)).toString(),
              supplier: selectedPO.vendor.name,
              updatedAt: new Date().toISOString()
            })
          });
        } else {
          // เพิ่มสินค้าใหม่
          await fetch('http://localhost:3000/inventory-items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.price,
              supplier: selectedPO.vendor.name,
              updatedAt: new Date().toISOString()
            })
          });
        }
      }

      // อัพเดทสถานะ PO เป็นรับเข้าคลังแล้ว
      await fetch(`http://localhost:3000/api/po-registration/${selectedPO.poNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isReceived: true,
          receivedAt: new Date().toISOString()
        })
      });

      // รีเฟรชข้อมูล
      fetchItems();
      fetchPendingPOs();
      setShowReceiveModal(false);
      setSelectedPO(null);
      alert('รับสินค้าเข้าคลังเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Error receiving items:', error);
      alert('เกิดข้อผิดพลาดในการรับสินค้า: ' + error.message);
    }
  };

  // Add ReceiveModal component
  const ReceiveModal = ({ po, onClose, onConfirm }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-medium mb-4">รับสินค้าเข้าคลัง</h2>
          <div className="mb-4">
            <p>เลขที่ PO: {po.poNumber}</p>
            <p>ผู้จำหน่าย: {po.vendor.name}</p>
          </div>
          
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="text-left">รายการ</th>
                <th className="text-center">จำนวน</th>
                <th className="text-right">ราคาต่อหน่วย</th>
                <th className="text-right">มูลค่ารวม</th>
              </tr>
            </thead>
            <tbody>
              {po.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">{Number(item.price).toLocaleString()} บาท</td>
                  <td className="text-right">
                    {(Number(item.quantity) * Number(item.price)).toLocaleString()} บาท
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              ยืนยันการรับสินค้า
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/inventory-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem)
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      // Reset form and refresh items
      setNewItem({
        name: '',
        quantity: '',
        unitPrice: '',
        supplier: ''
      });
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditItem({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      supplier: item.supplier
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditItem({
      name: '',
      quantity: '',
      unitPrice: '',
      supplier: ''
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/inventory-items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editItem)
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      setEditingId(null);
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      try {
        const response = await fetch(`http://localhost:3000/inventory-items/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete item');
        }

        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>คลังสินค้า</h2>
        <p>จัดการข้อมูลสินค้าในคลัง</p>
      </div>

      <div className="inventory-content">
        <form onSubmit={handleSubmit} className="add-item-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">ชื่อสินค้า</label>
              <input
                id="name"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">จำนวน</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={newItem.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="unitPrice">ราคาต่อหน่วย (บาท)</label>
              <input
                id="unitPrice"
                name="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={newItem.unitPrice}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="supplier">ผู้จำหน่าย</label>
              <input
                id="supplier"
                name="supplier"
                value={newItem.supplier}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            เพิ่มสินค้า
          </button>
        </form>

        <div className="search-container">
          <input
            type="text"
            placeholder="ค้นหาสินค้าหรือผู้จำหน่าย..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="loading">กำลังโหลดข้อมูล...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ชื่อสินค้า</th>
                <th>จำนวน</th>
                <th>ราคาต่อหน่วย</th>
                <th>มูลค่ารวม</th>
                <th>ผู้จำหน่าย</th>
                <th>วันที่ปรับปรุง</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    {editingId === item.id ? (
                      <input
                        name="name"
                        value={editItem.name}
                        onChange={handleEditInputChange}
                        required
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        name="quantity"
                        type="number"
                        min="0"
                        value={editItem.quantity}
                        onChange={handleEditInputChange}
                        required
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        name="unitPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={editItem.unitPrice}
                        onChange={handleEditInputChange}
                        required
                      />
                    ) : (
                      `${Number(item.unitPrice).toLocaleString('th-TH')} บาท`
                    )}
                  </td>
                  <td>
                    {`${(Number(item.quantity) * Number(item.unitPrice)).toLocaleString('th-TH')} บาท`}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        name="supplier"
                        value={editItem.supplier}
                        onChange={handleEditInputChange}
                        required
                      />
                    ) : (
                      item.supplier
                    )}
                  </td>
                  <td>{new Date(item.updatedAt).toLocaleDateString('th-TH')}</td>
                  <td>
                    <div className="action-buttons">
                      {editingId === item.id ? (
                        <>
                          <button 
                            className="btn-primary btn-sm" 
                            onClick={() => handleSaveEdit(item.id)}
                          >
                            <Save size={14} />
                          </button>
                          <button 
                            className="btn-outline btn-sm" 
                            onClick={handleCancelEdit}
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="btn-outline btn-sm" 
                            onClick={() => handleEdit(item)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="btn-outline btn-sm" 
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">รายการ PO ที่รอรับเข้าคลัง</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingPOs.map(po => (
              <div 
                key={po.poNumber}
                className="border rounded-lg p-4 hover:border-gray-400 cursor-pointer"
                onClick={() => handlePOSelect(po)}
              >
                <p className="font-medium">{po.poNumber}</p>
                <p className="text-sm text-gray-600">ผู้จำหน่าย: {po.vendor.name}</p>
                <p className="text-sm text-gray-600">
                  วันที่: {new Date(po.poDate).toLocaleDateString('th-TH')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {showReceiveModal && selectedPO && (
          <ReceiveModal
            po={selectedPO}
            onClose={() => setShowReceiveModal(false)}
            onConfirm={handleReceiveItems}
          />
        )}
      </div>
    </div>
  );
};

export default Inventory;