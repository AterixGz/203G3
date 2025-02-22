import React, { useState, useRef } from "react";

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  // ฟังก์ชันอัปโหลดไฟล์
  const uploadFile = async (event) => {
    event.preventDefault();
    if (!fileInputRef.current.files[0]) return alert("Please select a file!");

    const formData = new FormData();
    // เพิ่มไฟล์ที่เลือก
    formData.append("file", fileInputRef.current.files[0]);  // key ต้องเป็น 'file' ตามที่ Backend ระบุ

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      setUploadedFile(result.file);  // เก็บข้อมูลของไฟล์ที่อัปโหลด
      alert("Upload Success: " + result.file.filename);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload Failed: " + error.message);
    }
  };

  return (
   <></>
  );
}

export default App;
