import { useState, useEffect, useRef } from "react";
import { MoreVertical, Download, Trash2, Edit, X } from "lucide-react";
import axios from "axios";
import { createPortal } from "react-dom";

export default function DocumentGrid() {
  const [files, setFiles] = useState([]);

  // ดึงข้อมูลไฟล์ทุกๆ 2 วินาที
  useEffect(() => {
    const fetchFiles = () => {
      fetch("http://localhost:3000/files")
        .then((res) => res.json())
        .then((data) => setFiles(data.files || []))
        .catch((error) => console.error("❌ Error fetching files:", error));
    };

    fetchFiles();
    const interval = setInterval(fetchFiles, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {Array.isArray(files) && files.length > 0 ? (
          files.map((file) => <DocumentCard key={file.name} file={file} setFiles={setFiles} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No files found
          </p>
        )}
      </div>
    </div>
  );
}

function DocumentCard({ file, setFiles }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);
  
  // ฟังก์ชันดาวน์โหลด
  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/download/${file.name}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log(`ดาวน์โหลดไฟล์ "${file.name}" สำเร็จ`);
    } catch (error) {
      console.error(" ดาวน์โหลดไฟล์ไม่สำเร็จ:", error);
    } finally {
      closeDropdown();
    }
  };

  // เปิด Modal ยืนยันลบไฟล์
  const confirmDelete = () => {
    setShowConfirmModal(true);
    closeDropdown();
  };

  // ฟังก์ชันลบไฟล์
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/files/${file.name}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("❌ ลบไฟล์ไม่สำเร็จ");
      }

      setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
      console.log(`🗑️ ลบไฟล์ "${file.name}" สำเร็จ`);
    } catch (error) {
      console.error(error.message);
    } finally {
      setShowConfirmModal(false);
    }
  };

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-gray-900/10 flex items-center justify-center">
          <span className="text-xs font-medium text-primary">
            {file.name.split(".").pop().toUpperCase()}
          </span>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="p-1.5 rounded-lg hover:bg-gray-100">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 py-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50" onClick={handleDownload}>
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-600 hover:bg-gray-50" onClick={confirmDelete}>
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <h3 className="font-medium mb-1 truncate">{file.name}</h3>

      {showConfirmModal && <DeleteConfirmModal fileName={file.name} onCancel={() => setShowConfirmModal(false)} onConfirm={handleDelete} />}
    </div>
  );
}

// 🛠️ Component Popup ยืนยันลบไฟล์
function DeleteConfirmModal({ fileName, onCancel, onConfirm }) {
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-grey bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-5 rounded-lg shadow-lg w-80">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Confirm Delete</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-950">คุณต้องการลบไฟล์ "{fileName}" ใช่หรือไม่?</p>
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
