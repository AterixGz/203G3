import { MoreVertical, Download, Trash2, Edit } from "lucide-react"

export default function DocumentGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      <DocumentCard />
      <DocumentCard />
      <DocumentCard />
      {/* More cards... */}
    </div>
  )
}

function DocumentCard() {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-gray-900/10 flex items-center justify-center">
          <span className="text-xs font-medium text-primary">.PDF</span>
        </div>
        <div className="relative">
          <button className="p-1.5 rounded-lg hover:bg-gray-100">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          <div
            className="absolute right-0 top-full mt-1 w-48 py-2 bg-white rounded-lg shadow-lg border border-gray-200 
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all
                        z-10"
          >
            <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50">
              <Edit className="w-4 h-4" />
              Rename
            </button>
            <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-600 hover:bg-gray-50">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <h3 className="font-medium mb-1 truncate">Project Proposal.pdf</h3>
      <p className="text-sm text-gray-500 mb-4">1.2 MB • Modified 2 days ago</p>

      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-gray-200"></div>
          <div className="w-6 h-6 rounded-full bg-gray-300"></div>
        </div>
        <span className="text-sm text-gray-500">Shared with 2 people</span>
      </div>
    </div>
  )
}

