
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const PurchaseOrderForm = () => {
  const [approvedPRs, setApprovedPRs] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData,] = useState({
    poNumber: "",
    poDate: "",
    prReference: "",
    prDate: "",
    vendorName: "",
    taxId: "",
    address: "",
    contact: "",
    phone: "",
    paymentMethod: "",
    deliveryDate: "",
    deliveryLocation: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.poDate) newErrors.poDate = "กรุณาระบุวันที่";
    if (!formData.prDate) newErrors.prDate = "กรุณาระบุวันที่อนุมัติ PR";
    if (!formData.vendorName) newErrors.vendorName = "กรุณาระบุชื่อผู้ขาย";
    if (!formData.taxId) newErrors.taxId = "กรุณาระบุเลขประจำตัวผู้เสียภาษี";
    if (!formData.address) newErrors.address = "กรุณาระบุที่อยู่";
    if (!formData.contact) newErrors.contact = "กรุณาระบุผู้ติดต่อ";
    if (!formData.phone) newErrors.phone = "กรุณาระบุเบอร์โทรศัพท์";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "กรุณาเลือกเงื่อนไขการชำระเงิน";
    if (!formData.deliveryDate)
      newErrors.deliveryDate = "กรุณาระบุวันที่ส่งมอบ";
    if (!formData.deliveryLocation)
      newErrors.deliveryLocation = "กรุณาระบุสถานที่ส่งมอบ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = () => {
    // Implement PDF generation logic here
    alert("กำลังบันทึกเป็น PDF...");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Save PO logic here
      alert("บันทึก PO เรียบร้อยแล้ว");
      navigate("/purchase-orders"); // Redirect to PO list
    } else {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  };

  const handleCancel = () => {
    if (window.confirm("ต้องการยกเลิกการสร้าง PO หรือไม่?")) {
      navigate("/purchase-orders");
    }
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };
  const [totalPrice, setTotalPrice] = useState(0);

useEffect(() => {
  const total = approvedPRs.reduce(
    (sum, pr) => sum + calculateTotalPrice(pr.items),
    0
  );
  setTotalPrice(total);
}, [approvedPRs]);
    // ดึงข้อมูล PR ที่อนุมัติแล้วเมื่อโหลดหน้า
    useEffect(() => {
      const fetchApprovedPRs = async () => {
        try {
          const response = await fetch("http://localhost:3000/api/pr/approved");
          if (response.ok) {
            const data = await response.json();
            setApprovedPRs(data);
          } else {
            console.error("Failed to fetch approved PRs");
          }
        } catch (error) {
          console.error("Error fetching approved PRs:", error);
        }
      };
  
      fetchApprovedPRs();
    }, []);



  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-md shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">ใบสั่งซื้อ (PO)</h1>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            พิมพ์
          </button>
          <button
            onClick={handleSavePDF}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            บันทึก PDF
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เลขที่ PO
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.poNumber}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันที่
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="mm/dd/yyyy"
                name="poDate"
                value={formData.poDate}
                onChange={handleInputChange}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              {errors.poDate && (
                <p className="text-red-500 text-sm mt-1">{errors.poDate}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อ้างอิงเลขที่ PR
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.prReference}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันที่อนุมัติ PR
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="mm/dd/yyyy"
                name="prDate"
                value={formData.prDate}
                onChange={handleInputChange}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              {errors.prDate && (
                <p className="text-red-500 text-sm mt-1">{errors.prDate}</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="text-lg font-medium mb-4">ข้อมูลผู้ขาย</h2>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อผู้ขาย
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="ชื่อบริษัทผู้ขาย"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleInputChange}
              />
              {errors.vendorName && (
                <p className="text-red-500 text-sm mt-1">{errors.vendorName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เลขประจำตัวผู้เสียภาษี
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="0-0000-00000-00-0"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
              />
              {errors.taxId && (
                <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ที่อยู่
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              placeholder="ที่อยู่ผู้ขาย"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ผู้ติดต่อ
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="ชื่อผู้ติดต่อ"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เบอร์โทรศัพท์
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="0xx-xxx-xxxx"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto bg-white p-6 rounded-md shadow">
      <h1 className="text-xl font-medium mb-6">รายการสินค้า (อนุมัติแล้ว)</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4 text-left">เลขที่ PR</th>
              <th className="py-2 px-4 text-left">วันที่</th>
              <th className="py-2 px-4 text-left">ผู้ขอ</th>
              <th className="py-2 px-4 text-left">วัตถุประสงค์</th>
              <th className="py-2 px-4 text-left">รายการสินค้า</th>
              <th className="py-2 px-4 text-left">หน่วยละ</th>
            </tr>
          </thead>
          <tbody>
            {approvedPRs.map((pr) => (
              <tr key={pr.prNumber} className="border-b border-gray-200">
                <td className="py-3 px-4">{pr.prNumber}</td>
                <td className="py-3 px-4">{pr.date}</td>
                <td className="py-3 px-4">{pr.requester}</td>
                <td className="py-3 px-4">{pr.purpose}</td>
                <td className="py-3 px-4">
                  <ul>
                    {pr.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - {item.quantity} {item.unit}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-3 px-4">
                  <ul>
                    {pr.items.map((item, index) => (
                      <li key={index}>
                        {item.price} บาท
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div className="border-t border-gray-200 pt-6 mb-6">
  <h2 className="text-lg font-medium mb-4">สรุปราคาทั้งหมด</h2>
  <div className="grid grid-cols-3 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        ราคาทั้งหมด (Subtotal)
      </label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        value={totalPrice.toLocaleString()} // แปลงเป็นรูปแบบตัวเลข
        readOnly
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        ภาษีมูลค่าเพิ่ม (VAT 7%)
      </label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        value={(totalPrice * 0.07).toLocaleString()} // คำนวณ VAT
        readOnly
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        ราคาสุทธิ (Grand Total)
      </label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        value={(totalPrice * 1.07).toLocaleString()} // คำนวณราคาสุทธิ
        readOnly
      />
    </div>
  </div>
</div>        
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="text-lg font-medium mb-4">เงื่อนไขการชำระเงิน</h2>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เงื่อนไขการชำระเงิน
              </label>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-300 rounded appearance-none"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option>เลือกเงื่อนไข</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentMethod}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่ส่งมอบ
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="mm/dd/yyyy"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                {errors.deliveryDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.deliveryDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สถานที่ส่งมอบ
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              rows="2"
              placeholder="ระบุสถานที่ส่งมอบสินค้า"
              name="deliveryLocation"
              value={formData.deliveryLocation}
              onChange={handleInputChange}
            ></textarea>
            {errors.deliveryLocation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.deliveryLocation}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              หมายเหตุ
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              rows="2"
              placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium mb-4">ผู้อนุมัติ</h3>
              <div className="h-20 border-b border-dashed border-gray-300 mb-2"></div>
              <p className="text-sm">วันที่: ____/____/____</p>
            </div>
            <div>
              <h3 className="text-md font-medium mb-4">ผู้ขาย</h3>
              <div className="h-20 border-b border-dashed border-gray-300 mb-2"></div>
              <p className="text-sm">วันที่: ____/____/____</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            บันทึก PO
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseOrderForm;
