import { useState, useEffect } from "react";
import axios from "axios";
import "./UploadButton.css";

export default function FileUploader({ isOpen, onClose }) {
  const [files, setFiles] = useState([]);
  const [isUploadReady, setIsUploadReady] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const handlePaste = (event) => {
      if (isOpen && event.clipboardData.files.length > 0) {
        handleFileSelect(event.clipboardData.files);
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [isOpen]);

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      setIsUploadReady(updatedFiles.length > 0);
      return updatedFiles;
    });
  };

  useEffect(() => {
    if (isOpen) {
      const cleanup = handleMouseDrag();
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, [isOpen, files]);

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
      files.forEach(file => formData.append("file", file));
      

      try {
        const response = await axios.post("http://localhost:3000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Files uploaded successfully", response.data);
        setFiles([]);
        setIsUploadReady(false);
        onClose();
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadError("Error uploading files. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCloseDropZone = () => {
    setFiles([]);
    setIsUploadReady(false);
    onClose();
  };

  const handleMouseDrag = () => {
    const slider = document.querySelector('.file-list');
    if (!slider) return;

    let isDown = false;
    let startY;
    let scrollTop;

    const mouseDownHandler = (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startY = e.pageY - slider.offsetTop;
      scrollTop = slider.scrollTop;
    };

    const mouseLeaveHandler = () => {
      isDown = false;
      slider.style.cursor = 'grab';
    };

    const mouseUpHandler = () => {
      isDown = false;
      slider.style.cursor = 'grab';
    };

    const mouseMoveHandler = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const y = e.pageY - slider.offsetTop;
      const walk = y - startY;
      slider.scrollTop = scrollTop - walk;
    };

    slider.addEventListener('mousedown', mouseDownHandler);
    slider.addEventListener('mouseleave', mouseLeaveHandler);
    slider.addEventListener('mouseup', mouseUpHandler);
    slider.addEventListener('mousemove', mouseMoveHandler);

    return () => {
      slider.removeEventListener('mousedown', mouseDownHandler);
      slider.removeEventListener('mouseleave', mouseLeaveHandler);
      slider.removeEventListener('mouseup', mouseUpHandler);
      slider.removeEventListener('mousemove', mouseMoveHandler);
    };
  };
  
  return (
    <>
      {isOpen && (
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
            <p>or</p><br />
            <input
              type="file"
              id="fileInput"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              hidden
            />
  
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
  
            <p className="file-format-note">
              Supported file formats: PNG, PDF. Max file size: 10MB.
            </p>
  
            {uploadError && <p className="upload-error">{uploadError}</p>}
          </div>
        </div>
      )}
    </>
  );
}