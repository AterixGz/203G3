import React, { useState, useEffect } from "react";
import "./registerFixedAssets.css";

const POSelectionModal = ({ poList, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 background-sudHod flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">เลือก PO</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <table className="w-full">
          <thead>
          <tr className="border-b">
  <th className="py-2 text-left">เลขที่ PO</th>
  <th className="py-2 text-left">ชื่อสินทรัพย์</th>
  <th className="py-2 text-left">ราคา</th>
  <th className="py-2 text-left">วันที่</th>
  <th className="py-2 text-left">ผู้ขาย</th>
  <th className="py-2 text-left">การดำเนินการ</th>
</tr>
</thead>
<tbody>
  {poList.map((po) => (
    <tr key={po.poNumber} className="border-b">
      <td className="py-2">{po.poNumber}</td>
      <td className="py-2">
        {po.items && po.items.length > 0 ? po.items[0].name : "ไม่มีข้อมูล"}
      </td>
      <td className="py-2">
        {po.items && po.items.length > 0 ? po.items[0].price : "ไม่มีข้อมูล"}
      </td>
      <td className="py-2">{po.poDate}</td>
      <td className="py-2">{po.vendor.name}</td>
      <td className="py-2">
        <button
          onClick={() => onSelect(po)}
          className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
        >
          เลือก
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
};

const AssetRegistrationInterface = () => {
  const [assets, setAssets] = useState([]); // เก็บข้อมูลสินทรัพย์
  const [showPOSelection, setShowPOSelection] = useState(false); // สำหรับ Modal เลือก PO
  const [poList, setPoList] = useState([]); // รายการ PO
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

  const categories = [
    "วัตถุดิบ (Raw Materials)",
    "ชิ้นส่วนประกอบ (Components/Parts)",
    "สินค้ากึ่งสำเร็จรูป (Work-in-Process - WIP)",
    "สินค้าสำเร็จรูป (Finished Goods)",
    "สินค้าอุปโภคบริโภค (Consumer Goods)",
    "สินค้าคงทน (Durable Goods)",
    "สินค้าชั่วคราว (Perishable Goods)",
    "สินค้าอันตราย (Hazardous Materials)",
    "สินค้าอิเล็กทรอนิกส์ (Electronics)",
  ];

  const departments = [
    "ฝ่ายจัดซื้อ",
    "ฝ่ายบัญชี",
    "ฝ่ายการเงิน",
    "ฝ่ายบุคคล",
    "ฝ่ายการตลาด",
    "ฝ่ายขาย",
  ];

  // ดึงข้อมูล PO จาก Backend
  useEffect(() => {
    const fetchPOs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/po-registration");
        if (response.ok) {
          const data = await response.json();
          setPoList(data.purchaseOrders); // เก็บข้อมูล PO ใน State
        } else {
          console.error("Failed to fetch PO data");
        }
      } catch (error) {
        console.error("Error fetching PO data:", error);
      }
    };

    fetchPOs();
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/assets");
        if (response.ok) {
          const data = await response.json();
          setAssets(data); // เก็บข้อมูลสินทรัพย์ใน State
        } else {
          console.error("Failed to fetch assets");
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, []);

  // ฟังก์ชันสำหรับเลือก PO
  const handlePOSelect = (po) => {
    setNewAsset((prev) => ({
      ...prev,
      poReference: po.poNumber,
      name: po.items[0]?.name || "",
      quantity: po.items[0]?.quantity || "",
      unit: po.items[0]?.unit || "",
      purchaseDate: po.poDate || "",
    }));
    setShowPOSelection(false); // ปิด Modal
  };

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
  
    // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
    if (
      !newAsset.name ||
      !newAsset.category ||
      !newAsset.quantity ||
      !newAsset.unit ||
      !newAsset.purchaseDate ||
      !newAsset.poReference ||
      !newAsset.department
    ) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
  
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
        setAssets((prev) => [...prev, result.asset]); // เพิ่มข้อมูลใหม่ในตาราง
        alert("บันทึกข้อมูลสินทรัพย์สำเร็จ");
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
      } else {
        console.error("Failed to save asset");
      }
    } catch (error) {
      console.error("Error saving asset:", error);
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-6 text-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-medium">ขึ้นทะเบียนสินทรัพย์ถาวร</h1>
            <p className="text-gray-500">จัดการและติดตามสินทรัพย์ถาวรขององค์กร</p>
          </div>
          <button
            className="flex items-center bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-md"
            onClick={() => setShowPOSelection(true)} // เปิด Modal เลือก PO
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

        {/* แสดง Modal เลือก PO */}
        {showPOSelection && (
          <POSelectionModal
            poList={poList}
            onSelect={handlePOSelect}
            onClose={() => setShowPOSelection(false)}
          />
        )}

        {/* ฟอร์มขึ้นทะเบียนสินทรัพย์ */}
        {newAsset.poReference && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-medium mb-4">รายละเอียดสินทรัพย์</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อสินทรัพย์
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newAsset.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    หมวดหมู่
                  </label>
                  <select
                    name="category"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newAsset.category}
                    onChange={handleInputChange}
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ปริมาณ
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newAsset.quantity}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    หน่วยนับ
                  </label>
                  <input
                    type="text"
                    name="unit"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newAsset.unit}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันที่ซื้อ
                  </label>
                  <input
                    type="date"
                    name="purchaseDate"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newAsset.purchaseDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    แผนก
                  </label>
                  <select
                    name="department"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newAsset.department}
                    onChange={handleInputChange}
                  >
                    <option value="">เลือกแผนก</option>
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 text-right">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ตารางสินทรัพย์ */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium">รายการสินทรัพย์ถาวร</h2>
            <p className="text-gray-500 text-sm">แสดง {assets.length} รายการ</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 text-left">
                  <th className="py-3 px-2 font-medium">อ้างอิง PO</th>
                  <th className="py-3 px-2 font-medium">รายการสินทรัพย์</th>
                  <th className="py-3 px-2 font-medium">หมวดหมู่</th>
                  <th className="py-3 px-2 font-medium">ปริมาณ</th>
                  <th className="py-3 px-2 font-medium">หน่วยนับ</th>
                  <th className="py-3 px-2 font-medium">วันที่ซื้อ</th>
                  <th className="py-3 px-2 font-medium">แผนก</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="py-3 px-2">{asset.poReference}</td>
                    <td className="py-3 px-2">{asset.name}</td>
                    <td className="py-3 px-2">{asset.category}</td>
                    <td className="py-3 px-2">{asset.quantity}</td>
                    <td className="py-3 px-2">{asset.unit}</td>
                    <td className="py-3 px-2">{asset.purchaseDate}</td>
                    <td className="py-3 px-2">{asset.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetRegistrationInterface;