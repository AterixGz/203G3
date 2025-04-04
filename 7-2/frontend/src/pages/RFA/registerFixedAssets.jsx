import React, { useState, useEffect } from "react";
import "./registerFixedAssets.css";

const AssetRegistrationInterface = () => {
  const [assets, setAssets] = useState([]); // เก็บข้อมูลสินทรัพย์
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [newAsset, setNewAsset] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
    quantity: "",
    unit: "",
    purchaseDate: "",
    poReference: "",
    department: "",
    status: "active",
  });

  // ดึงข้อมูลสินทรัพย์จาก Backend
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/assets");
        if (response.ok) {
          const data = await response.json();
          setAssets(data);
        } else {
          console.error("Failed to fetch assets");
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, []);

  // จัดการการเปลี่ยนแปลงในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // บันทึกข้อมูลสินทรัพย์ใหม่
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAsset),
      });

      if (response.ok) {
        const result = await response.json();
        setAssets((prev) => [...prev, result.asset]); // เพิ่มสินทรัพย์ใหม่ในรายการ
        setShowRegistrationForm(false); // ปิดฟอร์ม
        setNewAsset({
          id: "",
          name: "",
          description: "",
          category: "",
          quantity: "",
          unit: "",
          purchaseDate: "",
          poReference: "",
          department: "",
          status: "active",
        }); // รีเซ็ตฟอร์ม
        alert("บันทึกข้อมูลสินทรัพย์สำเร็จ");
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Error saving asset:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-6 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-medium">ขึ้นทะเบียนสินทรัพย์ถาวร</h1>
            <p className="text-gray-500">จัดการและติดตามสินทรัพย์ถาวรขององค์กร</p>
          </div>
          <button
            className="flex items-center bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-md"
            onClick={() => setShowRegistrationForm(true)}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4V20M4 12H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            ขึ้นทะเบียนสินทรัพย์ใหม่
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="mb-4">
            <h2 className="text-lg font-medium">รายการสินทรัพย์ถาวร</h2>
            <p className="text-gray-500 text-sm">
              แสดง {assets.length} รายการ
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 text-left">
                  <th className="py-3 px-2 font-medium">รหัสสินทรัพย์</th>
                  <th className="py-3 px-2 font-medium">รายการสินทรัพย์</th>
                  <th className="py-3 px-2 font-medium">หมวดหมู่</th>
                  <th className="py-3 px-2 font-medium">ปริมาณ</th>
                  <th className="py-3 px-2 font-medium">หน่วยนับ</th>
                  <th className="py-3 px-2 font-medium">วันที่ซื้อ</th>
                  <th className="py-3 px-2 font-medium">อ้างอิง PO</th>
                  <th className="py-3 px-2 font-medium">แผนก</th>
                  <th className="py-3 px-2 font-medium">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="py-3 px-2">{asset.id}</td>
                    <td className="py-3 px-2">{asset.name}</td>
                    <td className="py-3 px-2">{asset.category}</td>
                    <td className="py-3 px-2">{asset.quantity}</td>
                    <td className="py-3 px-2">{asset.unit}</td>
                    <td className="py-3 px-2">{asset.purchaseDate}</td>
                    <td className="py-3 px-2">{asset.poReference}</td>
                    <td className="py-3 px-2">{asset.department}</td>
                    <td className="py-3 px-2">{asset.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registration Form Modal */}
        {showRegistrationForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 background-sudHod">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  {/* ชื่อสินทรัพย์ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อสินทรัพย์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newAsset.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* หมวดหมู่ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      หมวดหมู่ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newAsset.category}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* คำอธิบาย */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      คำอธิบาย <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newAsset.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>

                  {/* ปริมาณ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ปริมาณ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newAsset.quantity}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* หน่วยนับ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      หน่วยนับ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="unit"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newAsset.unit}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* วันที่ซื้อ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      วันที่ซื้อ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="purchaseDate"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newAsset.purchaseDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* อ้างอิง PO */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      อ้างอิง PO <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="poReference"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newAsset.poReference}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* แผนก */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      แผนก <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="department"
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newAsset.department}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetRegistrationInterface;