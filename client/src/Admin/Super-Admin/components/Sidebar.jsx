import React, { useState } from 'react'

const MenuItem = ({ children, icon, onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 ${active ? 'bg-gray-100 font-medium' : 'text-gray-700'}`}
  >
    <span className="w-5 h-5 flex items-center justify-center text-teal-600" aria-hidden>
      {icon}
    </span>
    <span className="text-sm">{children}</span>
  </button>
)

const Sidebar = () => {
  const [open, setOpen] = useState(true)
  const [active, setActive] = useState('Dashboard')

  const items = [
    'Dashboard',
    'Registered Client',
    'New Client',
    'Create Client',
    'Manage Client',
  ]

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 p-4">
      <div className="mb-6">
        <div className="text-teal-600 font-semibold">Super Admin</div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setOpen(s => !s)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-medium"> client</span>
          </div>
          <svg className={`w-4 h-4 text-gray-500 transform ${open ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4l8 6-8 6V4z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="space-y-1">
          {items.map(item => (
            <MenuItem
              key={item}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" fill="currentColor" />
                </svg>
              }
              onClick={() => setActive(item)}
              active={active === item}
            >
              {item}
            </MenuItem>
          ))}
        </nav>
      )}

      <div className="mt-6 text-xs text-gray-500">Version 1.0</div>
    </aside>
  )
}

export default Sidebar