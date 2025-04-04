import React, { useState, useEffect } from "react";
import "./Approve_PR.css";

const PurchaseApprovalInterface = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [selectedPR, setSelectedPR] = useState(null); // Default to null
  const [prList, setPrList] = useState([]); // เก็บข้อมูล PR จาก API
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const statusOptions = [
    { value: "all", label: "สถานะทั้งหมด" },
    { value: "pending", label: "รอการอนุมัติ" },
    { value: "approved", label: "อนุมัติแล้ว" },
    { value: "rejected", label: "ไม่อนุมัติ" },
  ];

  // ดึงข้อมูล PR จาก API เมื่อโหลดหน้า
  useEffect(() => {
    const fetchPRData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/pr");
        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูล PR ได้");
        }
        const data = await response.json();
  
        // อัปเดตสถานะเป็น "pending" หากไม่มีสถานะ
        const updatedData = data.map((pr) => ({
          ...pr,
          status: pr.status || "pending",
        }));
  
        setPrList(updatedData);
        if (updatedData.length > 0) {
          setSelectedPR(updatedData[0].prNumber); // ตั้งค่า PR แรกเป็นค่าเริ่มต้น
        }
      } catch (error) {
        console.error("Error fetching PR data:", error);
      }
    };
  
    fetchPRData();
  }, []);

  // ฟิลเตอร์ข้อมูล PR
  const filteredPRs = prList.filter((pr) => {
    const matchesSearch =
      pr.prNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || pr.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ข้อมูล PR ที่เลือก
  const selectedPRData = prList.find((pr) => pr.prNumber === selectedPR);

  const handlePRClick = (prNumber) => {
    setSelectedPR(prNumber);
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/pr/${selectedPR}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      });
  
      if (response.ok) {
        const updatedPR = await response.json();
        setPrList((prevList) =>
          prevList.map((pr) =>
            pr.prNumber === selectedPR ? { ...pr, status: "approved" } : pr
          )
        );
        alert("อนุมัติ PR เรียบร้อยแล้ว");
      } else {
        alert("เกิดข้อผิดพลาดในการอนุมัติ PR");
      }
    } catch (error) {
      console.error("Error approving PR:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };
  const handleReject = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/pr/${selectedPR}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected" }),
      });
  
      if (response.ok) {
        const updatedPR = await response.json();
        setPrList((prevList) =>
          prevList.map((pr) =>
            pr.prNumber === selectedPR ? { ...pr, status: "rejected" } : pr
          )
        );
        alert("ปฏิเสธ PR เรียบร้อยแล้ว");
      } else {
        alert("เกิดข้อผิดพลาดในการปฏิเสธ PR");
      }
    } catch (error) {
      console.error("Error rejecting PR:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

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

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="font-medium text-lg mb-4">รายการใบขอซื้อ</h2>
            <p className="text-sm text-gray-500 mb-6">
              {filteredPRs.length} รายการกำลังรออนุมัติ
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
            </div>

            {/* Filter Dropdown */}
            <div className="relative flex-grow mb-6">
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
            </div>

            {/* PR List */}
            <div className="space-y-4">
              {filteredPRs.map((pr) => (
                <div
                  key={pr.prNumber}
                  className={`border ${
                    selectedPR === pr.prNumber
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  } rounded-lg p-4 cursor-pointer`}
                  onClick={() => handlePRClick(pr.prNumber)}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{pr.prNumber}</span>
                    <span
                      className={`text-sm ${
                        pr.status === "approved"
                          ? "text-green-500"
                          : pr.status === "rejected"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {pr.status || "pending"}
                    </span>
                  </div>
                  <div className="text-gray-700">{pr.purpose}</div>
                  <div className="text-gray-500 text-sm">
                    ผู้ขอ: {pr.requester}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2">
            {selectedPRData ? (
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h2 className="font-medium text-lg mb-4">
                  รายละเอียดใบขอซื้อ: {selectedPRData.prNumber}
                </h2>
                <p className="text-gray-500 mb-4">
                  ผู้ขอ: {selectedPRData.requester}
                </p>
                <p className="text-gray-500 mb-4">
                  แผนก: {selectedPRData.department}
                </p>
                <p className="text-gray-500 mb-4">
                  วัตถุประสงค์: {selectedPRData.purpose}
                </p>
                <p className="text-gray-500 mb-4">
                  หมายเหตุ: {selectedPRData.note}
                </p>

                {/* Product List */}
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">รายการ</th>
                      <th className="border px-4 py-2">จำนวน</th>
                      <th className="border px-4 py-2">หน่วย</th>
                      <th className="border px-4 py-2">ราคา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPRData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{item.name}</td>
                        <td className="border px-4 py-2">{item.quantity}</td>
                        <td className="border px-4 py-2">{item.unit}</td>
                        <td className="border px-4 py-2">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Approve/Reject Buttons */}
                <div className="mt-6 flex space-x-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    onClick={handleApprove}
                  >
                    อนุมัติ
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={handleReject}
                  >
                    ไม่อนุมัติ
                  </button>
                </div>
              </div>
            ) : (
              <p>ไม่มีข้อมูลใบขอซื้อ</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseApprovalInterface;