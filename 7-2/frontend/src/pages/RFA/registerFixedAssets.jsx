import React, { useState } from "react";
import './registerFixedAssets.css'
// Create a SortableTableHeader component
const SortableTableHeader = ({ label, sortKey, sortConfig, onSort }) => {
  return (
    <th 
      className="py-3 px-2 font-medium cursor-pointer hover:bg-gray-50"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center">
        {label}
        <svg
          className={`w-4 h-4 ml-1 transition-opacity duration-200 ${
            sortConfig.key === sortKey ? "opacity-100" : "opacity-30"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={sortConfig.key === sortKey && sortConfig.direction === "desc" 
              ? "M19 9l-7 7-7-7" 
              : "M5 15l7-7 7 7"
            }
          />
        </svg>
      </div>
    </th>
  );
};

const AssetRegistrationInterface = () => {
  // States for filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // Sample category options
  const categoryOptions = [
    { value: "all", label: "หมวดหมู่ทั้งหมด" },
    { value: "computer", label: "คอมพิวเตอร์และอุปกรณ์ไอที" },
    { value: "furniture", label: "เฟอร์นิเจอร์และเครื่องตกแต่ง" },
    { value: "office", label: "เครื่องใช้สำนักงาน" },
    { value: "electrical", label: "เครื่องใช้ไฟฟ้า" },
    { value: "vehicle", label: "ยานพาหนะ" },
  ];

  // Sample status options
  const statusOptions = [
    { value: "all", label: "สถานะทั้งหมด" },
    { value: "active", label: "ใช้งาน" },
    { value: "maintenance", label: "ซ่อมบำรุง" },
    { value: "inactive", label: "เลิกใช้งาน" },
  ];

  // Filter functions
  const filterAssets = (assets) => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || asset.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || asset.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  };

  // New asset registration form state
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

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation and submission logic here
    console.log("New asset:", newAsset);
    setShowRegistrationForm(false);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortAssets = (assets) => {
    if (!sortConfig.key) return assets;

    return [...assets].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-6 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-medium">ขึ้นทะเบียนสินทรัพย์ถาวร</h1>
            <p className="text-gray-500">
              จัดการและติดตามสินทรัพย์ถาวรขององค์กร
            </p>
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

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
          <h2 className="font-medium text-lg mb-4">ค้นหาและกรองข้อมูล</h2>

          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Box */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="ค้นหาสินทรัพย์..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative md:w-64">
              <select
                className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-md"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="relative md:w-64">
              <select
                className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Filter Button */}
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white">
              <svg
                className="h-5 w-5 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              กรองขั้นสูง
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="mb-4">
            <h2 className="text-lg font-medium">รายการสินทรัพย์ถาวร</h2>
            <p className="text-gray-500 text-sm">
              แสดง 5 รายการ จากทั้งหมด 5 รายการ
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <SortableTableHeader 
                    label="รหัสสินทรัพย์"
                    sortKey="id"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableTableHeader 
                    label="รายการสินทรัพย์"
                    sortKey="name"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableTableHeader 
                    label="หมวดหมู่"
                    sortKey="category"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableTableHeader 
                    label="ปริมาณ"
                    sortKey="quantity"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableTableHeader 
                    label="หน่วยนับ"
                    sortKey="unit"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableTableHeader 
                    label="วันที่ซื้อ"
                    sortKey="purchaseDate"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <th className="py-3 px-2 font-medium">อ้างอิง PO</th>
                  <SortableTableHeader 
                    label="แผนก"
                    sortKey="department"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableTableHeader 
                    label="สถานะ"
                    sortKey="status"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </tr>
              </thead>
              <tbody>
                {/* Row 1 */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">FA-00123</td>
                  <td className="py-3 px-2">
                    <div className="font-medium">
                      คอมพิวเตอร์โน้ตบุ๊ค Dell XPS 13
                    </div>
                    <div className="text-sm text-gray-500">
                      คอมพิวเตอร์โน้ตบุ๊คสำหรับฝ่ายการตลาด
                    </div>
                  </td>
                  <td className="py-3 px-2">คอมพิวเตอร์และอุปกรณ์ไอที</td>
                  <td className="py-3 px-2">2</td>
                  <td className="py-3 px-2">เครื่อง</td>
                  <td className="py-3 px-2">15/3/2568</td>
                  <td className="py-3 px-2">PO-00123</td>
                  <td className="py-3 px-2">การตลาด</td>
                  <td className="py-3 px-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      ใช้งาน
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">FA-00124</td>
                  <td className="py-3 px-2">
                    <div className="font-medium">โต๊ะทำงาน</div>
                    <div className="text-sm text-gray-500">
                      โต๊ะทำงานสำหรับพนักงานใหม่
                    </div>
                  </td>
                  <td className="py-3 px-2">เฟอร์นิเจอร์และเครื่องตกแต่ง</td>
                  <td className="py-3 px-2">5</td>
                  <td className="py-3 px-2">ตัว</td>
                  <td className="py-3 px-2">10/3/2568</td>
                  <td className="py-3 px-2">PO-00120</td>
                  <td className="py-3 px-2">ทรัพยากรบุคคล</td>
                  <td className="py-3 px-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      ใช้งาน
                    </span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">FA-00125</td>
                  <td className="py-3 px-2">
                    <div className="font-medium">
                      เครื่องถ่ายเอกสาร Canon IR-2525
                    </div>
                    <div className="text-sm text-gray-500">
                      เครื่องถ่ายเอกสารสำหรับแผนกบัญชี
                    </div>
                  </td>
                  <td className="py-3 px-2">เครื่องใช้สำนักงาน</td>
                  <td className="py-3 px-2">1</td>
                  <td className="py-3 px-2">เครื่อง</td>
                  <td className="py-3 px-2">20/2/2568</td>
                  <td className="py-3 px-2">PO-00118</td>
                  <td className="py-3 px-2">บัญชี</td>
                  <td className="py-3 px-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800">
                      ซ่อมบำรุง
                    </span>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">FA-00127</td>
                  <td className="py-3 px-2">
                    <div className="font-medium">เครื่องปรับอากาศ Daikin</div>
                    <div className="text-sm text-gray-500">
                      เครื่องปรับอากาศสำหรับห้องประชุม
                    </div>
                  </td>
                  <td className="py-3 px-2">เครื่องใช้ไฟฟ้า</td>
                  <td className="py-3 px-2">3</td>
                  <td className="py-3 px-2">เครื่อง</td>
                  <td className="py-3 px-2">5/2/2568</td>
                  <td className="py-3 px-2">PO-00115</td>
                  <td className="py-3 px-2">ทั่วไป</td>
                  <td className="py-3 px-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      ใช้งาน
                    </span>
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">FA-00126</td>
                  <td className="py-3 px-2">
                    <div className="font-medium">รถยนต์ Toyota Fortuner</div>
                    <div className="text-sm text-gray-500">
                      รถยนต์สำหรับผู้บริหาร
                    </div>
                  </td>
                  <td className="py-3 px-2">ยานพาหนะ</td>
                  <td className="py-3 px-2">1</td>
                  <td className="py-3 px-2">คัน</td>
                  <td className="py-3 px-2">15/1/2568</td>
                  <td className="py-3 px-2">PO-00110</td>
                  <td className="py-3 px-2">บริหาร</td>
                  <td className="py-3 px-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      ใช้งาน
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <div>หน้า 1 จาก 1</div>
            <div className="flex items-center">
              <button className="px-2 py-1 border border-gray-300 rounded mr-1 text-gray-500">
                ก่อนหน้า
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded mr-1">
                1
              </button>
              <button className="px-2 py-1 border border-gray-300 rounded text-gray-500">
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 background-sudHod z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">ขึ้นทะเบียนสินทรัพย์ใหม่</h2>
              <button
                onClick={() => setShowRegistrationForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

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
                  <select
                    name="category"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newAsset.category}
                    onChange={handleInputChange}
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categoryOptions.map(
                      (option) =>
                        option.value !== "all" && (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        )
                    )}
                  </select>
                </div>

                {/* คำอธิบายรายการ */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    คำอธิบายรายการ <span className="text-red-500">*</span>
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

                {/* ปริมาณการรับ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ปริมาณการรับ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="1"
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

                {/* วันที่รับ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันที่รับ <span className="text-red-500">*</span>
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

                {/* อ้างอิงหมายเลขใบสั่งซื้อ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    อ้างอิงหมายเลขใบสั่งซื้อ <span className="text-red-500">*</span>
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

                {/* หมายเลขซีเรียล */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    หมายเลขซีเรียล
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newAsset.serialNumber}
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

                {/* สถานที่ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    สถานที่ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newAsset.location}
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
  );
};

export default AssetRegistrationInterface;
