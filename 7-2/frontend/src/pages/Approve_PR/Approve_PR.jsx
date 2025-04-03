import React, { useState } from "react";
import "./Approve_PR.css"; // Assuming you have a CSS file for styling

const PurchaseApprovalInterface = () => {
  // Existing state
  const [activeTab, setActiveTab] = useState("details");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [selectedPR, setSelectedPR] = useState("PR-00125"); // Default to first item

  // Add new state for filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Add status options
  const statusOptions = [
    { value: "all", label: "สถานะทั้งหมด" },
    { value: "pending", label: "รอการอนุมัติ" },
    { value: "approved", label: "อนุมัติแล้ว" },
    { value: "rejected", label: "ไม่อนุมัติ" },
  ];

  const handleApprove = () => {
    setIsApproveModalOpen(true);
  };

  const handleSubmitApproval = () => {
    // Create new PR list without the approved PR
    const updatedPrList = { ...prList };
    delete updatedPrList[selectedPR];

    // Update state
    setPrList(updatedPrList);

    // Update selected PR to the first available PR or null
    const remainingPRs = Object.keys(updatedPrList);
    setSelectedPR(remainingPRs[0] || null);

    // Close modal and reset comment
    setIsApproveModalOpen(false);
    setApprovalComment("");

    // Optional: Show success message
    alert("อนุมัติ PR เรียบร้อยแล้ว");
  };

  const handlePRClick = (prId) => {
    setSelectedPR(prId);
  };

  // Add PR data
  const prData = {
    "PR-00125": {
      id: "PR-00125",
      priority: "ปกติ",
      priorityClass: "bg-blue-100 text-blue-800",
      status: "รอการอนุมัติ",
      requester: "ประภา ไจ้",
      department: "ทรัพยากรบุคคล",
      purpose: "จัดซื้อของขวัญสำหรับพนักงานเกษียณ",
      requestDate: "12/4/2568",
      requiredDate: "18/4/2568",
      amount: "15,000",
      products: [
        {
          id: 1,
          name: "ของขวัญที่ระลึก",
          quantity: 5,
          unit: "ชิ้น",
          price: 3000,
          total: 15000,
        },
      ],
    },
    "PR-00124": {
      id: "PR-00124",
      priority: "เร่งด่วน",
      priorityClass: "bg-orange-100 text-orange-800",
      status: "รอการอนุมัติ",
      requester: "รัชา สุขสันต์",
      department: "การตลาด",
      purpose: "จัดซื้อวัสดุสำหรับงานอีเว้นท์",
      requestDate: "11/4/2568",
      requiredDate: "15/4/2568",
      amount: "35,000",
      products: [
        {
          id: 1,
          name: "แบนเนอร์",
          quantity: 2,
          unit: "ชิ้น",
          price: 5000,
          total: 10000,
        },
        {
          id: 2,
          name: "ชุดตกแต่งสถานที่",
          quantity: 1,
          unit: "ชุด",
          price: 25000,
          total: 25000,
        },
      ],
    },
    "PR-00123": {
      id: "PR-00123",
      priority: "ด่วน",
      priorityClass: "bg-purple-100 text-purple-800",
      status: "รอการอนุมัติ",
      requester: "สมชาย วงศ์สุข",
      department: "ไอที",
      purpose: "จัดซื้ออุปกรณ์คอมพิวเตอร์สำหรับพนักงานใหม่",
      requestDate: "10/4/2568",
      requiredDate: "20/4/2568",
      amount: "107,000",
      products: [
        {
          id: 1,
          name: "โน้ตบุ๊ก Dell Latitude",
          quantity: 2,
          unit: "เครื่อง",
          price: 35000,
          total: 70000,
        },
        {
          id: 2,
          name: 'จอมอนิเตอร์ Dell 27"',
          quantity: 2,
          unit: "จอ",
          price: 12000,
          total: 24000,
        },
        {
          id: 3,
          name: "ชุดคีย์บอร์ดและเมาส์",
          quantity: 2,
          unit: "ชุด",
          price: 6500,
          total: 13000,
        },
      ],
    },
  };

  const [prList, setPrList] = useState(prData);

  // Add filter function
  const filteredPRs = Object.values(prList).filter((pr) => {
    const matchesSearch =
      pr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || pr.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Update detail panel section
  const selectedPRData = prList[selectedPR];

  // Update the right panel JSX with dynamic data
  return (
    <div className="font-sans min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-1">อนุมัติใบขอซื้อ</h1>
          <p className="text-gray-500">
            ตรวจสอบและอนุมัติใบขอซื้อหรือดำเนินการ
          </p>
        </div>

        {/* Grid Layout - 1/3 : 2/3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - 1/3 */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="font-medium text-lg mb-4">รายการใบขอซื้อ</h2>
            <p className="text-sm text-gray-500 mb-6">
              {Object.keys(prList).length} รายการกำลังรออนุมัติ
            </p>

            {/* Search Box */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="ค้นหาใบขอซื้อ..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-grow mr-2">
                <select
                  className="w-full appearance-none border border-gray-300 rounded-md pl-4 pr-10 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <button className="p-2 bg-white border border-gray-300 rounded-md">
                <svg
                  className="h-5 w-5 text-gray-500"
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
              </button>
            </div>

            {/* Purchase Request List */}
            <div className="space-y-4">
              {filteredPRs.map((pr) => (
                <div
                  key={pr.id}
                  className={`border ${
                    selectedPR === pr.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  } rounded-lg p-4 relative cursor-pointer transition-colors duration-150 hover:bg-gray-50`}
                  onClick={() => handlePRClick(pr.id)}
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{pr.id}</span>
                      <span
                        className={`${pr.priorityClass} text-xs px-2 py-0.5 rounded`}
                      >
                        {pr.priority}
                      </span>
                    </div>
                    <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
                      {pr.status}
                    </div>
                  </div>
                  <div className="mb-1">
                    {pr.requester} • {pr.department}
                  </div>
                  <div className="text-gray-700 mb-1">{pr.purpose}</div>
                  <div className="text-gray-500 text-sm mb-1">
                    วันที่ขอ: {pr.requestDate}
                  </div>
                  <div className="font-medium">{pr.amount} บาท</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - 2/3 */}
          <div className="lg:col-span-2">
            {selectedPRData ? (
              <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium text-lg">{selectedPRData.id}</h2>
                  <span
                    className={`${selectedPRData.priorityClass} text-xs px-2 py-0.5 rounded`}
                  >
                    {selectedPRData.priority}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  สร้างเมื่อ {selectedPRData.requestDate}
                </p>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex">
                    <button
                      className={`mr-6 pb-3 ${
                        activeTab === "details"
                          ? "border-b-2 border-blue-500 font-medium text-blue-600"
                          : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("details")}
                    >
                      รายละเอียด
                    </button>
                    <button
                      className={`pb-3 ${
                        activeTab === "products"
                          ? "border-b-2 border-blue-500 font-medium text-blue-600"
                          : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("products")}
                    >
                      รายการสินค้า
                    </button>
                  </div>
                </div>

                {/* Content */}
                {activeTab === "details" ? (
                  <div className="mb-6">
                    {/* Existing details content */}
                    <div className="grid grid-cols-2 mb-4">
                      <div>
                        <p className="text-gray-500 mb-1">ชื่อ</p>
                        <p className="font-medium">
                          {selectedPRData.requester}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">แผนก</p>
                        <p className="font-medium">
                          {selectedPRData.department}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 mb-4">
                      <div>
                        <p className="text-gray-500 mb-1">วันที่ต้องการ</p>
                        <p className="font-medium">
                          {selectedPRData.requiredDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">มูลค่ารวม</p>
                        <p className="font-medium">
                          {selectedPRData.amount} บาท
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-500 mb-1">วัตถุประสงค์</p>
                      <p className="font-medium">{selectedPRData.purpose}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="text-left text-xs text-gray-500">
                          <th className="pb-2">รายการ</th>
                          <th className="pb-2 text-right">จำนวน</th>
                          <th className="pb-2 text-right">ราคาต่อหน่วย</th>
                          <th className="pb-2 text-right">รวม</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedPRData.products.map((product) => (
                          <tr key={product.id} className="text-sm">
                            <td className="py-3">{product.name}</td>
                            <td className="py-3 text-right">
                              {product.quantity} {product.unit}
                            </td>
                            <td className="py-3 text-right">
                              {product.price.toLocaleString()} บาท
                            </td>
                            <td className="py-3 text-right">
                              {product.total.toLocaleString()} บาท
                            </td>
                          </tr>
                        ))}
                        <tr className="font-medium">
                          <td colSpan={3} className="py-3 text-right">
                            รวมทั้งสิ้น
                          </td>
                          <td className="py-3 text-right">
                            {selectedPRData.amount} บาท
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Approval Section */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                  <p className="text-gray-600 mb-4">
                    กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนดำเนินการ
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 font-medium flex items-center">
                      <svg
                        className="h-4 w-4 mr-1"
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
                      ไม่อนุมัติ
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md font-medium flex items-center"
                      onClick={handleApprove}
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      อนุมัติ
                    </button>
                  </div>
                </div>

                {/* Approval Modal */}
                {isApproveModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center background-sudHod">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                      <h3 className="text-lg font-medium mb-4">
                        ยืนยันการอนุมัติ {selectedPRData.id}
                      </h3>

                      {/* PR Summary */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">ผู้ขอ</span>
                          <span className="font-medium">
                            {selectedPRData.requester}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">แผนก</span>
                          <span className="font-medium">
                            {selectedPRData.department}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">วัตถุประสงค์</span>
                          <span className="font-medium">
                            {selectedPRData.purpose}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">มูลค่ารวม</span>
                          <span className="font-medium text-green-600">
                            {selectedPRData.amount} บาท
                          </span>
                        </div>
                      </div>

                      {/* Comment Input */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          ความคิดเห็น
                        </label>
                        <textarea
                          className="w-full border border-gray-300 rounded-md p-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="กรอกความคิดเห็นของคุณ..."
                          value={approvalComment}
                          onChange={(e) => setApprovalComment(e.target.value)}
                        ></textarea>
                      </div>

                      {/* Warning Message */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                        <div className="flex">
                          <svg
                            className="h-5 w-5 text-yellow-400 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          <p className="text-sm text-yellow-700">
                            การอนุมัติไม่สามารถยกเลิกได้
                            กรุณาตรวจสอบข้อมูลให้ถูกต้อง
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-2">
                        <button
                          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
                          onClick={() => setIsApproveModalOpen(false)}
                        >
                          ยกเลิก
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
                          onClick={handleSubmitApproval}
                        >
                          ยืนยันการอนุมัติ
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6 text-center">
                <p className="text-gray-500">ไม่มีรายการที่ต้องอนุมัติ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseApprovalInterface;
