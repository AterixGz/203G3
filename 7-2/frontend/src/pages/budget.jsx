import { useState, useEffect } from "react";

export default function BudgetManagement() {
  const [selectedDepartment, setSelectedDepartment] = useState("ปฏิบัติการ");
  const [showDropdown, setShowDropdown] = useState(false);
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    usedBudget: 0,
    remainingBudget: 0,
    departments: {},
    fiscalYear: "",
  });
  const [amount, setAmount] = useState("");
  const [allocations, setAllocations] = useState([]);

  // เพิ่ม state สำหรับ loading
  const [isLoading, setIsLoading] = useState(true);

  // Add new state for editing total budget
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [newTotalBudget, setNewTotalBudget] = useState("");

  // ปรับปรุง useEffect
  useEffect(() => {
    const fetchBudgetData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/budget");
        const data = await response.json();

        if (data && data.departments) {
          setBudgetData(data);
          if (data.departments[selectedDepartment]) {
            setAllocations(data.departments[selectedDepartment].allocations);
            setAmount(data.departments[selectedDepartment].amount.toString());
          }
        }
      } catch (error) {
        console.error("Error fetching budget data:", error);
        alert("ไม่สามารถโหลดข้อมูลงบประมาณได้");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgetData();
  }, [selectedDepartment]);

  // Update allocations when department changes
  useEffect(() => {
    if (budgetData.departments[selectedDepartment]) {
      setAllocations(budgetData.departments[selectedDepartment].allocations);
      setAmount(budgetData.departments[selectedDepartment].amount.toString());
    }
  }, [selectedDepartment, budgetData]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectDepartment = (dept) => {
    setSelectedDepartment(dept);
    setShowDropdown(false);
  };

  // เพิ่มฟังก์ชันการคำนวณ
  const calculateBudgetSummary = (departments) => {
    let totalUsed = 0;
    let totalAllocated = 0;

    // คำนวณงบประมาณที่ถูกจัดสรรและใช้ไปแล้ว
    Object.values(departments).forEach((dept) => {
      totalAllocated += dept.amount;
      // คำนวณงบประมาณที่ใช้ไปจาก allocations
      dept.allocations.forEach((allocation) => {
        totalUsed += allocation.amount;
      });
    });

    return {
      totalAllocated,
      totalUsed,
      remaining: budgetData.totalBudget - totalAllocated,
    };
  };

  // Add this validation function
  const validateBudgetAmount = (newAmount) => {
    const currentDeptAmount =
      budgetData.departments[selectedDepartment]?.amount || 0;
    const totalAllocated = Object.values(budgetData.departments).reduce(
      (sum, dept) => {
        return sum + (dept.amount || 0);
      },
      0
    );

    // Calculate total allocated excluding current department
    const totalExcludingCurrent = totalAllocated - currentDeptAmount;

    // Calculate maximum allowed amount
    const maxAllowed = budgetData.totalBudget - totalExcludingCurrent;

    if (newAmount > maxAllowed) {
      return {
        isValid: false,
        message: `ไม่สามารถจัดสรรงบประมาณเกิน ${formatCurrency(
          maxAllowed
        )} ได้`,
      };
    }

    return {
      isValid: true,
      message: "",
    };
  };

  // Handle save button click
  const handleSave = async () => {
    try {
      const newAmount = Number(amount);

      // Validate amount before saving
      const validation = validateBudgetAmount(newAmount);
      if (!validation.isValid) {
        alert(validation.message);
        return;
      }

      const updatedAllocations = allocations.map((item) => ({
        ...item,
        amount: (item.percentage / 100) * newAmount,
      }));

      const updatedBudgetData = {
        ...budgetData,
        departments: {
          ...budgetData.departments,
          [selectedDepartment]: {
            amount: newAmount,
            allocations: updatedAllocations,
          },
        },
      };

      const response = await fetch("http://localhost:3000/api/budget", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBudgetData),
      });

      if (response.ok) {
        setBudgetData(updatedBudgetData);
        setAllocations(updatedAllocations);
        alert("บันทึกข้อมูลสำเร็จ");
      } else {
        throw new Error("Failed to save budget data");
      }
    } catch (error) {
      console.error("Error saving budget data:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return `฿${Number(value).toLocaleString()}`;
  };

  // Update handleAmountChange function
  const handleAmountChange = (e) => {
    const value = e.target.value;

    // Check if input is a valid number
    if (value === "" || /^\d+$/.test(value)) {
      const newAmount = Number(value);
      const validation = validateBudgetAmount(newAmount);

      if (!validation.isValid) {
        alert(validation.message);
        return;
      }

      setAmount(value);
    }
  };

  // Add handler for total budget changes
  const handleTotalBudgetChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) >= 0) {
      setNewTotalBudget(value);
    }
  };

  // Add save total budget function
  const handleSaveTotalBudget = async () => {
    try {
      const newTotal = Number(newTotalBudget);

      // Validate if new total is less than currently allocated
      const totalAllocated = Object.values(budgetData.departments).reduce(
        (sum, dept) => sum + (dept.amount || 0),
        0
      );

      if (newTotal < totalAllocated) {
        alert(
          `ไม่สามารถตั้งงบประมาณน้อยกว่างบที่จัดสรรไปแล้ว (${formatCurrency(
            totalAllocated
          )})`
        );
        return;
      }

      const updatedBudgetData = {
        ...budgetData,
        totalBudget: newTotal,
      };

      const response = await fetch("http://localhost:3000/api/budget", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBudgetData),
      });

      if (response.ok) {
        setBudgetData(updatedBudgetData);
        setIsEditingTotal(false);
        alert("บันทึกงบประมาณรวมสำเร็จ");
      } else {
        throw new Error("Failed to save total budget");
      }
    } catch (error) {
      console.error("Error saving total budget:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกงบประมาณรวม");
    }
  };

  const departmentOptions = Object.keys(budgetData.departments || {});

  // ในส่วนของ return statement
  const budgetSummary = calculateBudgetSummary(budgetData.departments);

  return (
    <div className="bg-gray-50 p-6 font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        การจัดสรรงบประมาณ
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        จัดการและจัดสรรงบประมาณของแผนกภายในองค์กร
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Budget Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* งบประมาณทั้งหมด */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">งบประมาณทั้งหมด</span>
                <button
                  onClick={() => {
                    setIsEditingTotal(true);
                    setNewTotalBudget(budgetData.totalBudget.toString());
                  }}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
              {isEditingTotal ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTotalBudget}
                    onChange={handleTotalBudgetChange}
                    className="w-full p-1 text-xl border rounded"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveTotalBudget}
                    className="p-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsEditingTotal(false)}
                    className="p-1 text-white bg-gray-600 rounded hover:bg-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <p className="text-xl font-bold">
                  {formatCurrency(budgetData.totalBudget)}
                </p>
              )}
              <p className="text-xs text-gray-500">
                งบประมาณปี {budgetData.fiscalYear}
              </p>
            </div>

            {/* จำนวนแผนก */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">จำนวนแผนก</span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-xl font-bold">
                {Object.keys(budgetData.departments).length}
              </p>
              <p className="text-xs text-gray-500">
                แผนกที่ได้รับการจัดสรรงบประมาณ
              </p>
            </div>

            {/* งบประมาณที่ใช้ไป */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">งบประมาณที่ใช้ไป</span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-xl font-bold">
                {formatCurrency(budgetSummary.totalUsed)}
              </p>
              <p className="text-xs text-gray-500">งบที่ใช้ไปแล้วทั้งหมด</p>
            </div>

            {/* คงเหลืองบประมาณ */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">คงเหลืองบประมาณ</span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <p className="text-xl font-bold">
                {formatCurrency(budgetSummary.remaining)}
              </p>
              <p className="text-xs text-gray-500">งบที่ยังไม่ได้ถูกจัดสรร</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Department Selection Panel */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">เลือกแผนก</h2>
              <p className="text-sm text-gray-600 mb-4">
                เลือกแผนกที่ต้องการจัดสรรงบประมาณ
              </p>

              {/* Dropdown */}
              <div className="relative mb-6">
                <div
                  className="flex justify-between items-center p-2 border border-gray-300 rounded cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <span>{selectedDepartment}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {showDropdown && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg">
                    <div className="p-2 border-b border-gray-200">
                      <div className="flex items-center p-1 border border-gray-300 rounded">
                        <svg
                          className="w-4 h-4 text-gray-500 mx-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <input
                          type="text"
                          placeholder="ค้นหาแผนก..."
                          className="w-full outline-none text-sm"
                        />
                      </div>
                    </div>

                    <ul>
                      {departmentOptions.map((dept, index) => (
                        <li
                          key={index}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                            selectedDepartment === dept
                              ? "flex items-center"
                              : ""
                          }`}
                          onClick={() => selectDepartment(dept)}
                        >
                          {selectedDepartment === dept && (
                            <svg
                              className="w-4 h-4 mr-2 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                          {dept}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Budget Allocation Panel */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm md:col-span-2">
              

              <h2 className="text-lg font-semibold mb-1">
                จัดสรรงบประมาณ - {selectedDepartment}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                กำหนดงบประมาณสำหรับแผนกที่เลือก
              </p>

              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">
                  งบประมาณที่จัดสรร
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded"
                  onKeyDown={(e) => {
                    // Prevent typing of non-numeric characters
                    if (
                      !/^\d$/.test(e.key) &&
                      ![
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  ค่าตัวเลขงบประมาณที่ต้องการจัดสรรให้แผนก{selectedDepartment}
                  <br />
                  <span className="text-blue-600">
                    (สูงสุดไม่เกิน{" "}
                    {formatCurrency(
                      budgetData.totalBudget -
                        budgetSummary.totalAllocated +
                        (budgetData.departments[selectedDepartment]?.amount ||
                          0)
                    )}
                    )
                  </span>
                </p>
              </div>

              {/* จัดสรรโซน */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">การจัดสรรงบประมาณ</h3>
                  <span className="text-green-500 text-sm">
                    จัดสรรแล้ว 100%
                  </span>
                </div>

                {/* Allocation Sliders */}
                {allocations.map((item, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm">
                        {item.percentage}% ({formatCurrency(item.amount)})
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-600"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
