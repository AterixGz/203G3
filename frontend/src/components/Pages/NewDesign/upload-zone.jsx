import { Upload, X } from "lucide-react"

export default function UploadZone() {
  return (
    <div className="p-4 sm:p-8">
      <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 hover:border-primary transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-gray-900">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="font-medium mb-1">Drop your files here</h3>
            <p className="text-sm text-gray-500 hidden sm:block">or click to browse</p>
          </div>
          <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-900/90 transition-colors">
            Select Files
          </button>
        </div>
      </div>

      {/* Upload Preview */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-gray-100 flex items-center justify-center">
            <span className="text-xs font-medium">.PDF</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">Document.pdf</h4>
            <div className="w-full h-1.5 rounded-full bg-gray-100 mt-2">
              <div className="w-2/3 h-full rounded-full bg-gray-900"></div>
            </div>
          </div>
          <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}

