import React, { useEffect, useState } from 'react';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // ดึงข้อมูลจาก backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/company/list');
        if (!res.ok) {
          throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // กรองข้อมูลตามคำค้นหา
  const filteredCompanies = companies.filter(company => 
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // แสดงรายละเอียดบริษัท
  const handleRowClick = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
    setEditMode(false);
  };

  // เปิดโหมดแก้ไข
  const handleEditClick = () => {
    setFormData({...selectedCompany});
    setEditMode(true);
  };

  // อัพเดทค่าในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // บันทึกข้อมูลที่แก้ไข
  const handleSaveChanges = async () => {
    try {
      // สมมติว่ามี API endpoint สำหรับอัพเดทข้อมูล
      const res = await fetch(`http://localhost:3000/api/company/update/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        throw new Error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
      
      // อัพเดทข้อมูลในตาราง
      setCompanies(companies.map(company => 
        company.id === formData.id ? formData : company
      ));
      
      // อัพเดทข้อมูลที่เลือก
      setSelectedCompany(formData);
      setEditMode(false);
      
      // แสดงข้อความแจ้งเตือน
      alert('บันทึกข้อมูลสำเร็จ');
      
    } catch (err) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  // ปิด Modal
  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">รายการบริษัทที่บันทึกไว้</h2>
        <div className="h-1 w-20 bg-blue-500 rounded"></div>
      </div>

      {/* Search and stats bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="ค้นหาบริษัท..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          แสดง {filteredCompanies.length} รายการ จากทั้งหมด {companies.length} รายการ
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อบริษัท</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ติดต่อ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทร</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จังหวัด</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่บันทึก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCompanies.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-gray-50 cursor-pointer transition duration-150"
                    onClick={() => handleRowClick(item)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.companyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.contactName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.province}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredCompanies.length === 0 && (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูลบริษัท</h3>
                <p className="mt-1 text-sm text-gray-500">ยังไม่มีข้อมูลบริษัทในระบบ หรือไม่พบผลลัพธ์จากการค้นหา</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Company Detail Modal */}
      {showModal && selectedCompany && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="border-b px-6 py-3 flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h3 className="text-xl font-medium text-gray-800">
                {editMode ? 'แก้ไขข้อมูลบริษัท: ' : 'ข้อมูลบริษัท: '} 
                {editMode ? formData.companyName : selectedCompany.companyName}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {!editMode ? (
                // View Mode
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-700 text-lg mb-3">ข้อมูลบริษัท</h4>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">ชื่อบริษัท</p>
                        <p className="font-medium">{selectedCompany.companyName}</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">เลขประจำตัวผู้เสียภาษี</p>
                        <p className="font-medium">{selectedCompany.taxId}</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">ประเภทธุรกิจ</p>
                        <p className="font-medium">{selectedCompany.businessType}</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">สินค้า/บริการ</p>
                        <p className="font-medium">{selectedCompany.products}</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-bold text-green-700 text-lg mb-3">ข้อมูลการติดต่อ</h4>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">ผู้ติดต่อ</p>
                        <p className="font-medium">{selectedCompany.contactName}</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">ตำแหน่ง</p>
                        <p className="font-medium">{selectedCompany.position}</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">เบอร์โทรศัพท์</p>
                        <p className="font-medium">{selectedCompany.phone}</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">อีเมล</p>
                        <p className="font-medium text-blue-600">{selectedCompany.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-700 text-lg mb-3">ที่อยู่</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">ที่อยู่</p>
                        <p className="font-medium">{selectedCompany.address}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">จังหวัด / อำเภอ</p>
                        <p className="font-medium">{selectedCompany.province} / {selectedCompany.district}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">รหัสไปรษณีย์</p>
                        <p className="font-medium">{selectedCompany.postalCode}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-right">
                    <p className="text-sm text-gray-500">
                      วันที่บันทึก: {new Date(selectedCompany.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </>
              ) : (
                // Edit Mode
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-700 text-lg mb-3">ข้อมูลบริษัท</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm text-gray-500 mb-1">ชื่อบริษัท</label>
                        <input 
                          type="text" 
                          name="companyName" 
                          value={formData.companyName || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm text-gray-500 mb-1">เลขประจำตัวผู้เสียภาษี</label>
                        <input 
                          type="text" 
                          name="taxId" 
                          value={formData.taxId || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm text-gray-500 mb-1">ประเภทธุรกิจ</label>
                        <input 
                          type="text" 
                          name="businessType" 
                          value={formData.businessType || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm text-gray-500 mb-1">สินค้า/บริการ</label>
                        <input 
                          type="text" 
                          name="products" 
                          value={formData.products || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-bold text-green-700 text-lg mb-3">ข้อมูลการติดต่อ</h4>
                      
                      <div className="mb-4">
                        <label className="block text-sm text-gray-500 mb-1">ผู้ติดต่อ</label>
                        <input 
                          type="text" 
                          name="contactName" 
                          value={formData.contactName || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm text-gray-500 mb-1">ตำแหน่ง</label>
                        <input 
                          type="text" 
                          name="position" 
                          value={formData.position || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm text-gray-500 mb-1">เบอร์โทรศัพท์</label>
                        <input 
                          type="text" 
                          name="phone" 
                          value={formData.phone || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm text-gray-500 mb-1">อีเมล</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-700 text-lg mb-3">ที่อยู่</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">ที่อยู่</label>
                        <input 
                          type="text" 
                          name="address" 
                          value={formData.address || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">จังหวัด</label>
                          <input 
                            type="text" 
                            name="province" 
                            value={formData.province || ''} 
                            onChange={handleInputChange} 
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">อำเภอ</label>
                          <input 
                            type="text" 
                            name="district" 
                            value={formData.district || ''} 
                            onChange={handleInputChange} 
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">รหัสไปรษณีย์</label>
                        <input 
                          type="text" 
                          name="postalCode" 
                          value={formData.postalCode || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="border-t px-6 py-3 bg-gray-50 rounded-b-lg flex justify-end space-x-2">
              {!editMode ? (
                <>
                  <button
                    onClick={handleEditClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-150 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                    แก้ไขข้อมูล
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-150"
                  >
                    ปิด
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-150"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition duration-150 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    บันทึกข้อมูล
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;