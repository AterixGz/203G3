import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
// เพิ่ม import date-fns
import { format, parse } from 'date-fns';
import th from 'date-fns/locale/th';

const PurchaseOrderForm = () => {
  const [approvedPRs, setApprovedPRs] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  // เพิ่ม state
  const [selectedPR, setSelectedPR] = useState(null);
  const [showPRSelection, setShowPRSelection] = useState(false);

  // เพิ่ม state สำหรับ generate PO number
  const [poNumber, setPoNumber] = useState("");

  // เพิ่มฟังก์ชัน generatePONumber
  const generatePONumber = () => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2); // 2 หลักสุดท้ายของปี
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // เดือนแบบ 2 หลัก
    const day = today.getDate().toString().padStart(2, '0'); // วันแบบ 2 หลัก
    const random = Math.floor(1000 + Math.random() * 9000); // สุ่มเลข 4 หลัก
    
    // รูปแบบ: PO-YYMMDDxxxx
    // YY = ปี 2 หลัก, MM = เดือน, DD = วัน, xxxx = เลขสุ่ม 4 หลัก
    return `PO-${year}${month}${day}${random}`;
  };

  // เพิ่มฟังก์ชันสำหรับเลือก PR
  const handlePRSelect = (pr) => {
    setSelectedPR(pr);
    setFormData({
      ...formData,
      prReference: pr.prNumber,
      prDate: pr.date,
      vendorName: pr.vendor || '',
      department: pr.department,
      requester: pr.requester,
      purpose: pr.purpose,
      totalAmount: calculateTotalPrice(pr.items)
    });
    setShowPRSelection(false);
  };

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

    // เพิ่มการ validate วันที่
    if (!formData.poDate) {
      newErrors.poDate = "กรุณาระบุวันที่";
    } else {
      const poDate = new Date(formData.poDate);
      const today = new Date();
      if (poDate > today) {
        newErrors.poDate = "วันที่ไม่สามารถเป็นวันในอนาคต";
      }
    }

    // validate อื่นๆ ที่มีอยู่เดิม...
    if (!formData.vendorName) newErrors.vendorName = "กรุณาระบุชื่อผู้ขาย";
    if (!formData.taxId) newErrors.taxId = "กรุณาระบุเลขประจำตัวผู้เสียภาษี";
    // ...

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPR) {
      alert("กรุณาเลือก PR");
      return;
    }
  
    if (validateForm()) {
      const poData = {
        poNumber: formData.poNumber,
        poDate: formData.poDate,
        prReference: formData.prReference,
        vendorInfo: {
          name: formData.vendorName,
          taxId: formData.taxId,
          address: formData.address,
          contact: formData.contact,
          phone: formData.phone,
        },
        items: selectedPR.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
        })),
        summary: {
          subtotal: totalPrice,
          vat: totalPrice * 0.07,
          total: totalPrice * 1.07,
        },
        remainingBalance: totalPrice * 1.07,
        terms: {
          paymentMethod: formData.paymentMethod,
          deliveryDate: formData.deliveryDate,
          deliveryLocation: formData.deliveryLocation,
          notes: formData.notes,
        },
        status: "ยังไม่ชำระ",
        createdAt: new Date().toISOString(),
      };
  
      try {
        const response = await fetch("http://localhost:3000/api/purchase-orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(poData),
        });
  
        if (response.ok) {
          alert("บันทึก PO เรียบร้อยแล้ว");
          navigate("/purchase-orders");
        } else {
          throw new Error("Failed to create PO");
        }
      } catch (error) {
        console.error("Error creating PO:", error);
        alert("เกิดข้อผิดพลาดในการบันทึก PO");
      }
    }
  };

  const handleCancel = () => {
    if (window.confirm("ต้องการยกเลิกการสร้าง PO หรือไม่?")) {
      navigate("/purchase-orders");
    }
  };

  // แก้ไขฟังก์ชัน calculateTotalPrice
  const calculateTotalPrice = (items) => {
    if (!items) return 0;
    return items.reduce((total, item) => {
      return total + (Number(item.quantity) * Number(item.price));
    }, 0);
  };

  const [totalPrice, setTotalPrice] = useState(0);

  // แก้ไขส่วน useEffect สำหรับคำนวณราคารวม
  useEffect(() => {
    if (selectedPR) {
      const total = calculateTotalPrice(selectedPR.items);
      setTotalPrice(total);
    }
  }, [selectedPR]);

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

  // แก้ไข useEffect เพื่อ generate PO number เมื่อโหลดหน้า
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      poNumber: generatePONumber(),
      poDate: format(new Date(), 'yyyy-MM-dd') // กำหนดวันที่ปัจจุบัน
    }));
  }, []);

  // เพิ่มฟังก์ชัน formatDate
  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy', { locale: th });
  };

  // เพิ่มฟังก์ชัน parseDate
  const parseDate = (dateString) => {
    if (!dateString) return '';
    return format(parse(dateString, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd');
  };

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
              className="w-full p-2 border border-gray-300 rounded bg-gray-50"
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
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                name="poDate"
                value={formData.poDate}
                onChange={handleInputChange}
              />
              {errors.poDate && (
                <p className="text-red-500 text-sm mt-1">{errors.poDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* ส่วนข้อมูล PR */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อ้างอิงเลขที่ PR
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.prReference}
                readOnly
              />
              <button
                type="button"
                onClick={() => setShowPRSelection(true)}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                เลือก PR
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันที่อนุมัติ PR
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.prDate}
              readOnly
            />
          </div>
        </div>

        {/* แสดง Modal เมื่อกดปุ่มเลือก PR */}
        {showPRSelection && (
          <PRSelectionModal
            approvedPRs={approvedPRs}
            onSelect={handlePRSelect}
            onClose={() => setShowPRSelection(false)}
          />
        )}

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
          <h1 className="text-xl font-medium mb-6">รายการสินค้าจาก PR</h1>
          
          {selectedPR ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 px-4 text-left">เลขที่ PR</th>
                    <th className="py-2 px-4 text-left">วันที่</th>
                    <th className="py-2 px-4 text-left">ผู้ขอ</th>
                    <th className="py-2 px-4 text-left">รายการสินค้า</th>
                    <th className="py-2 px-4 text-right">ราคารวม</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4">{selectedPR.prNumber}</td>
                    <td className="py-3 px-4">{selectedPR.date}</td>
                    <td className="py-3 px-4">{selectedPR.requester}</td>
                    <td className="py-3 px-4">
                      <table className="w-full">
                        <tbody>
                          {selectedPR.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.name}</td>
                              <td className="text-center">{item.quantity} {item.unit}</td>
                              <td className="text-right">{Number(item.price).toLocaleString()} บาท</td>
                              <td className="text-right">
                                {(Number(item.quantity) * Number(item.price)).toLocaleString()} บาท
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {calculateTotalPrice(selectedPR.items).toLocaleString()} บาท
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">กรุณาเลือก PR เพื่อดูรายการสินค้า</p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="text-lg font-medium mb-4">รายการสินค้า</h2>
          {selectedPR ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 px-4 text-left">รายการ</th>
                  <th className="py-2 px-4 text-center">จำนวน</th>
                  <th className="py-2 px-4 text-center">หน่วย</th>
                  <th className="py-2 px-4 text-right">ราคาต่อหน่วย</th>
                  <th className="py-2 px-4 text-right">รวม</th>
                </tr>
              </thead>
              <tbody>
                {selectedPR.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-center">{item.unit}</td>
                    <td className="py-3 px-4 text-right">
                      {Number(item.price).toLocaleString()} บาท
                    </td>
                    <td className="py-3 px-4 text-right">
                      {(Number(item.quantity) * Number(item.price)).toLocaleString()} บาท
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-4">กรุณาเลือก PR</p>
          )}
        </div>
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="text-lg font-medium mb-4">สรุปราคาทั้งหมด</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ราคารวม (Subtotal)
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={`${totalPrice.toLocaleString()} บาท`}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ภาษีมูลค่าเพิ่ม (7%)
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={`${(totalPrice * 0.07).toLocaleString()} บาท`}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ราคาสุทธิ
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={`${(totalPrice * 1.07).toLocaleString()} บาท`}
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

const PRSelectionModal = ({ approvedPRs, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">เลือกใบขอซื้อ (PR)</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">เลขที่ PR</th>
              <th className="py-2 text-left">วันที่</th>
              <th className="py-2 text-left">ผู้ขอ</th>
              <th className="py-2 text-left">วัตถุประสงค์</th>
              <th className="py-2 text-left">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {approvedPRs.map((pr) => (
              <tr key={pr.prNumber} className="border-b">
                <td className="py-2">{pr.prNumber}</td>
                <td className="py-2">{pr.date}</td>
                <td className="py-2">{pr.requester}</td>
                <td className="py-2">{pr.purpose}</td>
                <td className="py-2">
                  <button
                    onClick={() => onSelect(pr)}
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

export default PurchaseOrderForm;
