import React, { useState, useRef, useEffect } from 'react'

const TestCanvas = () => {
  const [elements, setElements] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [tool, setTool] = useState('select')
  const [isDragging, setIsDragging] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [drawStart, setDrawStart] = useState(null)
  const [resizeHandle, setResizeHandle] = useState(null)
  const canvasRef = useRef(null)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [groups, setGroups] = useState([])
  const [nextGroupId, setNextGroupId] = useState(1)
  const [leftSidebarPos, setLeftSidebarPos] = useState({ x: 20, y: 80 })
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false)
  const [sidebarDragStart, setSidebarDragStart] = useState({ x: 0, y: 0 })
  const [canvasHeight, setCanvasHeight] = useState(3000)
  const [showPageModal, setShowPageModal] = useState(false)
  const [editingElement, setEditingElement] = useState(null)
  const [draggedLayer, setDraggedLayer] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setCanvasOffset({ x: rect.left, y: rect.top })
    }
  }, [])

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDraggingSidebar) {
        setLeftSidebarPos({
          x: e.clientX - sidebarDragStart.x,
          y: e.clientY - sidebarDragStart.y
        })
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDraggingSidebar) {
        setIsDraggingSidebar(false)
      }
    }

    if (isDraggingSidebar) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDraggingSidebar, sidebarDragStart])

  const createElementAtPosition = (x, y, width, height) => {
    const newElement = {
      id: Date.now(),
      type: 'box',
      elementType: 'box',
      x,
      y,
      width,
      height,
      rotation: 0,
      color: '#000000',
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      borderWidth: 2,
      text: 'Element',
      placeholder: '',
      fontSize: 14,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      borderRadius: 4,
      textAlign: 'left',
      groupId: null,
      options: []
    }
    setElements([...elements, newElement])
    setSelectedIds([newElement.id])
    setTool('select')
  }

  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-area')) {
      if (!e.shiftKey) {
        setSelectedIds([])
      }
    }

    if (tool === 'box') {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - 50) / zoom
      const y = (e.clientY - rect.top - 50) / zoom
      
      setIsDrawing(true)
      setDrawStart({ x, y })
    }
  }

  const handleElementMouseDown = (e, id) => {
    e.stopPropagation()
    
    if (e.shiftKey) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
      } else {
        setSelectedIds([...selectedIds, id])
      }
    } else {
      if (!selectedIds.includes(id)) {
        setSelectedIds([id])
      }
    }
    
    setIsDragging(true)
    const rect = canvasRef.current.getBoundingClientRect()
    const element = elements.find(el => el.id === id)
    const mouseX = (e.clientX - rect.left - 50) / zoom
    const mouseY = (e.clientY - rect.top - 50) / zoom
    setDragStart({
      x: mouseX - element.x,
      y: mouseY - element.y
    })
  }

  const handleResizeMouseDown = (e, handle) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
    const rect = canvasRef.current.getBoundingClientRect()
    setDragStart({
      x: (e.clientX - rect.left - 50) / zoom,
      y: (e.clientY - rect.top - 50) / zoom
    })
  }

  const handleMouseMove = (e) => {
    if (isDraggingSidebar) {
      return
    }

    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left - 50) / zoom
    const mouseY = (e.clientY - rect.top - 50) / zoom

    if (isDrawing && drawStart) {
      setDragStart({ x: mouseX, y: mouseY })
      return
    }

    if (isDragging && selectedIds.length > 0) {
      const canvasWidth = 3000
      
      setElements(elements.map(el => {
        if (selectedIds.includes(el.id)) {
          const newX = Math.max(0, Math.min(canvasWidth - el.width, mouseX - dragStart.x))
          const newY = Math.max(0, Math.min(canvasHeight - el.height, mouseY - dragStart.y))
          return {
            ...el,
            x: newX,
            y: newY
          }
        }
        return el
      }))
    }

    if (isResizing && selectedIds.length === 1) {
      const selectedId = selectedIds[0]
      setElements(elements.map(el => {
        if (el.id === selectedId) {
          const deltaX = mouseX - dragStart.x
          const deltaY = mouseY - dragStart.y

          let updates = {}

          if (resizeHandle.includes('e')) {
            updates.width = Math.max(20, el.width + deltaX)
          }
          if (resizeHandle.includes('s')) {
            updates.height = Math.max(20, el.height + deltaY)
          }
          if (resizeHandle.includes('w')) {
            updates.width = Math.max(20, el.width - deltaX)
            updates.x = el.x + deltaX
          }
          if (resizeHandle.includes('n')) {
            updates.height = Math.max(20, el.height - deltaY)
            updates.y = el.y + deltaY
          }

          return { ...el, ...updates }
        }
        return el
      }))

      setDragStart({ x: mouseX, y: mouseY })
    }
  }

  const handleMouseUp = (e) => {
    if (isDrawing && drawStart) {
      const rect = canvasRef.current.getBoundingClientRect()
      const mouseX = (e.clientX - rect.left - 50) / zoom
      const mouseY = (e.clientY - rect.top - 50) / zoom

      const width = Math.abs(mouseX - drawStart.x)
      const height = Math.abs(mouseY - drawStart.y)

      if (width > 10 && height > 10) {
        const x = Math.min(drawStart.x, mouseX)
        const y = Math.min(drawStart.y, mouseY)
        createElementAtPosition(x, y, width, height)
      }
      setDrawStart(null)
    }

    setIsDragging(false)
    setIsDrawing(false)
    setIsResizing(false)
    setResizeHandle(null)
    setIsDraggingSidebar(false)
  }

  const deleteSelected = () => {
    setElements(elements.filter(el => !selectedIds.includes(el.id)))
    setSelectedIds([])
  }

  const duplicateSelected = () => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id))
    const newElements = selectedElements.map(el => ({
      ...el,
      id: Date.now() + Math.random(),
      x: el.x + 20,
      y: el.y + 20
    }))
    setElements([...elements, ...newElements])
    setSelectedIds(newElements.map(el => el.id))
  }

  const updateProperty = (property, value) => {
    setElements(elements.map(el => {
      if (selectedIds.includes(el.id)) {
        return { ...el, [property]: value }
      }
      return el
    }))
  }

  const changeElementType = (newType) => {
    setElements(elements.map(el => {
      if (selectedIds.includes(el.id)) {
        const updates = { elementType: newType }
        
        if (newType === 'input') {
          updates.text = 'Input'
          updates.placeholder = 'Enter text...'
          updates.height = 40
        } else if (newType === 'button') {
          updates.text = 'Button'
          updates.height = 40
          updates.backgroundColor = '#3B82F6'
          updates.color = '#ffffff'
        } else if (newType === 'text') {
          updates.text = 'Text Label'
          updates.height = 30
        } else if (newType === 'dropdown') {
          updates.text = 'Select...'
          updates.height = 40
          updates.options = ['Option 1', 'Option 2', 'Option 3']
        } else if (newType === 'radio') {
          updates.text = 'Radio Button'
          updates.height = 30
          updates.width = 150
        } else if (newType === 'toggle') {
          updates.text = 'Toggle'
          updates.height = 30
          updates.width = 60
        }
        
        return { ...el, ...updates }
      }
      return el
    }))
  }

  const createGroup = () => {
    if (selectedIds.length > 1) {
      const groupId = `group-${nextGroupId}`
      setElements(elements.map(el => {
        if (selectedIds.includes(el.id)) {
          return { ...el, groupId }
        }
        return el
      }))
      setGroups([...groups, { id: groupId, name: `Group ${nextGroupId}` }])
      setNextGroupId(nextGroupId + 1)
    }
  }

  const ungroupSelected = () => {
    setElements(elements.map(el => {
      if (selectedIds.includes(el.id)) {
        return { ...el, groupId: null }
      }
      return el
    }))
  }

  const selectedElement = selectedIds.length === 1 ? elements.find(el => el.id === selectedIds[0]) : null

  const handleElementDoubleClick = (e, id) => {
    e.stopPropagation()
    setEditingElement(id)
  }

  const handleTextEdit = (id, newText) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, text: newText } : el
    ))
  }

  const handleEditBlur = () => {
    setEditingElement(null)
  }

  const moveLayer = (fromIndex, toIndex) => {
    const newElements = [...elements]
    const [movedElement] = newElements.splice(fromIndex, 1)
    newElements.splice(toIndex, 0, movedElement)
    setElements(newElements)
  }

  const handleLayerDragStart = (e, index) => {
    e.stopPropagation()
    setDraggedLayer(index)
  }

  const handleLayerDragOver = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleLayerDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedLayer !== null && draggedLayer !== dropIndex) {
      moveLayer(draggedLayer, dropIndex)
    }
    setDraggedLayer(null)
    setDragOverIndex(null)
  }

  const renderElement = (element) => {
    const isSelected = selectedIds.includes(element.id)
    
    const containerStyle = {
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
    }

    const contentStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: element.backgroundColor,
      borderRadius: `${element.borderRadius}px`,
      border: `${element.borderWidth}px solid ${element.borderColor}`,
      color: element.color,
      fontSize: `${element.fontSize}px`,
      fontFamily: element.fontFamily,
      fontWeight: element.fontWeight,
      fontStyle: element.fontStyle,
      textDecoration: element.textDecoration,
      textAlign: element.textAlign || 'left',
      transform: `rotate(${element.rotation}deg)`,
    }

    let content = null

    switch (element.elementType) {
      case 'input':
        content = (
          <input
            type="text"
            placeholder={element.placeholder}
            style={{...contentStyle, textAlign: element.textAlign || 'left'}}
            className="px-3 outline-none pointer-events-none"
            value={element.text}
            readOnly
          />
        )
        break
      case 'button':
        const buttonAlign = element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start'
        content = (
          <button
            style={contentStyle}
            className={`px-4 flex items-center font-medium pointer-events-none justify-${element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'end' : 'start'}`}
          >
            {element.text}
          </button>
        )
        break
      case 'text':
        content = (
          <div
            style={contentStyle}
            className={`px-2 flex items-center pointer-events-none justify-${element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'end' : 'start'}`}
          >
            {element.text}
          </div>
        )
        break
      case 'dropdown':
        content = (
          <div
            style={contentStyle}
            className={`px-3 flex items-center pointer-events-none ${element.textAlign === 'center' ? 'justify-center' : element.textAlign === 'right' ? 'justify-end' : 'justify-between'}`}
          >
            <span>{element.text}</span>
            {element.textAlign !== 'center' && element.textAlign !== 'right' && <span>▼</span>}
          </div>
        )
        break
      case 'radio':
        content = (
          <div
            style={{...contentStyle, display: 'flex', alignItems: 'center', padding: '0 8px', justifyContent: element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start'}}
            className="pointer-events-none"
          >
            <div className="w-4 h-4 rounded-full border-2 border-current mr-2"></div>
            <span>{element.text}</span>
          </div>
        )
        break
      case 'toggle':
        content = (
          <div
            style={{...contentStyle, display: 'flex', alignItems: 'center', padding: '4px', justifyContent: element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start'}}
            className="pointer-events-none"
          >
            <div className="w-10 h-6 bg-gray-300 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
            </div>
          </div>
        )
        break
      default:
        content = (
          <div
            style={contentStyle}
            className={`flex items-center pointer-events-none justify-${element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'end' : 'start'}`}
          >
            {element.text}
          </div>
        )
    }

    return (
      <div
        key={element.id}
        onMouseDown={(e) => handleElementMouseDown(e, element.id)}
        onDoubleClick={(e) => handleElementDoubleClick(e, element.id)}
        className={`absolute select-none cursor-move ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{ ...containerStyle, zIndex: elements.indexOf(element) }}
      >
        {editingElement === element.id ? (
          <input
            type="text"
            value={element.text}
            onChange={(e) => handleTextEdit(element.id, e.target.value)}
            onBlur={handleEditBlur}
            autoFocus
            className="w-full h-full px-3 outline-none border-2 border-blue-500 rounded"
            style={{
              fontSize: `${element.fontSize}px`,
              fontFamily: element.fontFamily,
              fontWeight: element.fontWeight,
              fontStyle: element.fontStyle,
              textDecoration: element.textDecoration,
              color: element.color,
              backgroundColor: element.backgroundColor,
            }}
          />
        ) : (
          content
        )}
        
        {isSelected && selectedIds.length === 1 && (
          <>
            <div
              onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
              className='absolute w-2 h-2 bg-white border-2 border-blue-500 rounded-full cursor-nw-resize'
              style={{ top: '-4px', left: '-4px' }}
            />
            <div
              onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
              className='absolute w-2 h-2 bg-white border-2 border-blue-500 rounded-full cursor-ne-resize'
              style={{ top: '-4px', right: '-4px' }}
            />
            <div
              onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
              className='absolute w-2 h-2 bg-white border-2 border-blue-500 rounded-full cursor-sw-resize'
              style={{ bottom: '-4px', left: '-4px' }}
            />
            <div
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
              className='absolute w-2 h-2 bg-white border-2 border-blue-500 rounded-full cursor-se-resize'
              style={{ bottom: '-4px', right: '-4px' }}
            />
          </>
        )}
      </div>
    )
  }

  return (
    <div className='w-full h-screen flex flex-col bg-white'>
      {/* Navbar with centered toolbox and right actions */}
      <div className=' h-12 py-5 flex items-center shadow-sm relative'>
        <div className='absolute left-1/2 transform -translate-x-1/2'>
          <div className='flex items-center gap-3 bg-gray-200 px-2 py-1 rounded-full'>
          <button
            onClick={() => setTool('select')}
            className={`p-2 rounded-full transition-colors ${tool === 'select' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            title="Select Tool"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-200"></div>

          <button
            onClick={() => setTool('box')}
            className={`p-2 rounded-full transition-colors ${tool === 'box' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            title="Draw Box (Click & Drag)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" strokeWidth={2} rx="2" />
            </svg>
          </button>

          {selectedIds.length > 0 && (
            <>
              <div className="w-px h-6 bg-gray-300"></div>
              
              <button
                onClick={duplicateSelected}
                className='p-2 rounded-full hover:bg-gray-200 transition-colors'
                title="Duplicate"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>

              <button
                onClick={deleteSelected}
                className='p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors'
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              {selectedIds.length > 1 && (
                <button
                  onClick={createGroup}
                  className='p-2 rounded-full hover:bg-gray-200 transition-colors'
                  title="Group Elements"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              )}
            </>
          )}

          <div className="w-px h-6 bg-gray-300"></div>

          <button
            onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
            className='p-2 rounded-full hover:bg-gray-200'
            title="Zoom Out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <span className='text-sm font-medium min-w-12 text-center'>{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
            className='p-2 rounded-full hover:bg-gray-200'
            title="Zoom In"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          <button
            onClick={() => setShowPageModal(true)}
            className='p-2 rounded-full hover:bg-gray-200'
            title="Page Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
          </div>
        </div>

        {/* Right Side Action Buttons */}
        <div className='absolute right-3 flex items-center gap-2'>
          <button
            onClick={() => alert('Post to Feed functionality coming soon!')}
            className='px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1.5 text-sm'
            title="Post to Feed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Post to Feed
          </button>

          <div className='relative'>
            <button
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              className='p-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
              title="More Options"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {showOptionsDropdown && (
              <div className='absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50'>
                <button
                  onClick={() => {
                    alert('Export functionality coming soon!')
                    setShowOptionsDropdown(false)
                  }}
                  className='w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm border-b'
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>

                <button
                  onClick={() => {
                    alert('Preview functionality coming soon!')
                    setShowOptionsDropdown(false)
                  }}
                  className='w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm border-b'
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>

                <button
                  onClick={() => {
                    alert('Share functionality coming soon!')
                    setShowOptionsDropdown(false)
                  }}
                  className='w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm rounded-b-lg'
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Settings Modal */}
      {showPageModal && (
        <div className='fixed inset-0 flex items-center justify-center z-50 pointer-events-none'>
          <div className='bg-white rounded-lg shadow-2xl p-6 w-96 pointer-events-auto border-2 border-gray-300'>
            <h2 className='text-xl font-semibold mb-4'>Page Settings</h2>
            
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>Current Page Height</label>
                <input
                  type='number'
                  value={canvasHeight}
                  onChange={(e) => setCanvasHeight(parseInt(e.target.value) || 3000)}
                  className='w-full px-3 py-2 border rounded'
                />
              </div>

              <div className='flex gap-2'>
                <button
                  onClick={() => {
                    setCanvasHeight(canvasHeight + 1000)
                    setShowPageModal(false)
                  }}
                  className='flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                  Increase Height (+1000px)
                </button>
                <button
                  onClick={() => {
                    setCanvasHeight(Math.max(1000, canvasHeight - 1000))
                    setShowPageModal(false)
                  }}
                  className='flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
                >
                  Decrease Height
                </button>
              </div>

              <button
                onClick={() => setShowPageModal(false)}
                className='w-full px-4 py-2 border rounded hover:bg-gray-100'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-1 overflow-hidden relative'>
        {/* Left Sidebar - Element Type Selector (Draggable) */}
        {selectedIds.length > 0 && (
          <div 
            className='absolute bg-white border border-gray-300 rounded-lg shadow-lg overflow-auto z-40'
            style={{
              left: `${leftSidebarPos.x}px`,
              top: `${leftSidebarPos.y}px`,
              width: '256px',
              maxHeight: '80vh'
            }}
          >
            <div 
              className='flex items-center justify-between mb-3 cursor-move bg-gray-100 px-4 py-2 rounded-t-lg sticky top-0'
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsDraggingSidebar(true)
                setSidebarDragStart({
                  x: e.clientX - leftSidebarPos.x,
                  y: e.clientY - leftSidebarPos.y
                })
              }}
            >
              <h3 className='font-semibold text-base'>Properties</h3>
              <button
                onClick={() => setSelectedIds([])}
                className='text-gray-500 hover:text-gray-700'
              >
                ✕
              </button>
            </div>
            
            <div className='p-4'>
              <h3 className='font-semibold text-base mb-3'>Element Type</h3>
            
            <div className='space-y-2'>
              <button
                onClick={() => changeElementType('box')}
                className={`w-full px-3 py-2 text-left rounded border ${selectedElement?.elementType === 'box' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                📦 Box
              </button>
              <button
                onClick={() => changeElementType('input')}
                className={`w-full px-3 py-2 text-left rounded border ${selectedElement?.elementType === 'input' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                📝 Input Field
              </button>
              <button
                onClick={() => changeElementType('text')}
                className={`w-full px-3 py-2 text-left rounded border ${selectedElement?.elementType === 'text' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                📄 Text Label
              </button>
              <button
                onClick={() => changeElementType('dropdown')}
                className={`w-full px-3 py-2 text-left rounded border ${selectedElement?.elementType === 'dropdown' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                📋 Dropdown
              </button>
              <button
                onClick={() => changeElementType('radio')}
                className={`w-full px-3 py-2 text-left rounded border ${selectedElement?.elementType === 'radio' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                🔘 Radio Button
              </button>
              <button
                onClick={() => changeElementType('toggle')}
                className={`w-full px-3 py-2 text-left rounded border ${selectedElement?.elementType === 'toggle' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                🎚️ Toggle Switch
              </button>
              <button
                onClick={() => changeElementType('button')}
                className={`w-full px-3 py-2 text-left rounded border ${selectedElement?.elementType === 'button' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                🔲 Button
              </button>
            </div>

            {selectedIds.length === 1 && selectedElement && (
              <>
                <h3 className='font-semibold text-base mb-3 mt-6'>Styles</h3>
                
                <div className='space-y-3'>
                  <div>
                    <label className='block text-xs font-medium mb-1'>Text</label>
                    <input
                      type='text'
                      value={selectedElement.text}
                      onChange={(e) => updateProperty('text', e.target.value)}
                      className='w-full px-2 py-1 text-sm border rounded'
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <label className='block text-xs font-medium mb-1'>Font Size</label>
                      <input
                        type='number'
                        value={selectedElement.fontSize}
                        onChange={(e) => updateProperty('fontSize', parseInt(e.target.value) || 12)}
                        className='w-full px-2 py-1 text-sm border rounded'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium mb-1'>Border</label>
                      <input
                        type='number'
                        value={selectedElement.borderWidth}
                        onChange={(e) => updateProperty('borderWidth', parseInt(e.target.value) || 0)}
                        className='w-full px-2 py-1 text-sm border rounded'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs font-medium mb-1'>Font Family</label>
                    <select
                      value={selectedElement.fontFamily}
                      onChange={(e) => updateProperty('fontFamily', e.target.value)}
                      className='w-full px-2 py-1 text-sm border rounded'
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                    </select>
                  </div>

                  <div className='flex gap-2'>
                    <button
                      onClick={() => updateProperty('fontWeight', selectedElement.fontWeight === 'bold' ? 'normal' : 'bold')}
                      className={`flex-1 px-2 py-1 text-sm font-bold border rounded ${selectedElement.fontWeight === 'bold' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    >
                      B
                    </button>
                    <button
                      onClick={() => updateProperty('fontStyle', selectedElement.fontStyle === 'italic' ? 'normal' : 'italic')}
                      className={`flex-1 px-2 py-1 text-sm italic border rounded ${selectedElement.fontStyle === 'italic' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    >
                      I
                    </button>
                    <button
                      onClick={() => updateProperty('textDecoration', selectedElement.textDecoration === 'underline' ? 'none' : 'underline')}
                      className={`flex-1 px-2 py-1 text-sm underline border rounded ${selectedElement.textDecoration === 'underline' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    >
                      U
                    </button>
                    <button
                      onClick={() => updateProperty('textDecoration', selectedElement.textDecoration === 'line-through' ? 'none' : 'line-through')}
                      className={`flex-1 px-2 py-1 text-sm line-through border rounded ${selectedElement.textDecoration === 'line-through' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    >
                      S
                    </button>
                  </div>

                  <div>
                    <label className='block text-xs font-medium mb-1'>Text Align</label>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => updateProperty('textAlign', 'left')}
                        className={`flex-1 px-2 py-1 text-sm border rounded ${selectedElement.textAlign === 'left' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        title="Align Left"
                      >
                        <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => updateProperty('textAlign', 'center')}
                        className={`flex-1 px-2 py-1 text-sm border rounded ${selectedElement.textAlign === 'center' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        title="Align Center"
                      >
                        <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => updateProperty('textAlign', 'right')}
                        className={`flex-1 px-2 py-1 text-sm border rounded ${selectedElement.textAlign === 'right' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        title="Align Right"
                      >
                        <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm-4 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <label className='block text-xs font-medium mb-1'>Text Color</label>
                      <input
                        type='color'
                        value={selectedElement.color}
                        onChange={(e) => updateProperty('color', e.target.value)}
                        className='w-full h-8 border rounded cursor-pointer'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium mb-1'>BG Color</label>
                      <input
                        type='color'
                        value={selectedElement.backgroundColor}
                        onChange={(e) => updateProperty('backgroundColor', e.target.value)}
                        className='w-full h-8 border rounded cursor-pointer'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs font-medium mb-1'>Border Color</label>
                    <input
                      type='color'
                      value={selectedElement.borderColor}
                      onChange={(e) => updateProperty('borderColor', e.target.value)}
                      className='w-full h-8 border rounded cursor-pointer'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-medium mb-1'>Border Radius</label>
                    <input
                      type='number'
                      value={selectedElement.borderRadius}
                      onChange={(e) => updateProperty('borderRadius', parseInt(e.target.value) || 0)}
                      className='w-full px-2 py-1 text-sm border rounded'
                    />
                  </div>
                </div>
              </>
            )}
            </div>
          </div>
        )}

        {/* Canvas */}
        <div
          ref={canvasRef}
          className='flex-1 overflow-auto bg-gray-100 relative canvas-area'
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: tool === 'box' ? 'crosshair' : 'default' }}
        >
          <div
            className='relative bg-white shadow-lg canvas-area'
            style={{
              width: `${3000 * zoom}px`,
              height: `${canvasHeight * zoom}px`,
              margin: '50px',
              transform: `scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            {elements.map(element => renderElement(element))}
            
            {/* Drawing preview */}
            {isDrawing && drawStart && dragStart.x && dragStart.y && (
              <div
                className='absolute border-2 border-blue-500 border-dashed bg-blue-50 bg-opacity-20 pointer-events-none'
                style={{
                  left: `${Math.min(drawStart.x, dragStart.x)}px`,
                  top: `${Math.min(drawStart.y, dragStart.y)}px`,
                  width: `${Math.abs(dragStart.x - drawStart.x)}px`,
                  height: `${Math.abs(dragStart.y - drawStart.y)}px`,
                }}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar - Layers Panel */}
        <div className='w-64 bg-white border-l border-gray-300 p-4 overflow-auto'>
          <h3 className='font-semibold text-base mb-3'>Layers</h3>
          
          {elements.length === 0 ? (
            <div className='text-center text-gray-400 mt-8'>
              <p className='text-sm'>No elements yet</p>
              <p className='text-xs mt-1'>Click the box tool and drag on canvas</p>
            </div>
          ) : (
            <div className='space-y-1'>
              {groups.map(group => {
                const groupElements = elements.filter(el => el.groupId === group.id)
                if (groupElements.length === 0) return null
                
                return (
                  <div key={group.id} className='border rounded p-2 mb-2'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-xs font-medium text-gray-600'>{group.name}</span>
                      <button
                        onClick={() => {
                          setSelectedIds(groupElements.map(el => el.id))
                          ungroupSelected()
                        }}
                        className='text-xs text-red-500 hover:underline'
                      >
                        Ungroup
                      </button>
                    </div>
                    {groupElements.map(element => (
                      <div
                        key={element.id}
                        onClick={() => setSelectedIds([element.id])}
                        className={`px-2 py-1 text-sm rounded cursor-pointer flex items-center justify-between ${
                          selectedIds.includes(element.id) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className='flex items-center gap-2'>
                          <span className='text-xs'>
                            {element.elementType === 'input' && '📝'}
                            {element.elementType === 'button' && '🔲'}
                            {element.elementType === 'text' && '📄'}
                            {element.elementType === 'dropdown' && '📋'}
                            {element.elementType === 'radio' && '🔘'}
                            {element.elementType === 'toggle' && '🎚️'}
                            {element.elementType === 'box' && '📦'}
                          </span>
                          <span className='truncate'>{element.text || `Element ${element.id}`}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )
              })}

              {elements.filter(el => !el.groupId).map((element, index) => (
                <div
                  key={element.id}
                  draggable
                  onDragStart={(e) => handleLayerDragStart(e, elements.indexOf(element))}
                  onDragOver={(e) => handleLayerDragOver(e, elements.indexOf(element))}
                  onDrop={(e) => handleLayerDrop(e, elements.indexOf(element))}
                  onClick={() => setSelectedIds([element.id])}
                  className={`px-3 py-2 text-sm rounded cursor-move flex items-center justify-between ${
                    selectedIds.includes(element.id) ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  } ${dragOverIndex === elements.indexOf(element) ? 'border-t-2 border-blue-500' : ''}`}
                >
                  <span className='flex items-center gap-2'>
                    <span className='text-xs cursor-grab'>⋮⋮</span>
                    <span className='text-xs'>
                      {element.elementType === 'input' && '📝'}
                      {element.elementType === 'button' && '🔲'}
                      {element.elementType === 'text' && '📄'}
                      {element.elementType === 'dropdown' && '📋'}
                      {element.elementType === 'radio' && '🔘'}
                      {element.elementType === 'toggle' && '🎚️'}
                      {element.elementType === 'box' && '📦'}
                    </span>
                    <span className='truncate'>{element.text || `Element ${element.id}`}</span>
                  </span>
                  <span className='text-xs text-gray-400'>z:{elements.indexOf(element)}</span>
                </div>
              ))}
            </div>
          )}

          {selectedIds.length === 1 && selectedElement && (
            <div className='mt-4 pt-4 border-t'>
              <h4 className='text-xs font-semibold mb-2 text-gray-600'>POSITION & SIZE</h4>
              <div className='grid grid-cols-2 gap-2 text-xs'>
                <div>
                  <label className='block text-gray-600 mb-1'>X</label>
                  <input
                    type='number'
                    value={Math.round(selectedElement.x)}
                    onChange={(e) => updateProperty('x', parseInt(e.target.value) || 0)}
                    className='w-full px-2 py-1 border rounded'
                  />
                </div>
                <div>
                  <label className='block text-gray-600 mb-1'>Y</label>
                  <input
                    type='number'
                    value={Math.round(selectedElement.y)}
                    onChange={(e) => updateProperty('y', parseInt(e.target.value) || 0)}
                    className='w-full px-2 py-1 border rounded'
                  />
                </div>
                <div>
                  <label className='block text-gray-600 mb-1'>W</label>
                  <input
                    type='number'
                    value={Math.round(selectedElement.width)}
                    onChange={(e) => updateProperty('width', parseInt(e.target.value) || 1)}
                    className='w-full px-2 py-1 border rounded'
                  />
                </div>
                <div>
                  <label className='block text-gray-600 mb-1'>H</label>
                  <input
                    type='number'
                    value={Math.round(selectedElement.height)}
                    onChange={(e) => updateProperty('height', parseInt(e.target.value) || 1)}
                    className='w-full px-2 py-1 border rounded'
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestCanvas
