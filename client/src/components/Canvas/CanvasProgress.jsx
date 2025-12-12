import React from 'react'
import Sidebar from '../Sidebar'

const CanvasProgress = () => {
  return (
    <div className="w-full h-screen bg-gray-100">
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6">
        <div className="text-teal-600 font-semibold">Dynamic - CRM</div>
        <div className="ml-6 text-sm text-gray-500">Advance Setting</div>
        <div className="ml-auto flex items-center gap-4">
          <div className="p-2 rounded-full hover:bg-gray-50 cursor-pointer">🔔</div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="text-sm">John Advin<br/><span className="text-xs text-gray-400">Admin</span></div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-56px)]">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="text-sm text-gray-600 mb-6">Create new menu</div>

          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
            <div className="flex justify-end mb-4">
              <button className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4">
              <input className="w-full border border-teal-200 p-3 rounded" placeholder="Enter menu name" />
              <select className="w-full border border-teal-200 p-3 rounded">
                <option>Choose Menu Type</option>
              </select>

              <div className="flex gap-4">
                <input className="flex-1 border border-teal-200 p-3 rounded" placeholder="Visible for Employees" />
                <select className="w-32 border border-teal-200 p-3 rounded">
                  <option>Allow</option>
                </select>
              </div>

              <div>
                <button className="px-4 py-2 bg-white border border-teal-200 text-teal-600 rounded">Save</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CanvasProgress