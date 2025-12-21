import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import {Send, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, Palette, RefreshCw, Type, Ruler, Sparkles } from 'lucide-react'
import { Modal, Button, Tabs, Select, Input, Space, Divider, Tag, message, Drawer, Typography, Radio, Switch, Card } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'

// Dummy menu data for dropdown configuration
const DUMMY_MENUS = {
  Sales: ['Sales_ID', 'Product', 'Amount', 'Date', 'SalesRep'],
  Customer: ['CustomerID', 'Name', 'Email', 'Phone', 'Address', 'City', 'Country'],
  Employee: ['EmployeeID', 'Name', 'Department', 'Email', 'Salary', 'JoinDate'],
  Product: ['ProductID', 'ProductName', 'Category', 'Price', 'Stock', 'Supplier'],
  Orders: ['OrderID', 'OrderDate', 'Customer', 'TotalAmount', 'Status', 'ShipDate']
}

const TestCanvas = () => {
  const url = import.meta.env.VITE_API_URI;
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
  const [showElementTypeDropdown, setShowElementTypeDropdown] = useState(false)
  const elementTypeBtnRef = useRef(null)
  const [elementTypePos, setElementTypePos] = useState(null)
  const elementTypeDropdownRef = useRef(null)
  // Properties panel draggable state
  const [propsPos, setPropsPos] = useState({ x: null, y: null })
  const [isDraggingProps, setIsDraggingProps] = useState(false)
  const [propsDragStart, setPropsDragStart] = useState({ x: 0, y: 0 })
  // refs to support constrained resizing (keep aspect ratio when Shift pressed)
  const resizeStartRef = useRef(null)
  const resizeMouseStartRef = useRef(null)

  // Dropdown configuration modal state
  const [showDropdownConfig, setShowDropdownConfig] = useState(false)
  const [dropdownConfigMode, setDropdownConfigMode] = useState('menu') // 'menu' or 'manual'
  const [dropdownConfigStep, setDropdownConfigStep] = useState(1) // step 1: mode, 2: menu selection, 3: field selection, 4: done
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [selectedField, setSelectedField] = useState(null)
  const [manualListValues, setManualListValues] = useState(['']) // for manual mode
  const [pendingDropdownElement, setPendingDropdownElement] = useState(null) // element id waiting for config
  const [dropdownValues, setDropdownValues] = useState({}) // Maps element id to selected value {elementId: selectedValue}
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false)
  const [formFields, setFormFields] = useState([
    { id: 1, label: '', type: 'input-text', dropdownOptions: ['', ''], radioOptions: ['', ''], checkboxOptions: ['', ''] }
  ])
  const [nextFieldId, setNextFieldId] = useState(2)

  // computed currently-selected element (move before effects that reference it)
  const selectedElement = selectedIds.length === 1 ? elements.find(el => el.id === selectedIds[0]) : null

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setCanvasOffset({ x: rect.left, y: rect.top })
    }
  }, [])

  // initialize canvas height to viewport height so canvas is effectively `h-screen`
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanvasHeight(window.innerHeight)
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

  // Keyboard shortcuts: Ctrl/Cmd + B/I/U/S/D and Delete key (Delete only, not Backspace; not when in edit mode)
  useEffect(() => {
    const onKeyDown = (e) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (ctrl && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        if (!editingElement) toggleBold()
      }
      if (ctrl && e.key.toLowerCase() === 'i') {
        e.preventDefault()
        if (!editingElement) toggleItalic()
      }
      if (ctrl && e.key.toLowerCase() === 'u') {
        e.preventDefault()
        if (!editingElement) {
          toggleTextDecoration('underline')
        }
      }
      if (ctrl && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (!editingElement) {
          toggleTextDecoration('line-through')
        }
      }
      if (ctrl && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        if (!editingElement) {
          duplicateSelected()
        }
      }
      // Only Delete key deletes (not Backspace), and only when no element is in edit mode
      if (e.key === 'Delete' && !editingElement) {
        e.preventDefault()
        deleteSelected()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [selectedIds, selectedElement, elements, editingElement])

  // Block any element type changes while dropdown config modal is open
  useEffect(() => {
    if (showDropdownConfig && pendingDropdownElement !== null) {
      // Store the pending element so we don't accidentally change it
      // This prevents any accidental re-triggering during modal interaction
      return () => {}
    }
  }, [showDropdownConfig, pendingDropdownElement])

  // initialize properties panel default position and keep it inside viewport on resize
  useEffect(() => {
    const panelW = 256 // matches w-64
    const defaultX = Math.max(8, window.innerWidth - panelW - 16)
    const defaultY = 80
    setPropsPos(prev => ({ x: prev.x === null ? defaultX : prev.x, y: prev.y === null ? defaultY : prev.y }))

    const handleResize = () => {
      setPropsPos(prev => {
        const curX = prev.x === null ? Math.max(8, window.innerWidth - panelW - 16) : prev.x
        const curY = prev.y === null ? defaultY : prev.y
        return {
          x: Math.max(0, Math.min(curX, window.innerWidth - panelW)),
          y: Math.max(0, Math.min(curY, window.innerHeight - 40))
        }
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Drag handlers for properties panel
  useEffect(() => {
    const handleDocMouseMove = (e) => {
      if (!isDraggingProps) return
      const panelW = 256
      const panelH = Math.max(200, window.innerHeight - 40)
      const newX = e.clientX - propsDragStart.x
      const newY = e.clientY - propsDragStart.y
      const clampedX = Math.max(0, Math.min(newX, window.innerWidth - panelW))
      const clampedY = Math.max(0, Math.min(newY, window.innerHeight - 40))
      setPropsPos({ x: clampedX, y: clampedY })
    }

    const handleDocMouseUp = () => {
      if (isDraggingProps) setIsDraggingProps(false)
    }

    if (isDraggingProps) {
      document.addEventListener('mousemove', handleDocMouseMove)
      document.addEventListener('mouseup', handleDocMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleDocMouseMove)
      document.removeEventListener('mouseup', handleDocMouseUp)
    }
  }, [isDraggingProps, propsDragStart])

  const handlePropsMouseDown = (e) => {
    // start dragging the properties panel
    e.stopPropagation()
    const rect = e.currentTarget.parentElement.getBoundingClientRect()
    setPropsDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setIsDraggingProps(true)
  }

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
      borderWidth: 1,
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
    
    const element = elements.find(el => el.id === id)
    
    // For dropdown elements, check if clicking on the select itself (allow interaction) vs the border (allow selection)
    if (element?.elementType === 'dropdown' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      // Check if click is directly on the select element (inside the dropdown box)
      const isClickOnSelect = e.target.tagName === 'SELECT' || e.target.closest('select')
      if (isClickOnSelect) {
        // Allow dropdown interaction, don't drag
        return
      }
    }
    
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
    const mouseX = (e.clientX - rect.left - 50) / zoom
    const mouseY = (e.clientY - rect.top - 50) / zoom
    setDragStart({ x: mouseX, y: mouseY })
    resizeMouseStartRef.current = { x: mouseX, y: mouseY }
    // store original dimensions for uniform scaling
    if (selectedIds.length === 1) {
      const el = elements.find(it => it.id === selectedIds[0])
      if (el) {
        resizeStartRef.current = { width: el.width, height: el.height, x: el.x, y: el.y }
      }
    }
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
      const resizeStart = resizeStartRef.current
      const mouseStart = resizeMouseStartRef.current
      
      if (!resizeStart || !mouseStart) return

      setElements(elements.map(el => {
        if (el.id === selectedId) {
          const deltaX = mouseX - mouseStart.x
          const deltaY = mouseY - mouseStart.y

          let updates = {}

          // If Shift is pressed, maintain aspect ratio (uniform scale)
          if (e.shiftKey) {
            const origW = resizeStart.width
            const origH = resizeStart.height

            // compute scale factor based on primary handle direction
            let s = 1
            if (resizeHandle.includes('e')) {
              s = (origW + deltaX) / origW
            } else if (resizeHandle.includes('w')) {
              s = (origW - deltaX) / origW
            } else if (resizeHandle.includes('s')) {
              s = (origH + deltaY) / origH
            } else if (resizeHandle.includes('n')) {
              s = (origH - deltaY) / origH
            }
            s = Math.max(0.05, s)

            const newW = Math.max(20, Math.round(origW * s))
            const newH = Math.max(20, Math.round(origH * s))

            updates.width = newW
            updates.height = newH

            // adjust position when resizing from west or north
            if (resizeHandle.includes('w')) {
              updates.x = resizeStart.x + (origW - newW)
            }
            if (resizeHandle.includes('n')) {
              updates.y = resizeStart.y + (origH - newH)
            }
          } else {
            // Freeform axis-aligned resize (both directions)
            if (resizeHandle.includes('e')) {
              updates.width = Math.max(20, resizeStart.width + deltaX)
            }
            if (resizeHandle.includes('s')) {
              updates.height = Math.max(20, resizeStart.height + deltaY)
            }
            if (resizeHandle.includes('w')) {
              updates.width = Math.max(20, resizeStart.width - deltaX)
              updates.x = resizeStart.x + deltaX
            }
            if (resizeHandle.includes('n')) {
              updates.height = Math.max(20, resizeStart.height - deltaY)
              updates.y = resizeStart.y + deltaY
            }
          }

          return { ...el, ...updates }
        }
        return el
      }))
      // do not update dragStart here; we use initial mouse start for deltas
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
    if (newType === 'dropdown') {
      // Prevent modal from re-triggering if already configuring or has config
      if (showDropdownConfig || pendingDropdownElement !== null) return
      const alreadyHasDropdown = selectedIds.length === 1 && elements.find(el => el.id === selectedIds[0])?.dropdownConfig
      if (alreadyHasDropdown) return
      // Open dropdown configuration modal
      setPendingDropdownElement(selectedIds[0])
      setShowDropdownConfig(true)
      setDropdownConfigStep(1)
      setDropdownConfigMode('menu')
      setSelectedMenu(null)
      setSelectedField(null)
      setManualListValues([''])
      return
    }

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

  // Handle dropdown configuration
  const handleDropdownConfigComplete = () => {
    if (!pendingDropdownElement) return

    let dropdownOptions = []
    if (dropdownConfigMode === 'menu' && selectedField) {
      // Simulate fetching data from the selected menu and field
      dropdownOptions = generateDropdownOptions(selectedMenu, selectedField)
    } else if (dropdownConfigMode === 'manual') {
      dropdownOptions = manualListValues.filter(v => v.trim() !== '')
    }

    setElements(elements.map(el => {
      if (el.id === pendingDropdownElement) {
        return {
          ...el,
          elementType: 'dropdown',
          text: 'Select...',
          height: 40,
          options: dropdownOptions,
          dropdownConfig: {
            mode: dropdownConfigMode,
            menu: selectedMenu,
            field: selectedField,
            manualValues: dropdownConfigMode === 'manual' ? manualListValues.filter(v => v.trim() !== '') : []
          }
        }
      }
      return el
    }))

    setShowDropdownConfig(false)
    setPendingDropdownElement(null)
  }

  const generateDropdownOptions = (menu, field) => {
    // Simulate generating options from menu field
    const mockData = {
      'Customer-Name': ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'],
      'Customer-Email': ['john@example.com', 'jane@example.com', 'bob@example.com'],
      'Employee-Name': ['Alice Johnson', 'Bob Smith', 'Charlie Davis'],
      'Sales-Product': ['Product A', 'Product B', 'Product C'],
      'Product-Category': ['Electronics', 'Clothing', 'Food']
    }
    const key = `${menu}-${field}`
    return mockData[key] || [field + ' 1', field + ' 2', field + ' 3']
  }

  const handleManualListChange = (index, value) => {
    const newList = [...manualListValues]
    newList[index] = value
    setManualListValues(newList)
  }

  const handleAddManualInput = () => {
    setManualListValues([...manualListValues, ''])
  }

  const handleRemoveManualInput = (index) => {
    setManualListValues(manualListValues.filter((_, i) => i !== index))
  }

  // Form Builder Handlers
  const handleAddFormField = () => {
    setFormFields([...formFields, { 
      id: nextFieldId, 
      label: '', 
      type: 'input-text', 
      dropdownOptions: ['', ''],
      radioOptions: ['', ''],
      checkboxOptions: ['', '']
    }])
    setNextFieldId(nextFieldId + 1)
  }

  const handleRemoveFormField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id))
  }

  const handleFieldLabelChange = (id, value) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, label: value } : field
    ))
  }

  const handleFieldTypeChange = (id, value) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, type: value } : field
    ))
  }

  const handleDropdownOptionChange = (fieldId, optionIndex, value) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId) {
        const newOptions = [...field.dropdownOptions]
        newOptions[optionIndex] = value
        return { ...field, dropdownOptions: newOptions }
      }
      return field
    }))
  }

  const handleAddDropdownOption = (fieldId) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId) {
        return { ...field, dropdownOptions: [...field.dropdownOptions, ''] }
      }
      return field
    }))
  }

  const handleRemoveDropdownOption = (fieldId, optionIndex) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId && field.dropdownOptions.length > 2) {
        return { 
          ...field, 
          dropdownOptions: field.dropdownOptions.filter((_, i) => i !== optionIndex) 
        }
      }
      return field
    }))
  }

  const handleRadioOptionChange = (fieldId, optionIndex, value) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId) {
        const newOptions = [...field.radioOptions]
        newOptions[optionIndex] = value
        return { ...field, radioOptions: newOptions }
      }
      return field
    }))
  }

  const handleAddRadioOption = (fieldId) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId) {
        return { ...field, radioOptions: [...field.radioOptions, ''] }
      }
      return field
    }))
  }

  const handleRemoveRadioOption = (fieldId, optionIndex) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId && field.radioOptions.length > 2) {
        return { 
          ...field, 
          radioOptions: field.radioOptions.filter((_, i) => i !== optionIndex) 
        }
      }
      return field
    }))
  }

  const handleCheckboxOptionChange = (fieldId, optionIndex, value) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId) {
        const newOptions = [...field.checkboxOptions]
        newOptions[optionIndex] = value
        return { ...field, checkboxOptions: newOptions }
      }
      return field
    }))
  }

  const handleAddCheckboxOption = (fieldId) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId) {
        return { ...field, checkboxOptions: [...field.checkboxOptions, ''] }
      }
      return field
    }))
  }

  const handleRemoveCheckboxOption = (fieldId, optionIndex) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId && field.checkboxOptions.length > 2) {
        return { 
          ...field, 
          checkboxOptions: field.checkboxOptions.filter((_, i) => i !== optionIndex) 
        }
      }
      return field
    }))
  }

  const handleSubmitForm = () => {
    // Validate form
    const hasEmptyLabels = formFields.some(field => !field.label.trim())
    if (hasEmptyLabels) {
      message.error('Please fill in all field labels')
      return
    }

    // Check dropdown options
    const hasInvalidDropdowns = formFields.some(field => 
      field.type === 'dropdown' && field.dropdownOptions.filter(opt => opt.trim()).length < 2
    )
    if (hasInvalidDropdowns) {
      message.error('Dropdown fields must have at least 2 options')
      return
    }

    // Check radio options
    const hasInvalidRadios = formFields.some(field => 
      field.type === 'radio' && field.radioOptions.filter(opt => opt.trim()).length < 2
    )
    if (hasInvalidRadios) {
      message.error('Radio fields must have at least 2 options')
      return
    }

    // Check checkbox options
    const hasInvalidCheckboxes = formFields.some(field => 
      field.type === 'checkbox' && field.checkboxOptions.filter(opt => opt.trim()).length < 2
    )
    if (hasInvalidCheckboxes) {
      message.error('Checkbox fields must have at least 2 options')
      return
    }

    message.success('Form configuration saved!')
    console.log('Form Fields:', formFields)
    // Here you can process the form data, create canvas elements, etc.
  }

  const toggleTextDecoration = (decoration) => {
    const firstSel = elements.find(el => selectedIds.includes(el.id))
    if (!firstSel) return
    let current = firstSel.textDecoration || ''
    // normalize: remove 'none' token if present
    let parts = current.split(' ').map(p => p.trim()).filter(Boolean).filter(p => p !== 'none')
    const has = parts.includes(decoration)
    let newValue = ''
    if (has) {
      parts = parts.filter(p => p !== decoration)
      newValue = parts.length === 0 ? 'none' : parts.join(' ')
    } else {
      parts.push(decoration)
      newValue = parts.join(' ')
    }
    updateProperty('textDecoration', newValue)
  }

  const toggleBold = () => {
    if (selectedIds.length === 0) return
    const allBold = elements.filter(el => selectedIds.includes(el.id)).every(el => el.fontWeight === 'bold')
    updateProperty('fontWeight', allBold ? 'normal' : 'bold')
  }

  const toggleItalic = () => {
    if (selectedIds.length === 0) return
    const allItalic = elements.filter(el => selectedIds.includes(el.id)).every(el => el.fontStyle === 'italic')
    updateProperty('fontStyle', allItalic ? 'normal' : 'italic')
  }

  // active state helpers for toolbar buttons
  const isBoldActive = selectedIds.length > 0 && elements.filter(el => selectedIds.includes(el.id)).every(el => el.fontWeight === 'bold')
  const isItalicActive = selectedIds.length > 0 && elements.filter(el => selectedIds.includes(el.id)).every(el => el.fontStyle === 'italic')
  const isUnderlineActive = selectedIds.length > 0 && elements.filter(el => selectedIds.includes(el.id)).every(el => (el.textDecoration || '').split(' ').includes('underline'))
  const isStrikeActive = selectedIds.length > 0 && elements.filter(el => selectedIds.includes(el.id)).every(el => (el.textDecoration || '').split(' ').includes('line-through'))

  const resetStyles = () => {
    if (!selectedElement) return
    const defaults = {
      text: selectedElement.text,
      fontSize: 14,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#000000',
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      borderWidth: 2,
      borderRadius: 4,
      textAlign: 'left'
    }
    Object.entries(defaults).forEach(([k, v]) => updateProperty(k, v))
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

  // layout helpers
  const layersOnRight = selectedIds.length > 0 // when properties on left are open, move layers to right
  const scaledWidth = `${100 / zoom}%`
  const scaledHeight = `${canvasHeight / zoom}px`

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

    const justifyContent = element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start'

    let content = null

    switch (element.elementType) {
      case 'input':
        content = (
          <div style={{ ...contentStyle, display: 'flex', alignItems: 'center', padding: '0 8px' }} className='pointer-events-none'>
            <Input
              value={element.text}
              placeholder={element.placeholder}
              readOnly
              bordered={false}
              style={{ textAlign: element.textAlign || 'left', padding: 0, background: 'transparent' }}
            />
          </div>
        )
        break
      case 'button':
        content = (
          <div style={{ ...contentStyle, padding: 0 }}>
            <Button
              block
              style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent }}
              className='pointer-events-none'
            >
              {element.text}
            </Button>
          </div>
        )
        break
      case 'text':
        content = (
          <div
            style={{ ...contentStyle, display: 'flex', alignItems: 'center', justifyContent, padding: '0 8px' }}
            className='pointer-events-none'
          >
            <Typography.Text style={{ margin: 0, width: '100%' }}>
              {element.text}
            </Typography.Text>
          </div>
        )
        break
      case 'dropdown': {
        const dropdownOptions = element.options && element.options.length > 0 ? element.options : ['Option 1', 'Option 2']
        const currentValue = dropdownValues[element.id] || undefined
        content = (
          <div
            style={{ ...contentStyle, padding: '4px 8px' }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <Select
              value={currentValue}
              placeholder={element.text}
              style={{ width: '100%' }}
              options={dropdownOptions.map(opt => ({ label: opt, value: opt }))}
              onChange={(value) => setDropdownValues({ ...dropdownValues, [element.id]: value })}
              allowClear
              dropdownStyle={{ zIndex: 2147483647 }}
            />
          </div>
        )
        break
      }
      case 'radio':
        content = (
          <div
            style={{ ...contentStyle, display: 'flex', alignItems: 'center', justifyContent, padding: '0 8px' }}
            className='pointer-events-none'
          >
            <Radio checked style={{ marginRight: 8 }} />
            <span>{element.text}</span>
          </div>
        )
        break
      case 'toggle':
        content = (
          <div
            style={{ ...contentStyle, display: 'flex', alignItems: 'center', justifyContent, padding: '0 8px' }}
            className='pointer-events-none'
          >
            <Switch defaultChecked style={{ pointerEvents: 'none' }} />
          </div>
        )
        break
      case 'box':
        content = (
          <Card
            size='small'
            bordered
            style={{ ...contentStyle, height: '100%', display: 'flex', flexDirection: 'column', justifyContent, padding: 0 }}
            bodyStyle={{ padding: 8, flex: 1, display: 'flex', alignItems: 'center', justifyContent }}
            className='pointer-events-none'
          >
            {element.text}
          </Card>
        )
        break
      default:
        content = (
          <div
            style={{ ...contentStyle, display: 'flex', alignItems: 'center', justifyContent }}
            className='pointer-events-none'
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
            {/* Center edge handles for horizontal/vertical resizing */}
            <div
              onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
              className='absolute w-2 h-2 bg-white border-2 border-blue-500 rounded-full cursor-n-resize'
              style={{ top: '-4px', left: `${element.width / 2 - 4}px` }}
            />
            <div
              onMouseDown={(e) => handleResizeMouseDown(e, 's')}
              className='absolute w-2 h-2 bg-white border-2 border-blue-500 rounded-full cursor-s-resize'
              style={{ bottom: '-4px', left: `${element.width / 2 - 4}px` }}
            />
            <div
              onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
              className='absolute w-2 h-2 bg-white border-2 border-blue-500 rounded-full cursor-w-resize'
              style={{ left: '-4px', top: `${element.height / 2 - 4}px` }}
            />
            <div
              onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
              className='absolute w-2 h-2 bg-white border-2 border-blue-500 rounded-full cursor-e-resize'
              style={{ right: '-4px', top: `${element.height / 2 - 4}px` }}
            />
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

  // Dropdown Configuration Modal Component
  const DropdownConfigModal = () => {
    const menuOptions = Object.keys(DUMMY_MENUS).map(m => ({ label: m, value: m }))
    const fieldOptions = selectedMenu ? DUMMY_MENUS[selectedMenu].map(f => ({ label: f, value: f })) : []

    return (
      <Modal
        title="Configure Dropdown"
        open={showDropdownConfig}
        onCancel={() => {
          setShowDropdownConfig(false)
          setPendingDropdownElement(null)
          setDropdownConfigMode('menu')
          setDropdownConfigStep(1)
        }}
        onOk={handleDropdownConfigComplete}
        width={600}
        okText="Complete"
        cancelText="Cancel"
      >
        {dropdownConfigStep === 1 && (
          <div className="space-y-4">
            <div>Choose dropdown configuration mode:</div>
            <div className="flex gap-4">
              <Button
                size="large"
                type={dropdownConfigMode === 'menu' ? 'primary' : 'default'}
                onClick={() => {
                  setDropdownConfigMode('menu')
                  setDropdownConfigStep(2)
                }}
              >
                Choose Menu
              </Button>
              <Button
                size="large"
                type={dropdownConfigMode === 'manual' ? 'primary' : 'default'}
                onClick={() => {
                  setDropdownConfigMode('manual')
                  setDropdownConfigStep(4)
                }}
              >
                Create List Manually
              </Button>
            </div>
          </div>
        )}

        {dropdownConfigStep === 2 && dropdownConfigMode === 'menu' && (
          <div className="space-y-4">
            <div>Step 1: Select a Menu</div>
            <Select
              placeholder="Choose a menu..."
              options={menuOptions}
              value={selectedMenu}
              onChange={(value) => setSelectedMenu(value)}
              style={{ width: '100%' }}
            />
            <Button
              type="primary"
              disabled={!selectedMenu}
              onClick={() => setDropdownConfigStep(3)}
              block
            >
              Next: Select Field
            </Button>
          </div>
        )}

        {dropdownConfigStep === 3 && dropdownConfigMode === 'menu' && (
          <div className="space-y-4">
            <div>Step 2: Select a Field from {selectedMenu}</div>
            <div className="mb-4">Available fields:</div>
            <Select
              placeholder="Choose a field..."
              options={fieldOptions}
              value={selectedField}
              onChange={(value) => setSelectedField(value)}
              style={{ width: '100%' }}
            />
            <div className="flex gap-2">
              <Button onClick={() => setDropdownConfigStep(2)}>Back</Button>
              <Button
                type="primary"
                disabled={!selectedField}
                onClick={handleDropdownConfigComplete}
                style={{ flex: 1 }}
              >
                Complete Configuration
              </Button>
            </div>
          </div>
        )}

        {dropdownConfigStep === 4 && dropdownConfigMode === 'manual' && (
          <div className="space-y-4">
            <div>Create dropdown list manually:</div>
            <div className="space-y-2">
              {manualListValues.map((value, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={value}
                    onChange={(e) => handleManualListChange(index, e.target.value)}
                  />
                  {manualListValues.length > 1 && (
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveManualInput(index)}
                    />
                  )}
                </div>
              ))}
            </div>
            <Button
              icon={<PlusOutlined />}
              onClick={handleAddManualInput}
              block
            >
              Add More Options
            </Button>
            <Button
              type="primary"
              disabled={manualListValues.filter(v => v.trim() !== '').length === 0}
              onClick={handleDropdownConfigComplete}
              block
            >
              Complete Configuration
            </Button>
          </div>
        )}
      </Modal>
    )
  }

  return (
    <div className='w-full h-screen flex flex-col bg-white'>
      {/* Dropdown Config Modal */}
      <DropdownConfigModal />

      <Drawer
        title='Form Builder'
        placement='right'
        width={450}
        onClose={() => setIsAIDrawerOpen(false)}
        open={isAIDrawerOpen}
      >
        <div className='flex flex-col h-full'>
          {/* Form Fields */}
          <div className='flex-1 overflow-y-auto mb-4' style={{ gap: '5px', display: 'flex', flexDirection: 'column' }}>
            {formFields.map((field, index) => (
              <Card key={field.id} size='small' className='border border-gray-300'>
                <div className='space-y-3'>
                  {/* Field Header */}
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-xs font-semibold text-gray-500'>Field {index + 1}</span>
                    {formFields.length > 1 && (
                      <Button
                        danger
                        size='small'
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveFormField(field.id)}
                      />
                    )}
                  </div>

                  {/* Label Input and Type Selector - Side by Side */}
                  <div className='flex gap-2'>
                    <div className='flex-1'>
                      <Input
                        placeholder='e.g., Name, Email, Age'
                        value={field.label}
                        onChange={(e) => handleFieldLabelChange(field.id, e.target.value)}
                      />
                    </div>
                    <div style={{ width: '160px' }}>
                      <Select
                        style={{ width: '100%' }}
                        value={field.type}
                        onChange={(value) => handleFieldTypeChange(field.id, value)}
                        options={[
                          { label: 'Input - Text', value: 'input-text' },
                          { label: 'Input - Email', value: 'input-email' },
                          { label: 'Input - Number', value: 'input-number' },
                          { label: 'Dropdown', value: 'dropdown' },
                          { label: 'Radio', value: 'radio' },
                          { label: 'Checkbox', value: 'checkbox' },
                          { label: 'Text Area', value: 'textarea' }
                        ]}
                      />
                    </div>
                  </div>

                  {/* Dropdown Options (conditional) */}
                  {field.type === 'dropdown' && (
                    <div className='bg-gray-50 p-3 rounded border border-gray-200'>
                      <div className='text-xs font-medium mb-2'>Dropdown Options</div>
                      <div className='space-y-2'>
                        {field.dropdownOptions.map((option, optIdx) => (
                          <div key={optIdx} className='flex gap-2'>
                            <Input
                              size='small'
                              placeholder={`Option ${optIdx + 1}`}
                              value={option}
                              onChange={(e) => handleDropdownOptionChange(field.id, optIdx, e.target.value)}
                            />
                            {field.dropdownOptions.length > 2 && (
                              <Button
                                size='small'
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveDropdownOption(field.id, optIdx)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <Button
                        size='small'
                        icon={<PlusOutlined />}
                        onClick={() => handleAddDropdownOption(field.id)}
                        block
                        className='mt-2'
                      >
                        Add Option
                      </Button>
                    </div>
                  )}

                  {/* Radio Options (conditional) */}
                  {field.type === 'radio' && (
                    <div className='bg-blue-50 p-3 rounded border border-blue-200'>
                      <div className='text-xs font-medium mb-2'>Radio Options</div>
                      <div className='space-y-2'>
                        {field.radioOptions.map((option, optIdx) => (
                          <div key={optIdx} className='flex gap-2'>
                            <Input
                              size='small'
                              placeholder={`Option ${optIdx + 1}`}
                              value={option}
                              onChange={(e) => handleRadioOptionChange(field.id, optIdx, e.target.value)}
                            />
                            {field.radioOptions.length > 2 && (
                              <Button
                                size='small'
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveRadioOption(field.id, optIdx)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <Button
                        size='small'
                        icon={<PlusOutlined />}
                        onClick={() => handleAddRadioOption(field.id)}
                        block
                        className='mt-2'
                      >
                        Add Option
                      </Button>
                    </div>
                  )}

                  {/* Checkbox Options (conditional) */}
                  {field.type === 'checkbox' && (
                    <div className='bg-green-50 p-3 rounded border border-green-200'>
                      <div className='text-xs font-medium mb-2'>Checkbox Options</div>
                      <div className='space-y-2'>
                        {field.checkboxOptions.map((option, optIdx) => (
                          <div key={optIdx} className='flex gap-2'>
                            <Input
                              size='small'
                              placeholder={`Option ${optIdx + 1}`}
                              value={option}
                              onChange={(e) => handleCheckboxOptionChange(field.id, optIdx, e.target.value)}
                            />
                            {field.checkboxOptions.length > 2 && (
                              <Button
                                size='small'
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveCheckboxOption(field.id, optIdx)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <Button
                        size='small'
                        icon={<PlusOutlined />}
                        onClick={() => handleAddCheckboxOption(field.id)}
                        block
                        className='mt-2'
                      >
                        Add Option
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {/* Add Field Button */}
            <Button
              icon={<PlusOutlined />}
              onClick={handleAddFormField}
              block
              type='dashed'
            >
              Add New Field
            </Button>
          </div>

          {/* Submit Button */}
          <div className='border-t pt-4'>
            <Button
              type='primary'
              icon={<Send size={16} />}
              onClick={handleSubmitForm}
              block
              size='large'
            >
              Generate Form
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Navbar with centered toolbox and right actions */}
      <div className=' h-14 py-5 flex items-center border-b border-gray-200 relative'>
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

          {/* Element type selector in navbar (applies to selected elements) */}
          <div className='relative '>
            <button
              ref={elementTypeBtnRef}
              onClick={() => {
                if (showDropdownConfig) return
                const next = !showElementTypeDropdown
                setShowElementTypeDropdown(next)
                if (next && elementTypeBtnRef.current) {
                  const rect = elementTypeBtnRef.current.getBoundingClientRect()
                  // center the dropdown under the button
                  const width = 176 // w-44
                  const left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.left + rect.width / 2 - width / 2))
                  const top = rect.bottom + 8
                  setElementTypePos({ left, top })
                }
              }}
              className='p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer'
              title='Change Element Type'
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>

            {showElementTypeDropdown && elementTypePos && typeof document !== 'undefined' && !showDropdownConfig && ReactDOM.createPortal(
              <div ref={elementTypeDropdownRef} style={{ position: 'fixed', left: elementTypePos.left, top: elementTypePos.top, width: 176, zIndex: 2147483647 }}>
                <div className='bg-white border border-gray-300 rounded-lg shadow-lg'>
                  <button onClick={() => { changeElementType('box'); setShowElementTypeDropdown(false) }} className='w-full px-3 py-2 text-left hover:bg-gray-50'>📦 Box</button>
                  <button onClick={() => { changeElementType('input'); setShowElementTypeDropdown(false) }} className='w-full px-3 py-2 text-left hover:bg-gray-50'>📝 Input</button>
                  <button onClick={() => { changeElementType('text'); setShowElementTypeDropdown(false) }} className='w-full px-3 py-2 text-left hover:bg-gray-50'>📄 Text</button>
                  <button onClick={() => { changeElementType('dropdown'); setShowElementTypeDropdown(false) }} className='w-full px-3 py-2 text-left hover:bg-gray-50'>📋 Dropdown</button>
                  <button onClick={() => { changeElementType('radio'); setShowElementTypeDropdown(false) }} className='w-full px-3 py-2 text-left hover:bg-gray-50'>🔘 Radio</button>
                  <button onClick={() => { changeElementType('toggle'); setShowElementTypeDropdown(false) }} className='w-full px-3 py-2 text-left hover:bg-gray-50'>🎚 Toggle</button>
                  <button onClick={() => { changeElementType('button'); setShowElementTypeDropdown(false) }} className='w-full px-3 py-2 text-left hover:bg-gray-50'>🔲 Button</button>
                </div>
              </div>,
              document.body
            )}
          </div>

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

          <div className='flex items-center gap-2'>
            <button onClick={toggleBold} className={`p-2 rounded-full hover:bg-gray-300 ${isBoldActive ? 'bg-gray-100' : ''}`} title='Bold'>
              <Bold size={16} />
            </button>
            <button onClick={toggleItalic} className={`p-2 rounded-full hover:bg-gray-300 ${isItalicActive ? 'bg-gray-100' : ''}`} title='Italic'>
              <Italic size={16} />
            </button>
            <button onClick={() => toggleTextDecoration('underline')} className={`p-2 rounded-full hover:bg-gray-300 ${isUnderlineActive ? 'bg-gray-100' : ''}`} title='Underline'>
              <Underline size={16} />
            </button>
            <button onClick={() => toggleTextDecoration('line-through')} className={`p-2 rounded-full hover:bg-gray-300 ${isStrikeActive ? 'bg-gray-100' : ''}`} title='Strike'>
              <Strikethrough size={16} />
            </button>
          </div>

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
            onClick={() => setIsAIDrawerOpen(true)}
            className='p-2 rounded-full hover:bg-gray-200'
            title='Open AI Assistant'
          >
            <Sparkles size={18} />
          </button>

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
              <div className='absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-40'>
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
        <div className='fixed inset-0 flex items-center justify-center z-40 pointer-events-none'>
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
        {/* Layers panel: fixed on left (w-52) */}
        <div className='w-52 bg-white border-r border-gray-300 p-4 overflow-y-auto '>
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



        {/* Canvas */}
        <div
          ref={canvasRef}
          className='flex-1 border-l pb-4 border-gray-200 overflow-auto bg-gray-100 relative canvas-area'
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: tool === 'box' ? 'crosshair' : 'default', overflowX: 'hidden' }}
        >
          <div
            className='relative bg-white shadow-lg canvas-area'
            style={{
              width: scaledWidth,
              height: scaledHeight,
              padding: '50px',
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
        
        {/* Properties panel: appears on right when an element is selected (now draggable) */}
        {selectedIds.length > 0 && propsPos.x !== null && (
          <div
            className='fixed bg-white border rounded border-gray-300 p-4 pb-6 overflow-y-auto shadow-lg z-40'
            style={{ left: propsPos.x, top: propsPos.y, width: 256, maxHeight: 'calc(100vh - 20px)' }}
          >
            <div onMouseDown={handlePropsMouseDown} className='cursor-move -mx-4 -mt-4 px-4 pt-3 pb-2 mb-3 flex items-center justify-between'>
              <h3 className='font-semibold text-base'>Properties</h3>
              <button onClick={() => setSelectedIds([])} className=' text-lg cursor-pointer hover:bg-gray-300 rounded-full h-6 w-6 flex items-center justify-center text-gray-500'><i class="ri-close-line"></i></button>
            </div>
            <div>
              {selectedIds.length === 1 && selectedElement && (
                <div className='mt-4'>
                  <div className='flex items-center gap-4 mb-3'>
                    <h4 className='font-medium tex mb-0'>Styles</h4>
                    <div className='ml-auto text-xs text-gray-400 flex items-center gap-2'>
                      <button onClick={resetStyles} title='Reset styles' className='flex items-center gap-1 px-2 py-1 border rounded text-xs text-red-600 hover:bg-gray-50'>
                        <RefreshCw size={14} /> Reset
                      </button>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div>
                      <label className='block text-xs font-medium mb-1 flex items-center gap-2'><Type size={14} className='text-gray-500'/> Text</label>
                      <input type='text' value={selectedElement.text} onChange={(e) => updateProperty('text', e.target.value)} className='w-full px-2 py-1 text-sm border rounded' />
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                      <div>
                        <label className='block text-xs font-medium mb-1 flex items-center gap-2'><Palette size={14} className='text-gray-500'/> Text Color</label>
                        <input type='color' value={selectedElement.color || '#000000'} onChange={(e) => updateProperty('color', e.target.value)} className='w-full h-8 p-0 border rounded' />
                      </div>
                      <div>
                        <label className='block text-xs font-medium mb-1 flex items-center gap-2'><Ruler size={14} className='text-gray-500'/> Background</label>
                        <input type='color' value={selectedElement.backgroundColor || '#ffffff'} onChange={(e) => updateProperty('backgroundColor', e.target.value)} className='w-full h-8 p-0 border rounded' />
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-2 mt-2'>
                      <div>
                        <label className='block text-xs font-medium mb-1 flex items-center gap-2'><Palette size={14} className='text-gray-500'/> Border Color</label>
                        <input type='color' value={selectedElement.borderColor || '#000000'} onChange={(e) => updateProperty('borderColor', e.target.value)} className='w-full h-8 p-0 border rounded' />
                      </div>
                      <div>
                        <label className='block text-xs font-medium mb-1 flex items-center gap-2'><Ruler size={14} className='text-gray-500'/> Border Radius</label>
                        <input type='number' value={selectedElement.borderRadius || 0} onChange={(e) => updateProperty('borderRadius', parseInt(e.target.value) || 0)} className='w-full px-2 py-1 text-sm border rounded' />
                      </div>
                    </div>

                    <div className='flex items-center gap-2 mt-2'>
                      <div>
                        <label className='block text-xs font-medium mb-1 flex items-center gap-2'><Ruler size={14} className='text-gray-500'/> Border Width</label>
                        <input type='number' value={selectedElement.borderWidth || 0} onChange={(e) => updateProperty('borderWidth', parseInt(e.target.value) || 0)} className='w-24 px-2 py-1 text-sm border rounded' />
                      </div>
                      <div className='ml-auto'>
                        <label className='block text-xs font-medium mb-1'>Align</label>
                        <div className='flex items-center gap-1'>
                          <button onClick={() => updateProperty('textAlign', 'left')} className={`px-2 py-1 border rounded text-xs ${selectedElement.textAlign === 'left' ? 'bg-gray-100' : ''}`} title='Left'><AlignLeft size={14} /></button>
                          <button onClick={() => updateProperty('textAlign', 'center')} className={`px-2 py-1 border rounded text-xs ${selectedElement.textAlign === 'center' ? 'bg-gray-100' : ''}`} title='Center'><AlignCenter size={14} /></button>
                          <button onClick={() => updateProperty('textAlign', 'right')} className={`px-2 py-1 border rounded text-xs ${selectedElement.textAlign === 'right' ? 'bg-gray-100' : ''}`} title='Right'><AlignRight size={14} /></button>
                        </div>
                      </div>
                    </div>

                    {/* Formatting toolbar removed from Properties panel; use navbar controls instead */}

                    <div className='grid grid-cols-2 gap-2'>
                      <div>
                        <label className='block text-xs font-medium mb-1'>Font Size</label>
                        <input type='number' value={selectedElement.fontSize} onChange={(e) => updateProperty('fontSize', parseInt(e.target.value) || 12)} className='w-full px-2 py-1 text-sm border rounded' />
                      </div>
                      <div>
                        <label className='block text-xs font-medium mb-1'>Font Family</label>
                        <select value={selectedElement.fontFamily} onChange={(e) => updateProperty('fontFamily', e.target.value)} className='w-full px-2 py-1 text-sm border rounded'>
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Verdana">Verdana</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
        }
      </div>
    </div>
  )
}

export default TestCanvas
