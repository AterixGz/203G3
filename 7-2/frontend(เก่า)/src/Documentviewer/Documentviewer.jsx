import React, { useState } from 'react';
import './DocumentViewer.css';

function DocumentViewer() {
  const [activeDoc, setActiveDoc] = useState(null);

  const documents = [
    { id: 1, title: "Annual Report 2023", content: "This is the annual report for 2023..." },
    { id: 2, title: "Financial Statement Q4", content: "Financial statement Q4 details..." },
    { id: 3, title: "Project Proposal", content: "Project proposal for the new initiative..." },
    { id: 4, title: "Meeting Minutes", content: "Minutes from the board meeting on..." },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="document-viewer">
      <div className="viewer-header">
        <h2>ระบบจัดการเอกสาร</h2>
        {activeDoc && (
          <button 
            className="print-button"
            onClick={handlePrint}
          >
            🖨
          </button>
        )}
      </div>

      {!activeDoc ? (
        <div className="document-buttons">
          {documents.map((doc) => (
            <button
              key={doc.id}
              className="doc-button"
              onClick={() => setActiveDoc(doc)}
            >
              {doc.title}
            </button>
          ))}
        </div>
      ) : (
        <div className="document-view">
          <div className="document-header">
            <button 
              className="back-button"
              onClick={() => setActiveDoc(null)}
            >
              ← กลับ
            </button>
            <h3>{activeDoc.title}</h3>
          </div>
          <div id="printable-content" className="document-content">
            <p>{activeDoc.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentViewer;