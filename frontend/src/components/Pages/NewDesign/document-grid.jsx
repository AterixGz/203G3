import { useState, useEffect, useRef } from "react";
import { MoreVertical, Download, Trash2, Edit } from "lucide-react";
import axios from "axios";
export default function DocumentGrid() {
  const [files, setFiles] = useState([]);

  // 🟢 ดึงข้อมูลไฟล์ทุกๆ 3 วินาที
  useEffect(() => {
    const fetchFiles = () => {
      fetch("http://localhost:3000/files")
        .then((res) => res.json())
        .then((data) => {

          setFiles(data.files || []);
        })
        .catch((error) => console.error("❌ Error fetching files:", error));
    };

    fetchFiles(); // ดึงข้อมูลทันทีเมื่อ Component โหลด
    const interval = setInterval(fetchFiles, 2000); // ตั้งค่าให้ดึงข้อมูลทุก 3 วินาที

    return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {Array.isArray(files) && files.length > 0 ? (
          files.map((file) => <DocumentCard key={file.name} file={file} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No files found
          </p>
        )}
      </div>
    </div>
  );

  function DocumentCard({ file }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
      setDropdownOpen((prev) => !prev);
    };

    const closeDropdown = () => {
      setDropdownOpen(false);
    };

    //download
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

        // เคลียร์ URL object เพื่อลดการใช้หน่วยความจำ
        window.URL.revokeObjectURL(url);

        console.log(`✅ ดาวน์โหลดไฟล์ "${file.name}" สำเร็จ`);
      } catch (error) {
        console.error("❌ ดาวน์โหลดไฟล์ไม่สำเร็จ:", error);
      } finally {
        closeDropdown();
      }
    };

    // 🛠️ ฟังก์ชันลบไฟล์
    const handleDelete = async () => {
      const confirmed = window.confirm(`คุณต้องการลบไฟล์ "${file.name}" ใช่หรือไม่?`);
      if (!confirmed) return;

      try {
        const response = await fetch(`http://localhost:3000/files/${file.name}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("❌ ลบไฟล์ไม่สำเร็จ");
        }

        // 💡 ลบไฟล์ออกจาก state เพื่ออัปเดต UI ทันที
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
        console.log(`🗑️ ลบไฟล์ "${file.name}" สำเร็จ`);
      } catch (error) {
        console.error(error.message);
      } finally {
        closeDropdown(); // ปิด dropdown หลังจากลบไฟล์เสร็จ
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
            <button
              onClick={toggleDropdown}
              className="p-1.5 rounded-lg hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-48 py-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
              >
                <a
                  href={file.url}
                  download
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50"
                  onClick={closeDropdown}
                ></a>
                <button
                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50"
                    onClick={handleDownload} // ✅ เรียกฟังก์ชัน download โดยตรง
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50"
                  onClick={closeDropdown}
                >
                  <Edit className="w-4 h-4" />
                  Rename
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-600 hover:bg-gray-50"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <h3 className="font-medium mb-1 truncate">{file.name}</h3>
        <div className="flex items-center gap-2">
        </div>
      </div>
    );
  }
}
