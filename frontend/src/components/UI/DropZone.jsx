import { Upload, X, Trash2 } from "lucide-react" // เพิ่ม Trash2
import { useState, useEffect } from "react"
import axios from "axios"
import "./DropZone.css"


export default function DropZone() {
    const [files, setFiles] = useState([]);
    const [fileProgress, setFileProgress] = useState({});
    const [isUploadReady, setIsUploadReady] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    useEffect(() => {
        const handlePaste = (event) => {
            if (event.clipboardData.files.length > 0) {
                handleFileSelect(event.clipboardData.files);
            }
        };
        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, []);

    useEffect(() => {
        handleMouseDrag();
    }, [files]); // Re-initialize when files change

    useEffect(() => {
        const cleanup = handleMouseDrag();
        return () => {
            if (cleanup) cleanup();
        };
    }, [files]);

    // ในส่วนของ handleFileSelect
    const handleFileSelect = async (selectedFiles) => {
        const newFiles = Array.from(selectedFiles);

        // Initialize progress for new files
        const newProgress = {};
        newFiles.forEach(file => {
            newProgress[file.name] = 0;
        });
        setFileProgress(prev => ({ ...prev, ...newProgress }));

        // Process each file
        await Promise.all(newFiles.map(async (file) => {
            // Simulate gradual progress
            for (let progress = 0; progress <= 100; progress += 5) {
                setFileProgress(prev => ({
                    ...prev,
                    [file.name]: progress
                }));
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }));

        setFiles(prevFiles => {
            const updatedFiles = [...prevFiles, ...newFiles];
            setIsUploadReady(updatedFiles.length > 0);
            return updatedFiles;
        });
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
                setFileProgress({});
            } catch (error) {
                console.error("Upload failed:", error);
                setUploadError("Error uploading files. Please try again.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleRemoveFile = (index) => {
        const fileToRemove = files[index];
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        setIsUploadReady(updatedFiles.length > 0);
        setFileProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileToRemove.name];
            return newProgress;
        });
    };

    const handleMouseDrag = () => {
        const slider = document.querySelector('.preview-container');
        // ตรวจสอบว่า slider มีอยู่จริง
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

        // Cleanup function
        return () => {
            slider.removeEventListener('mousedown', mouseDownHandler);
            slider.removeEventListener('mouseleave', mouseLeaveHandler);
            slider.removeEventListener('mouseup', mouseUpHandler);
            slider.removeEventListener('mousemove', mouseMoveHandler);
        };
    };

    return (
        <div className="drop-zone-container">
            <div
                className="drop-zone-wrapper"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    handleFileSelect(e.dataTransfer.files);
                }}
            >
                <div className="content-container">
                    <div className="upload-icon-container">
                        <Upload className="upload-icon" />
                    </div>
                    <div className="text-container">
                        <h3 className="main-text">Drop files here</h3>
                        <p className="sub-text">or click to browse</p>
                    </div>
                    <input
                        type="file"
                        id="fileInput"
                        multiple
                        onChange={(e) => handleFileSelect(e.target.files)}
                        hidden
                    />
                    {isUploadReady ? (
                        <button
                            className="select-button upload-ready"
                            onClick={handleUpload}
                            disabled={isUploading}
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </button>
                    ) : (
                        <button
                            className="select-button"
                            onClick={() => document.getElementById("fileInput").click()}
                        >
                            Select Files
                        </button>
                    )}
                </div>
            </div>

            {files.length > 0 && (
                <>
                    <div className="preview-container">
                        {files.map((file, index) => (
                            <div key={index} className="file-preview">
                                <div className="file-icon">
                                    <span className="file-extension">
                                        {file.name.split('.').pop().toUpperCase()}
                                    </span>
                                </div>
                                <div className="file-info">
                                    <h4 className="file-name">{file.name}</h4>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${fileProgress[file.name]}%`,
                                                transition: 'width 0.5s ease-out'
                                            }}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="remove-button"
                                    onClick={() => handleRemoveFile(index)}
                                >
                                    <X className="remove-icon" />
                                </button>
                            </div>
                        ))}
                    </div>
                    {files.length >= 5 && (
                        <button
                            className="delete-all-button"
                            onClick={() => {
                                setFiles([]);
                                setFileProgress({});
                                setIsUploadReady(false);
                            }}
                        >
                            <Trash2 className="delete-all-icon" />
                            Delete All
                        </button>
                    )}
                </>
            )}

            {uploadError && <p className="upload-error">{uploadError}</p>}
        </div>
    );
}