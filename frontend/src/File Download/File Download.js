
function App() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const downloadFile = () => {
        if (!file) return;

        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <input type="file" onChange={handleFileChange} />
            <button onClick={downloadFile} disabled={!file}>Download</button>
        </>
    );
}


// Node.js (Express) API สำหรับให้บริการดาวน์โหลดไฟล์
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Endpoint สำหรับดาวน์โหลดไฟล์
app.post('/download', (req, res) => {
    const { filename } = req.body;
    const filePath = path.join(__dirname, 'files', filename);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    
    res.download(filePath, filename, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error downloading file' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// ฟังก์ชันสำหรับดาวน์โหลดไฟล์ผ่าน HTTP POST ด้วย JavaScript Fetch API
// async function downloadFile(filename) {
//     try {
//         const response = await fetch('http://localhost:3000/download', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ filename })
//         });

//         if (!response.ok) {
//             throw new Error(`Failed to download file: ${filename}`);
//         }

//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
        
//         // สร้างลิงก์สำหรับดาวน์โหลดไฟล์
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
        
//         // ล้างค่า URL object
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//         console.log(`File downloaded: ${filename}`);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }
