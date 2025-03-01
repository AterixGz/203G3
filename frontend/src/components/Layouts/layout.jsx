"use client"

import { Menu, Search, Bell, User, Upload, X, Home, FolderOpen, Star, Clock, Settings } from "lucide-react"
import { useState } from "react"

export default function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: FolderOpen, label: "All Documents" },
    { icon: Clock, label: "Recent" },
    { icon: Star, label: "Starred" },
    { icon: Upload, label: "Uploads" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Header */}
      <div className="sticky top-0 z-30 lg:hidden bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 p-4">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gray-900"></div>
            <span className="font-semibold text-gray-900">DocManager</span>
          </div>
        </div>
      </div>

      {/* Enhanced Sidebar */}
      <aside
        className={`
        fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200
        w-[300px] z-50 transition-all duration-300 ease-in-out lg:translate-x-0 lg:w-64
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gray-900"></div>
                <h1 className="font-semibold text-xl text-gray-900">DocManager</h1>
              </div>
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="lg:hidden relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <a
                    key={index}
                    href="#"
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                      ${item.active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}
                    `}
                  >
                    <Icon className={`w-5 h-5 ${item.active ? "text-white" : "text-gray-500"}`} />
                    <span className="font-medium">{item.label}</span>
                  </a>
                )
              })}
            </div>

            {/* Categories Section */}
            <div className="mt-8">
              <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Categories</h3>
              <div className="space-y-1">
                <a href="#" className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-xl hover:bg-gray-100">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Work
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-xl hover:bg-gray-100">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Personal
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-xl hover:bg-gray-100">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Projects
                </a>
              </div>
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">John Doe</h4>
                <p className="text-xs text-gray-500">john@example.com</p>
              </div>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-0 lg:pt-4 px-4 pb-4">
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <Header />
        </div>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  )
}

function Header() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 w-full max-w-xl">
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gray-900"></span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium">Profile</span>
        </button>
      </div>
    </header>
  )
}

