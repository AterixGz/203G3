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
    paymentMethod: "โอนเงินธนาคาร", // default payment method
    deliveryDate: "",
    deliveryLocation: "",
    notes: "",
    approver: "ผู้บริหาร", // default approver
    sellerName: "", // will be filled from vendor selection
  });

  const [errors, setErrors] = useState({});

  // เพิ่ม state
  const [selectedPR, setSelectedPR] = useState(null);
  const [showPRSelection, setShowPRSelection] = useState(false);

  // เพิ่ม state สำหรับ generate PO number
  const [poNumber, setPoNumber] = useState("");

  // Inside PurchaseOrderForm component
  const [vendors, setVendors] = useState([]);
  const [showVendorSelection, setShowVendorSelection] = useState(false);

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
    
    if (!validateForm()) {
      return;
    }

    const poData = {
      poNumber: formData.poNumber,
      poDate: new Date().toISOString().split('T')[0],
      prReference: formData.prReference,
      prDate: formData.prDate,
      vendor: {
        name: formData.vendorName,
        taxId: formData.taxId,
        address: formData.address,
        contact: formData.contact,
        phone: formData.phone
      },
      items: selectedPR.items,
      subtotal: totalPrice,
      vat: totalPrice * 0.07,
      total: totalPrice * 1.07,
      paymentMethod: "โอนเงินธนาคาร",
      deliveryDate: formData.deliveryDate,
      deliveryLocation: formData.deliveryLocation,
      notes: formData.notes,
      approver: "ผู้บริหาร",
      sellerName: formData.vendorName,
      status: "pending"
    };

    try {
      const response = await fetch('http://localhost:3000/api/po-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(poData)
      });

      if (!response.ok) {
        throw new Error('Failed to save PO');
      }

      const result = await response.json();
      alert('บันทึกข้อมูล PO สำเร็จ');
      navigate('/po-list'); // หรือเปลี่ยนเส้นทางไปยังหน้าที่ต้องการ
    } catch (error) {
      console.error('Error saving PO:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
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

  // Add useEffect to fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/company/list');
        if (!response.ok) throw new Error('Failed to fetch vendors');
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };
    
    fetchVendors();
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

  // Add handleVendorSelect function
  const handleVendorSelect = (vendor) => {
    setFormData(prev => ({
      ...prev,
      vendorName: vendor.companyName,
      taxId: vendor.taxId,
      address: vendor.address,
      contact: vendor.contactName,
      phone: vendor.phone,
      sellerName: vendor.companyName // Add this line
    }));
    setShowVendorSelection(false);
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">ข้อมูลผู้ขาย</h2>
            <button
              type="button"
              onClick={() => setShowVendorSelection(true)}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
            >
              เลือกผู้ขาย
            </button>
          </div>
          
          {/* Existing vendor form fields */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อผู้ขาย
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                name="vendorName"
                value={formData.vendorName}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เลขประจำตัวผู้เสียภาษี
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                name="taxId"
                value={formData.taxId}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ที่อยู่
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                name="address"
                value={formData.address}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ผู้ติดต่อ
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                name="contact" 
                value={formData.contact}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เบอร์โทรศัพท์
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                name="phone"
                value={formData.phone}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Add modal */}
        {showVendorSelection && (
          <VendorSelectionModal
            vendors={vendors}
            onSelect={handleVendorSelect}
            onClose={() => setShowVendorSelection(false)}
          />
        )}

        <div className="border-t border-gray-200 pt-6 mb-6">
          {/* เพิ่มคำอธิบายหัวเรื่อง */}
          <div className="mb-4">
            <h2 className="text-lg font-medium">รายการสินค้า</h2>
            <p className="text-sm text-gray-600">รายการสินค้าที่สั่งซื้อจาก PR ที่ได้รับการอนุมัติ</p>
          </div>

          {selectedPR ? (
            <div>
              {/* เพิ่มคำอธิบายรายการ */}
              <div className="mb-3 text-sm text-gray-600">
                <p>ข้อมูลจาก PR เลขที่: {selectedPR.prNumber}</p>
                <p>ผู้ขอ: {selectedPR.requester}</p>
                <p>วัตถุประสงค์: {selectedPR.purpose}</p>
              </div>

              <table className="w-full border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 px-4 text-left w-[35%]">รายการ</th>
                    <th className="py-2 px-4 text-center w-[15%]">จำนวน</th>
                    <th className="py-2 px-4 text-center w-[15%]">หน่วย</th>
                    <th className="py-2 px-4 text-right w-[17.5%]">ราคาต่อหน่วย</th>
                    <th className="py-2 px-4 text-right w-[17.5%]">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPR.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left whitespace-normal">{item.name}</td>
                      <td className="py-2 px-4 text-center">{item.quantity}</td>
                      <td className="py-2 px-4 text-center">{item.unit}</td>
                      <td className="py-2 px-4 text-right">
                        {Number(item.price).toLocaleString()} บาท
                      </td>
                      <td className="py-2 px-4 text-right">
                        {(Number(item.quantity) * Number(item.price)).toLocaleString()} บาท
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                value="โอนเงินธนาคาร"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
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
                    viewBox="0 24 24"
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
              <p className="text-sm font-medium">ผู้บริหาร</p>
              <p className="text-sm">วันที่: {new Date().toLocaleDateString('th-TH')}</p>
            </div>
            <div>
              <h3 className="text-md font-medium mb-4">ผู้ขาย</h3>
              <div className="h-20 border-b border-dashed border-gray-300 mb-2"></div>
              <p className="text-sm font-medium">{formData.sellerName}</p>
              <p className="text-sm">วันที่: {new Date().toLocaleDateString('th-TH')}</p>
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

const VendorSelectionModal = ({ vendors, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 background-sudHod flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">เลือกผู้ขาย</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">ชื่อบริษัท</th>
              <th className="px-4 py-2 text-left">เลขประจำตัวผู้เสียภาษี</th>
              <th className="px-4 py-2 text-left">ที่อยู่</th>
              <th className="px-4 py-2 text-left">ผู้ติดต่อ</th>
              <th className="px-4 py-2 text-left">เบอร์โทร</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{vendor.companyName}</td>
                <td className="px-4 py-2">{vendor.taxId}</td>
                <td className="px-4 py-2">{vendor.address}</td>
                <td className="px-4 py-2">{vendor.contactName}</td>
                <td className="px-4 py-2">{vendor.phone}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => onSelect(vendor)}
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
