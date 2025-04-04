import { useState, useEffect } from 'react'
import { Edit2, Save, X, Plus, Trash2 } from 'react-feather'
import './roleSetting.css'

const RoleSetting = () => {
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'purchasing',
    name: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (user) => {
    setEditingId(user.id)
  }

  const handlePasswordChange = (userId, newPassword) => {
    setUsers(users.map(u => 
      u.id === userId ? {...u, password: newPassword} : u
    ))
  }

  const handleSave = async (user) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
          role: user.role,
          name: user.name
        })
      })
      if (response.ok) {
        setEditingId(null)
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleAddNew = async () => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      })
      if (response.ok) {
        setIsAddingNew(false)
        setNewUser({
          username: '',
          password: '',
          role: 'purchasing',
          name: ''
        })
        fetchUsers()
      }
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  // Update the handleDelete function to check for admin role
  const handleDelete = async (userId) => {
    // Find the user to be deleted
    const userToDelete = users.find(u => u.id === userId)
    
    // Prevent deleting if user is admin
    if (userToDelete?.role === 'admin') {
      alert('ไม่สามารถลบบัญชีผู้ดูแลระบบได้')
      return
    }

    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) {
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchUsers()
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const getRoleDisplay = (role) => {
    const roles = {
      admin: 'ผู้ดูแลระบบ',
      purchasing: 'ฝ่ายจัดซื้อ',
      finance: 'ฝ่ายการเงิน',
      management: 'ฝ่ายบริหาร'
    }
    return roles[role] || role
  }

  return (
    <div className="role-setting-container">
      <div className="role-setting-header">
        <h2>จัดการสิทธิ์ผู้ใช้งาน</h2>
        <button className="btn-primary" onClick={() => setIsAddingNew(true)}>
          <Plus size={16} />
          เพิ่มผู้ใช้งาน
        </button>
      </div>

      {isLoading ? (
        <div className="loading">กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="role-setting-content">
          <table>
            <thead>
              <tr>
                <th>ชื่อผู้ใช้</th>
                <th>รหัสผ่าน</th>
                <th>ชื่อ-นามสกุล</th>
                <th>สิทธิ์</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {isAddingNew && (
                <tr className="new-user-row">
                  <td>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      placeholder="ชื่อผู้ใช้"
                    />
                  </td>
                  <td>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="รหัสผ่าน"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="ชื่อ-นามสกุล"
                    />
                  </td>
                  <td>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="purchasing">ฝ่ายจัดซื้อ</option>
                      <option value="finance">ฝ่ายการเงิน</option>
                      <option value="management">ฝ่ายบริหาร</option>
                      <option value="admin">ผู้ดูแลระบบ</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-primary btn-sm" onClick={handleAddNew}>
                        <Save size={14} />
                      </button>
                      <button className="btn-outline btn-sm" onClick={() => setIsAddingNew(false)}>
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={user.username}
                        onChange={(e) => setUsers(users.map(u => 
                          u.id === user.id ? {...u, username: e.target.value} : u
                        ))}
                      />
                    ) : user.username}
                  </td>
                  <td>
                    {editingId === user.id ? (
                      <input
                        type="password"
                        placeholder="เปลี่ยนรหัสผ่าน"
                        onChange={(e) => handlePasswordChange(user.id, e.target.value)}
                      />
                    ) : '********'}
                  </td>
                  <td>
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => setUsers(users.map(u => 
                          u.id === user.id ? {...u, name: e.target.value} : u
                        ))}
                      />
                    ) : user.name}
                  </td>
                  <td>
                    {editingId === user.id ? (
                      <select
                        value={user.role}
                        onChange={(e) => setUsers(users.map(u => 
                          u.id === user.id ? {...u, role: e.target.value} : u
                        ))}
                      >
                        <option value="purchasing">ฝ่ายจัดซื้อ</option>
                        <option value="finance">ฝ่ายการเงิน</option>
                        <option value="management">ฝ่ายบริหาร</option>
                        <option value="admin">ผู้ดูแลระบบ</option>
                      </select>
                    ) : getRoleDisplay(user.role)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {editingId === user.id ? (
                        <>
                          <button className="btn-primary btn-sm" onClick={() => handleSave(user)}>
                            <Save size={14} />
                          </button>
                          <button className="btn-outline btn-sm" onClick={() => setEditingId(null)}>
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn-outline btn-sm" onClick={() => handleEdit(user)}>
                            <Edit2 size={14} />
                          </button>
                          {user.role !== 'admin' && (
                            <button className="btn-outline btn-sm" onClick={() => handleDelete(user.id)}>
                              <Trash2 size={14} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RoleSetting