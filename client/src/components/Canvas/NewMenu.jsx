import React, { useState, useRef, useEffect } from 'react';
import Sidebar from "../Sidebar.jsx";
import { Layout , Alert, message, Button, Modal, Input  } from "antd";
import { 
  PlusCircle, 
  Trash2, 
  GripVertical, 
  ChevronDown,
  Type,
  CheckSquare,
  Circle,
  List,
  Upload,
  Calendar,
  Mail,
  Phone,
  Hash,
  AlignLeft,
  Columns,
  Rows,
  PencilLine,
  MenuIcon,
} from 'lucide-react';
import axios from 'axios';
import RemixIcon from '../../assets/Icons/RemixIcon.jsx';
const { Content } = Layout;
import SelectEntityIntentModal from '../CanvasComponents/SelectEntityType.jsx';

// Field type options
const FIELD_TYPES = [
  { value: 'text', label: 'Short Text', icon: Type },
  { value: 'textarea', label: 'Long Text', icon: AlignLeft },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'dropdown', label: 'Dropdown', icon: ChevronDown },
  { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { value: 'radio', label: 'Radio', icon: Circle },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'upload', label: 'File Upload', icon: Upload },
];

const NewMenu = () => {
  const [Name, setName] = useState("Untitled Form")
  const [open, setOpen] = useState(false);
  const [icon, setIcon] = useState("file-text-line");
  const savedEntityIntent = JSON.parse(localStorage.getItem("entityIntent"));
  const [entityIntent, setEntityIntent] = useState(savedEntityIntent ? savedEntityIntent : null);
  const [intentModalOpen, setIntentModalOpen] = useState(entityIntent === null ? true : false);
  
  
  useEffect(()=>{localStorage.setItem("entityIntent", JSON.stringify(entityIntent))}, [entityIntent])
  useEffect(()=>{ return localStorage.removeItem("entityIntent")}, [])

  const intialForm = 
    {
      id: 1,
      title: 'Basic Information',
      width: 100, // percentage
      fields: [
        {
          id: 1,
          question: 'Untitled Question',
          type: 'text',
          required: false,
          options: [],
          placeholder: 'Your answer',
          gridWidth: 'full', // 'full', 'half', 'third', 'quarter', 'manual'
          fieldWidthPx: null 
        }
      ]
    }
  
  const savedForm = JSON.parse(localStorage.getItem("formTemplate"));
  const [sections, setSections] = useState(savedForm? savedForm : [intialForm]);

  useEffect(() => {
  localStorage.setItem("formTemplate", JSON.stringify(sections))
  }, [sections])
  
  console.log('sections', sections);
  const [resizing, setResizing] = useState(null); // { type: 'section'|'field', sectionId, fieldId }
  const [resizeStartData, setResizeStartData] = useState(null);
  const containerRef = useRef(null);
  const sectionRefs = useRef({});
  const url = import.meta.env.VITE_API_URI;
  


  // Add new section (always add to bottom)
  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: 'New Section',
      width: 100,
      fields: [
        {
          id: Date.now(),
          question: 'Untitled Question',
          type: 'text',
          required: false,
          options: [],
          placeholder: 'Your answer',
          gridWidth: 'full',
          fieldWidthPx: null
        }
      ]
    };
    setSections([...sections, newSection]);
  };

  // Delete section
  const deleteSection = (sectionId) => {
    if (sections.length > 1) {
      setSections(sections.filter(s => s.id !== sectionId));
    }
  };

  // Update section title
  const updateSectionTitle = (sectionId, newTitle) => {
    setSections(sections.map(s => 
    s.id === sectionId ? { ...s, title: newTitle } : s
    ));
  };

  // Update section width
  const updateSectionWidth = (sectionId, width) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    // Calculate minimum width needed based on widest manual field
    let minWidth = 30; // default minimum
    section.fields.forEach(field => {
      if (field.gridWidth === 'manual' && field.fieldWidthPx && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const minWidthForField = (field.fieldWidthPx / containerWidth) * 100;
        minWidth = Math.max(minWidth, minWidthForField);
      }
    });
    
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, width: Math.min(Math.max(width, minWidth), 100) } : s
    ));
  };

  // Handle section resize start
  const handleSectionResizeStart = (sectionId, e) => {
  e.preventDefault();
  setResizing({ type: 'section', sectionId });
  };


const getSectionInnerWidthPx = (sectionId) => {
  const sectionEl = sectionRefs.current[sectionId];
  if (!sectionEl) return Infinity;

  const styles = window.getComputedStyle(sectionEl);

  const padding =
    parseFloat(styles.paddingLeft) +
    parseFloat(styles.paddingRight);

  const border =
    parseFloat(styles.borderLeftWidth) +
    parseFloat(styles.borderRightWidth);

  return sectionEl.clientWidth - padding - border;
};

  // Handle field resize start
  const handleFieldResizeStart = (sectionId, fieldId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const fieldElement = e.currentTarget.parentElement;
    const currentWidth = fieldElement.offsetWidth;
    
    setResizing({ type: 'field', sectionId, fieldId });
    setResizeStartData({
      startX: e.clientX,
      startWidth: currentWidth
    });
  };

  // Handle resize
  const handleResize = (e) => {
    if (!resizing) return;
    
    if (resizing.type === 'section' && containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const mouseX = e.clientX;
      const relativeX = mouseX - containerRect.left;
      const newWidth = (relativeX / containerRect.width) * 100;
      updateSectionWidth(resizing.sectionId, newWidth);
    } else if (resizing.type === 'field' && resizeStartData) {
  const deltaX = e.clientX - resizeStartData.startX;
  const rawWidth = resizeStartData.startWidth + deltaX;

  const MIN_FIELD_WIDTH = 100;
  const MAX_FIELD_WIDTH = getSectionInnerWidthPx(resizing.sectionId);

  const newWidth = Math.min(
    Math.max(rawWidth, MIN_FIELD_WIDTH),
    MAX_FIELD_WIDTH
  );

  setSections(prev =>
    prev.map(s =>
      s.id === resizing.sectionId
        ? {
            ...s,
            fields: s.fields.map(f =>
              f.id === resizing.fieldId
                ? {
                    ...f,
                    gridWidth: 'manual',
                    fieldWidthPx: newWidth
                  }
                : f
            )
          }
        : s
    )
  );
}


};


  // Handle resize end
  const handleResizeEnd = () => {
    setResizing(null);
    setResizeStartData(null);
  };

  // Add mouse move and mouse up listeners
  React.useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizing]);

  // Add field to section
  const addField = (sectionId) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          fields: [
            ...s.fields,
            {
              id: Date.now(),
              question: 'Untitled Question',
              type: 'text',
              required: false,
              options: [],
              placeholder: 'Your answer',
              gridWidth: 'full',
              fieldWidthPx: null
            }
          ]
        };
      }
      return s;
    }));
  };

  // Delete field
  const deleteField = (sectionId, fieldId) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          fields: s.fields.filter(f => f.id !== fieldId)
        };
      }
      return s;
    }));
  };

  // Update field
  const updateField = (sectionId, fieldId, updates) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          fields: s.fields.map(f => 
            f.id === fieldId ? { ...f, ...updates } : f
          )
        };
      }
      return s;
    }));
  };

  // Add option to field (for dropdown, radio, checkbox)
  const addOption = (sectionId, fieldId) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          fields: s.fields.map(f => {
            if (f.id === fieldId) {
              return {
                ...f,
                options: [...(f.options || []), `Option ${(f.options?.length || 0) + 1}`]
              };
            }
            return f;
          })
        };
      }
      return s;
    }));
  };

  // Update option
  const updateOption = (sectionId, fieldId, optionIndex, newValue) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          fields: s.fields.map(f => {
            if (f.id === fieldId) {
              const newOptions = [...f.options];
              newOptions[optionIndex] = newValue;
              return { ...f, options: newOptions };
            }
            return f;
          })
        };
      }
      return s;
    }));
  };

  // Delete option
  const deleteOption = (sectionId, fieldId, optionIndex) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          fields: s.fields.map(f => {
            if (f.id === fieldId) {
              return {
                ...f,
                options: f.options.filter((_, i) => i !== optionIndex)
              };
            }
            return f;
          })
        };
      }
      return s;
    }));
  };

  // Render field input based on type
  const renderFieldInput = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
            disabled
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
            disabled
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
            disabled
          />
        );
      
      case 'dropdown':
        return (
          <select className="w-full px-3 py-2 border-b border-gray-300 focus:border-blue-500 outline-none" disabled>
            <option>Choose</option>
            {field.options?.map((opt, idx) => (
              <option key={idx}>{opt}</option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input type="radio" name={`radio-${field.id}`} disabled />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input type="checkbox" disabled />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      
      case 'upload':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-sm text-gray-500">Click or drag file to upload</p>
          </div>
        );
      
      default:
        return <input type="text" className="w-full px-3 py-2 border-b border-gray-300" disabled />;
    }
  };

  const handleSubmitForm = async () => {
  try {
    const response = await axios.post(`${url}/form/create`,{
        name: Name, 
        icon: icon,
        entityIntent: entityIntent,
        sections: sections 
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

      message.success(response.data.message)
      setSections([intialForm]);
      localStorage.removeItem("formTemplate");
      localStorage.removeItem("entityIntent");
      setName("Untitled Form");
      setIcon("file-text-line");
      setEntityIntent(null);
  } catch (error) {
      message.error(error.message)
  }
};


  return (
      <>
      <SelectEntityIntentModal
        open={intentModalOpen}
        onConfirm={(intent) => {
          setEntityIntent(intent);
          setIntentModalOpen(false);
          console.log("Selected intent:", intent);
        }}
      />

     {/* <Layout style={{ minHeight: "100vh" }}> */}
      <Modal
        title="Icon Name"
        open={open}
        onCancel={() => {setOpen(false)}}
        onOk={()=> setOpen(false)}
        okText="Save"
        width={600}
      >
        <div className='flex items-center gap-2 mb-3'>
          <RemixIcon name={icon? icon : "information-2-line"} size={28}/> 
         <input 
          type="text"
          onChange={(e)=>setName(e.target.value)}
          value={Name} 
          className='  text-2xl text-slate-500 border-gray-200 px-1 outline-none' 
          />
        </div>

        <Input 
        placeholder="Enter Icon Name" 
        value={icon}
        onChange={(e)=>setIcon(e.target.value)}
        />
        <div>
        <p className="mt-4 text-sm text-gray-500">You can find icon names at <a title='https://remixicon.com/' href={`https://remixicon.com/`} target="_blank" className="text-blue-500 underline">Remix Icon Library</a></p>
        </div>
       
      </Modal>
      
        <Content style={{height: '100%', width: '100%',  borderRadius: "16px"}} >
          <div className=" min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className=" flex justify-between rounded-lg shadow-md p-6 mb-6">
                <section>
                  <div className="flex gap-2 items-center">
                    <button type='text' title='Change icon' onClick={() => setOpen(true)} className='cursor-pointer'><RemixIcon name={icon? icon : "information-2-line"} size={24}/></button>
                    <input 
                    type="text"
                    onChange={(e)=>setName(e.target.value)}
                    value={Name} 
                    className='focus:border-b  text-2xl text-slate-500 border-gray-200 px-1 outline-none' 
                    />
                  </div>
                  <p className="text-gray-600">Create your custom form with sections and fields</p>
                </section>
                <section>
                <Button onClick={() => setIntentModalOpen(true)}>Entity {entityIntent?? entityIntent}</Button>
                </section>

              </div>

              {/* Sections Container */}
              <div ref={containerRef} className="space-y-6 mb-6">
                {Array.isArray(sections) && sections.length > 0 && sections.map((section) => (
                  <div
                    key={section.id}
                    style={{ width: `${section.width}%` }}
                    className="   rounded-lg shadow-md overflow-hidden relative"
                  >
                    {/* Resize Handle */}
                    <div
                      onMouseDown={(e) => handleSectionResizeStart(section.id, e)}
                      className="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-400 transition-colors z-10 group"
                      title="Drag to resize section"
                    >
                      <div className="absolute inset-y-0 right-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Section Header */}
                    <div className="bg-blue-500 text-white p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 flex-1">
                          <GripVertical size={20} className="cursor-move" />
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                            className="bg-transparent border-b border-white/30 focus:border-white outline-none flex-1 font-semibold text-lg"
                          />
                        </div>
                        {sections.length > 1 && (
                          <button
                            onClick={() => deleteSection(section.id)}
                            className="text-white hover:text-red-200 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-white/80">Width:</label>
                          <span className="text-sm font-semibold">{Math.round(section.width)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="p-4 grid gap-4" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
                      { Array.isArray(section.fields) && section.fields.length > 0 && section.fields.map((field, fieldIndex) => {
                        // Calculate grid column span or use pixel width
                        let fieldStyle = {};
                        
                        if (field.gridWidth === 'manual' && field.fieldWidthPx) {
                          fieldStyle = { 
                            width: `${field.fieldWidthPx}px`,
                            gridColumn: 'auto'
                          };
                        } else {
                          const gridSpan = {
                            'full': 12,
                            'half': 6,
                            'third': 4,
                            'quarter': 3
                          }[field.gridWidth || 'full'];
                          fieldStyle = { gridColumn: `span ${gridSpan}` };
                        }

                        return (
                        <div 
                          key={field.id} 
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative"
                          style={fieldStyle}
                        >
                          {/* Field Resize Handle */}
                          <div
                            onMouseDown={(e) => handleFieldResizeStart(section.id, field.id, e)}
                            className="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize hover:bg-green-400 transition-colors z-10 group"
                            title="Drag to resize field"
                          >
                            <div className="absolute inset-y-0 right-0 w-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          {/* Field Question */}
                          <div className="mb-3">
                            <div className="flex items-start justify-between mb-2">
                              <input
                                type="text"
                                value={field.question}
                                onChange={(e) => updateField(section.id, field.id, { question: e.target.value })}
                                className="flex-1 text-gray-800 font-medium outline-none border-b border-transparent hover:border-gray-300 focus:border-blue-500 pb-1"
                                placeholder="Question"
                              />
                              <button
                                onClick={() => deleteField(section.id, field.id)}
                                className="text-gray-400 hover:text-red-500 ml-2"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            {/* Field Type Selector */}
                            <div className="flex items-center space-x-2 mb-3 flex-wrap gap-2">
                              <select
                                value={field.type}
                                onChange={(e) => {
                                  const newType = e.target.value;
                                  const needsOptions = ['dropdown', 'radio', 'checkbox'].includes(newType);
                                  updateField(section.id, field.id, { 
                                    type: newType,
                                    options: needsOptions && (!field.options || field.options.length === 0) 
                                      ? ['Option 1'] 
                                      : field.options 
                                  });
                                }}
                                className="text-sm px-3 py-1.5 border border-gray-300 rounded focus:border-blue-500 outline-none"
                              >
                                {FIELD_TYPES.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>

                              <select
                                value={field.gridWidth || 'full'}
                                onChange={(e) => {
                                  const newWidth = e.target.value;
                                  if (newWidth !== 'manual') {
                                    updateField(section.id, field.id, { gridWidth: newWidth, fieldWidthPx: null });
                                  }
                                }}
                                className="text-sm px-3 py-1.5 border border-gray-300 rounded focus:border-blue-500 outline-none bg-blue-50"
                                title="Field Width"
                              >
                                <option value="full">Full Width</option>
                                <option value="half">1/2 Width</option>
                                <option value="third">1/3 Width</option>
                                <option value="quarter">1/4 Width</option>
                                {field.gridWidth === 'manual' && (
                                  <option value="manual">Manually</option>
                                )}
                              </select>

                              <label className="flex items-center space-x-1 text-sm text-gray-600">
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) => updateField(section.id, field.id, { required: e.target.checked })}
                                  className="rounded"
                                />
                                <span>Required</span>
                              </label>
                            </div>

                            {/* Options for dropdown, radio, checkbox */}
                            {['dropdown', 'radio', 'checkbox'].includes(field.type) && (
                              <div className="space-y-2 mb-3 pl-4 border-l-2 border-gray-200">
                                {field.options?.map((option, optIdx) => (
                                  <div key={optIdx} className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">{optIdx + 1}.</span>
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => updateOption(section.id, field.id, optIdx, e.target.value)}
                                      className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded focus:border-blue-500 outline-none"
                                      placeholder={`Option ${optIdx + 1}`}
                                    />
                                    {field.options.length > 1 && (
                                      <button
                                        onClick={() => deleteOption(section.id, field.id, optIdx)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                <button
                                  onClick={() => addOption(section.id, field.id)}
                                  className="text-sm text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                                >
                                  <PlusCircle size={14} />
                                  <span>Add option</span>
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Field Preview */}
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2">Preview:</p>
                            {renderFieldInput(field)}
                          </div>
                        </div>
                      );
                      })}

                      {/* Add Field Button */}
                      <button
                        onClick={() => addField(section.id)}
                        className="border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center space-x-2 py-2"
                        style={{ gridColumn: 'span 12' }}
                      >
                        <PlusCircle size={18} />
                        <span>Add Field</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Section Button */}
              <button
                onClick={addSection}
                className="w-full py-4 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 font-medium"
              >
                <PlusCircle size={20} />
                <span>Add New Section</span>
              </button>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Preview
                </button>
                <button onClick={() => handleSubmitForm()} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Save Form
                </button>
              </div>
            </div>
          </div>
         {message.length>0 && 
         <Alert 
         title={message} 
         type='success' 
         style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
          width: 320,
        }}/>}
        </Content>
      </>
  );
};

export default NewMenu;