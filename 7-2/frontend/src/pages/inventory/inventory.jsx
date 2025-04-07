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

  useEffect(() => {
    fetchItems();
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
      </div>
    </div>
  );
};

export default Inventory;