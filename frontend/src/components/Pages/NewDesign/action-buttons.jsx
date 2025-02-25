import { Plus, Filter, Grid, List } from "lucide-react"
import { useState } from "react"
import FileUploader from "../../UI/UploadButton"

export default function ActionButtons() {
  const [showUploader, setShowUploader] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowUploader(true)}
            className="upload-btn"
          >
            <span className="plus-sign">+</span>
            New Upload
          </button>
          {/* <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center sm:justify-start gap-2">
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filter</span>
          </button> */}
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg self-end sm:self-auto">
          {/* <button className="p-2 rounded-lg bg-white shadow-sm">
            <Grid className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all">
            <List className="w-5 h-5" />
          </button> */}
        </div>
      </div>

      <FileUploader 
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
      />
    </>
  )
}