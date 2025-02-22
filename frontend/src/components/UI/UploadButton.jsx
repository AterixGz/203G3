import { useState, useEffect } from "react";
import axios from "axios"; // ใช้ axios สำหรับการเชื่อมต่อกับ API
// css import
import "./UploadButton.css";

export default function FileUploader() {
  const [showDropZone, setShowDropZone] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploadReady, setIsUploadReady] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // เพิ่ม state สำหรับการแสดงสถานะการอัพโหลด
  const [uploadError, setUploadError] = useState(null); // เพิ่ม state สำหรับข้อผิดพลาด

  useEffect(() => {
    const handlePaste = (event) => {
      if (showDropZone && event.clipboardData.files.length > 0) {
        handleFileSelect(event.clipboardData.files);
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [showDropZone]);

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      setIsUploadReady(updatedFiles.length > 0);
      return updatedFiles;
    });
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setIsUploadReady(updatedFiles.length > 0);
  };

  const handleUpload = async () => {
    if (files.length > 0) {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      files.forEach(file => formData.append("files", file));

      try {
        // 🚨 ส่วนที่เกี่ยวข้องกับการเชื่อมต่อกับ API
        const response = await axios.post("YOUR_BACKEND_API_URL", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // ระบุประเภทข้อมูล
          },
        });

        console.log("Files uploaded successfully", response.data);
        alert("Files uploaded successfully!");
        setFiles([]);
        setIsUploadReady(false);
        setShowDropZone(false);
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadError("Error uploading files. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCloseDropZone = () => {
    setShowDropZone(false); // ปิดหน้าต่าง
    setFiles([]); // ลบไฟล์ที่เลือกทั้งหมดเมื่อปิดหน้าต่าง
    setIsUploadReady(false); // เปลี่ยนสถานะการอัพโหลดให้เป็น false
  };
  
  return (
    <>
      <div className="upload-container">
        <button className="upload-btn" onClick={() => setShowDropZone(true)}>
          Upload File
        </button>
      </div>
  
      {showDropZone && (
        <div className="overlay">
          <div
            className="drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileSelect(e.dataTransfer.files);
            }}
          >
            <button className="close-btn" onClick={handleCloseDropZone}>
              ✕
            </button>
  
            <h2>Drop files here</h2>
            <p>or</p>
            <input
              type="file"
              id="fileInput"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              hidden
            />
  
            {/* ปุ่ม Choose หรือ Upload */}
            {isUploadReady ? (
              <button className="upload-action-btn" onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            ) : (
              <button
                className="choose-btn"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Choose from my folder
              </button>
            )}
  
            <ul className="file-list">
              {files.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <button className="remove-file-btn" onClick={() => handleRemoveFile(index)}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
  
            {/* หมายเหตุเกี่ยวกับไฟล์ */}
            <p className="file-format-note">
              Supported file formats: PNG, PDF. Max file size: 10MB.
            </p>
  
            {/* ส่วนที่แสดงข้อผิดพลาด */}
            {uploadError && <p className="upload-error">{uploadError}</p>}
          </div>
        </div>
      )}
    </>
  );
  
}
