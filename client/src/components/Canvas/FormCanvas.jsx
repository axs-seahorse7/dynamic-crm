import {useEffect, useState, useRef} from 'react'
import {SketchPicker     } from 'react-color'

const FormCanvas = () => {
  let resizeInfo = null;
  let dragInfo = null;
  const [isTooBoxOpen, setisTooBoxOpen] = useState(true)
  const [isLinkState, setisLinkState] = useState(false)
  const [isBorderColorPlate, setisBorderColorPlate] = useState(false)
  // const [borderColor, setborderColor] = useState(second)

  const handleSetColor = (color) =>{
    // setColor(color.hex)
    selectedElement.color = color.hex
    handleUpdateElementStyle({color: color.hex})
  }

  const handlecolorPlette = () => setisBorderColorPlate(prev => !prev)
  
  const handleSetBorder = (color) => {
    selectedElement.border = color.hex
    handleUpdateElementStyle({border : `1px solid ${color.hex}`})
  }

  const [selectedElement, setselectedElement] = useState({
    id:"", 
    type:"", 
    bold:false, 
    italic:false, 
    underline:false,
    color:"",
    border:"",
    link:"",
  });
  const [Selected, setSelected] = useState(false)
  const [CanvasElements, setCanvasElements] = useState([])
  const [SelectedElementStyle, setSelectedElementStyle] = useState({
    position: "absolute",
    top: "",
    left: "",
    width: "",
    height: "",
    backgroundColor: "",
    border: "",
    label: "",
    placeholder: "",
    value: "",
  })

  const toggleEdit = (id, editMode) => {
  setCanvasElements(prev =>
    prev.map(el =>
      el.id === id ? { ...el, isEditing: editMode } : el
    )
  );

  // Also sync selectedElement
  if (selectedElement.id === id) {
    setselectedElement(prev => ({ ...prev, isEditing: editMode }));
  }
};

  const Canvas = useRef(null)
  const handleToggleToolBox = () => setisTooBoxOpen(prev => !prev)
  useEffect(()=>{
    setisTooBoxOpen(true)
  }, [selectedElement?.id])

  const FormElements = [
    {
    id: "",
    type: "Input",
    placeholder: "",
    label: "",
    icon: "",
    value: "",
    Style: {
      position: "absolute",
      top: "",
      left: "",
      width: "40px",
      height: "10px",
      backgroundColor: "",
      border: "1px solid #000",
      borderRadius: "4px",
      
    }},
    {
    id: "",
    type: "Text",
    label: "",
    icon: "",
    value: "",
    isEditing: false,
    link:"",
    Style: {
      position: "absolute",
      top: "",
      left: "",
      fontSize: "",
      fontWeight: "",
      color: "",
      bold:false,
      underline:false,
      italic:false,
      
      
    }},
    {
    id: "",
    type: "DropDown",
    label: "",
    icon: "",
    value :[],
    Style:{
      position: "absolute",
      top: "",
      left: "",
      width: "",
      height: "",
      backgroundColor: "",
      border: "",
      borderRadius: "4px"
    }},
    {
    id: "",
    type: "Switch",
    label: "",
    icon: "",
    value: false,
    Style:{
      position: "absolute",
      top: "",
      left: "",
      width: "",
      height: "",
      backgroundColor: "",
      border: "",
    }},
    {
      id: "",
      type: "Radio",
      label: "",
      icon: "",
      value: "",
      groupName:"",
      checked:false,
      Style:{
        position: "absolute",
        top: "",
        left: "",
        width: "",
        height: "",
        backgroundColor: "",
        
      }
    },
    {
      id:"",
      type: "",
      groupName: "",
      selectedValue: ""
    },

    {
    id: "",
    type: "DatePicker",
    label: "",
    icon: "",
    value: "",
    Style:{
      position: "absolute",
      top: "",
      left: "",
      width: "",
      height: "",
      backgroundColor: "",
      border: "",
      borderRadius: "4px"
    }},
    {
    id: "",
    type: "FileInput",
    label: "",
    icon: "",
    value: null,
    Style:{
      position: "absolute",
      top: "",
      left: "",
      width: "",
      height: "",
      backgroundColor: "",
      border: "",
      borderRadius: "4px"
    }},
    {
    id: "",
    type: "Submit",
    label: "",
    icon: "",
    value: "Submit",
    Style:{
      position: "absolute",
      top: "",
      left: "",
      width: "",
      height: "",
      backgroundColor: "",
      border: "",
      borderRadius: "4px"
    }}

  ]    

  const addelementtoCanvas = (elementType) => {
    console.log("Adding element to canvas:", elementType);
  // Find the template element by type
  const template = FormElements.find(el => el.type === elementType);

  if (!template) {
    console.error("Unknown element type:", elementType);
    return;
  }
  // Deep clone the template
  const newElement = JSON.parse(JSON.stringify(template));
  // Assign new ID
  newElement.id = `${elementType}-${Date.now()}`;
  newElement.placeholder = elementType === "Input" ? "Enter text here" : "";
  newElement.Style.top = CanvasElements.length? `${Number(CanvasElements[CanvasElements.length -1].Style.top.replace("px", "")) + 100}px` : '50px' ; // Default position
  newElement.Style.left = "100px"; // Default position
  newElement.label = `${elementType}`;
  newElement.Style.height = "80px";
  newElement.Style.width = "100px";
  newElement.Style.border = "1px solid #000";
  newElement.Style.fontSize = elementType === "Text" ? "14px" : ""
  newElement.Style.color = elementType === "Text" ? "ffffff" : ""
  
  // Add this to your canvas elements list (state)
  setCanvasElements(prev => [...prev, newElement]);
  // Update selected element
  setselectedElement(newElement);
};

  const selectElement = (el) => {
    setselectedElement({
      id:el.id, 
      type:el.type, 
      bold:el.Style.bold, 
      underline:el.Style.underline, 
      italic:el.Style.italic,
      link:el.link,
    });
    setSelected(true);
  }

  const handleDeleteElement = (e) => {
  if (!selectedElement || !selectedElement.id) return;

  if (e.key === "Delete") {
    setCanvasElements(prev => prev.filter(el => el.id !== selectedElement.id));
    
    // select last element automatically
    setselectedElement(prev => {
      const remaining = CanvasElements.filter(el => el.id !== selectedElement.id);
      return remaining[remaining.length - 1] || null;
    });
  }
};

  useEffect(() => {
    window.addEventListener("keydown", handleDeleteElement);
    return () => {
      window.removeEventListener("keydown", handleDeleteElement);
    }
  }, [selectedElement, CanvasElements]);





 const handleUpdateElementStyle = (e) => {
  setCanvasElements(prev =>
    prev.map(el => {
      if (el.id !== selectedElement.id) return el;

      return {
        ...el, 
        Style: {
          ...el.Style,
          ...Object.fromEntries(
            Object.entries(e).map(([key, val]) => [
              key,
              typeof val === "number" ? `${val}px` : val
            ])
          )
        }
      };
    })
  );
};

const handleUpdateElementProps = (propsObj) => {
  setCanvasElements(prev =>
    prev.map(el => {
      if (el.id !== selectedElement.id) return el;

      return {
        ...el,
        ...propsObj   // merge label, placeholder, etc.
      };
    })
  );

  // Keep selectedElement in sync
  setselectedElement(prev => ({
    ...prev,
    ...propsObj
  }));
};
const handleRadioSelect = (el) => {
  setCanvasElements((prev) =>
    prev.map((item) => {
      // Same group? update
      if (item.type === "Radio" && item.groupName === el.groupName) {
        return {
          ...item,
          checked: item.id === el.id,   // only clicked one = true
        };
      }
      return item;
    })
  );

  // Also update selectedElement for UI panel
  setselectedElement((prev) =>
    prev.id === el.id
      ? { ...prev, checked: true }
      : prev
  );
};


const startResize = (e, id, direction) => {
  e.stopPropagation();
  e.preventDefault();

  const element = CanvasElements.find(el => el.id === id);
  if (!element) return;

  resizeInfo = {
    id,
    direction,
    startX: e.clientX,
    startY: e.clientY,
    startWidth: parseInt(element.Style.width),
    startHeight: parseInt(element.Style.height),
  };

  window.addEventListener("mousemove", handleResize);
  window.addEventListener("mouseup", stopResize);
};


const handleResize = (e) => {
  if (!resizeInfo) return;

  const dx = e.clientX - resizeInfo.startX;
  const dy = e.clientY - resizeInfo.startY;

  let newWidth = resizeInfo.startWidth;
  let newHeight = resizeInfo.startHeight;

  if (resizeInfo.direction === "right") {
    newWidth += dx;
  }

  if (resizeInfo.direction === "bottom") {
    newHeight += dy;
  }

  if (resizeInfo.direction === "corner") {
    newWidth += dx;
    newHeight += dy;
  }

  // Prevent negative sizing
  newWidth = Math.max(20, newWidth);
  newHeight = Math.max(20, newHeight);

  // Update in canvas elements
  setCanvasElements(prev =>
    prev.map(el =>
      el.id === resizeInfo?.id
        ? { ...el, Style: { ...el.Style, width: `${newWidth}px`, height: `${newHeight}px` } }
        : el
    )
  );
};


const stopResize = () => {
  resizeInfo = null;
  window.removeEventListener("mousemove", handleResize);
  window.removeEventListener("mouseup", stopResize);
};

const startDrag = (e, el) => {
  // Only drag if user selects the element body, not resize handles
  if (e.target.classList.contains("resize-handle")) return;

  dragInfo = {
    id: el.id,
    startX: e.clientX,
    startY: e.clientY,
    startLeft: parseInt(el.Style.left),
    startTop: parseInt(el.Style.top),
  };

  window.addEventListener("mousemove", handleDrag);
  window.addEventListener("mouseup", stopDrag);
};


const handleDrag = (e) => {
  if (!dragInfo) return;

  const dx = e.clientX - dragInfo.startX;
  const dy = e.clientY - dragInfo.startY;

  let newLeft = dragInfo.startLeft + dx;
  let newTop = dragInfo.startTop + dy;

  // Boundaries (prevent dragging out of canvas)
  const parent = document.querySelector("form.w-full"); // your canvas container
  const bounds = parent.getBoundingClientRect();

  const el = CanvasElements.find((el) => el.id === dragInfo.id);
  const width = parseInt(el.Style.width);
  const height = parseInt(el.Style.height);

  newLeft = Math.max(0, Math.min(newLeft, bounds.width - width));
  newTop = Math.max(0, Math.min(newTop, bounds.height - height));

  // Update in CanvasElements
  setCanvasElements((prev) =>
    prev.map((item) =>
      item.id === dragInfo.id
        ? {
            ...item,
            Style: { ...item.Style, left: `${newLeft}px`, top: `${newTop}px` },
          }
        : item
    )
  );

  // Sync selectedElement
  setselectedElement((prev) =>
    prev.id === dragInfo?.id
      ? {
          ...prev,
          Style: { ...prev.Style, left: `${newLeft}px`, top: `${newTop}px` },
        }
      : prev
  );
};


const stopDrag = () => {
  dragInfo = null;
  window.removeEventListener("mousemove", handleDrag);
  window.removeEventListener("mouseup", stopDrag);
};

const handlDeselectElement = (e) => {
  if (!Canvas.current) return;

  // If clicked inside a selected element → DO NOT deselect
  if (e.target.closest(".canvas-element")) return;

  // If clicked on resize handles → DO NOT deselect
  if (e.target.classList.contains("resize-handle")) return;

  // Otherwise clear selection
  setselectedElement({ id: "", type: "" });
};

const handleToggleTextStyle = (styleKey) => {
  setCanvasElements(prev =>
    prev.map(el => {
      if (el.id !== selectedElement.id) return el;

      const safeStyle = {
        bold: false,
        underline: false,
        italic: false,
        ...el.Style,     // merge existing keys (even if empty)
      };

      const updated = {
        ...el,
        Style: {
          ...safeStyle,
          [styleKey]: !safeStyle[styleKey],
          fontWeight: styleKey === "bold" ? (!safeStyle.bold ? "bold" : "normal") : safeStyle.fontWeight,
          textDecoration: styleKey === "underline" ? (!safeStyle.underline ? "underline" : "none") : safeStyle.textDecoration,
          fontStyle: styleKey === "italic" ? (!safeStyle.italic ? "italic" : "normal") : safeStyle.fontStyle
        }
      };

      return updated;
    })
  );

  // Sync selectedElement
  setselectedElement(prev => {
    if (prev.id !== selectedElement.id) return prev;

    const safeStyle = {
      bold: false,
      underline: false,
      italic: false,
      ...prev.Style,
    };

    return {
      ...prev,
      Style: {
        ...safeStyle,
        [styleKey]: !safeStyle[styleKey],
        fontWeight: styleKey === "bold" ? (!safeStyle.bold ? "bold" : "normal") : safeStyle.fontWeight,
        textDecoration: styleKey === "underline" ? (!safeStyle.underline ? "underline" : "none") : safeStyle.textDecoration,
        fontStyle: styleKey === "italic" ? (!safeStyle.italic ? "italic" : "normal") : safeStyle.fontStyle
      }
    };
  });
};

const selectedRef = useRef(null);

useEffect(() => {
  selectedRef.current = selectedElement;
}, [selectedElement]);


useEffect(() => {
  const handleKeyMove = (e) => {
    const el = selectedRef.current;
    if (!el?.id) return;

    const step = 2;

    let top = parseInt(el.Style.top) || 0;
    let left = parseInt(el.Style.left) || 0;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleUpdateElementStyle({ top: top - step });
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      handleUpdateElementStyle({ top: top + step });
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleUpdateElementStyle({ left: left - step });
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleUpdateElementStyle({ left: left + step });
    }
  };

  window.addEventListener("keydown", handleKeyMove);
  return () => window.removeEventListener("keydown", handleKeyMove);
}, []);



useEffect(() => {
  console.log("Selected Element:", selectedElement);
}, [selectedElement]);


  return (
    <div>
      <nav className='w-full h-12 justify-center px-5 items-center flex fixed gap-5 top-3 z-10  '>
      <div 
      className='bg-white border border-cyan-600 rounded-lg h-full shadow px-4 py-1 flex gap-5 items-center'>
        <button onClick={() => handleToggleTextStyle("")} className='button'><i class="ri-font-size"></i></button>
        <button onClick={() => handleToggleTextStyle("bold")} className={`${selectedElement?.bold ? "selectedButton" : "button"}`}><i class="ri-bold"></i></button>
        <button onClick={() => handleToggleTextStyle("italic")} className={`${selectedElement?.italic ? "selectedButton" : "button"}`}><i class="ri-italic"></i></button>
        <button onClick={() => handleToggleTextStyle("underline")} className={`${selectedElement?.underline ? "selectedButton" : "button"}`}><i class="ri-underline"></i></button>
       { selectedElement?.type === "Text" && (<button onClick={() => setisLinkState(prev => !prev)} className='button relative'><i class="ri-link"></i>   </button>)}
        <button title='Add new slide' onClick={() => handleToggleTextStyle("")} className='button'><i class="ri-sticky-note-add-line"></i></button>
       
       {isLinkState && (
          <div 
            className='absolute top-14 right-80 button flex' 
            
          > 
            <input 
              type="text"
              value={selectedElement.link || ""}
              placeholder="http://"
              className='outline-none'
              onChange={(e) => {
                const url = e.target.value;

                // Update Canvas Elements
                setCanvasElements(prev =>
                  prev.map(elem =>
                    elem.id === selectedElement.id
                      ? { ...elem, link: url }   // <-- NOW CORRECT
                      : elem
                  )
                );

                // Update selectedElement
                setselectedElement(prev =>
                  prev.id === selectedElement.id
                    ? { ...prev, link: url }     // <-- NOW CORRECT
                    : prev
                );
              }}
            /> 

            <button 
              onClick={() => setisLinkState(false)} 
              className='cursor-pointer'
            >
              <i className="ri-check-line"></i>
            </button> 
          </div>
        )}

      </div>
      <div
      className={`bg-white rounded-lg w-62 ${isTooBoxOpen? "h-screen": "h-12"} overflow-y-scroll  shadow border border-gray-400 absolute right-5 top-0  flex flex-col gap-5 `}
      style={{scrollbarWidth:'none'}}
      >
        <div onClick={()=> handleToggleToolBox()} className='bg-gray-300  sticky top-0 left-0 w-full flex items-center justify-between px-5 py-1 text-cyan-600 border-b border-b-cyan-600'>Tools <i class="ri-arrow-down-s-line"></i></div>
        <section className='px-2'>
        {Array.isArray(CanvasElements) && CanvasElements.length > 0 && CanvasElements.map(el=>(
          selectedElement.id === el.id? (

          <div key={el.id} className='flex flex-col gap-2'>
            <span className='font-semibold'>Resize</span>
            <div className='elementStyleBox flex gap-1 text-sm'>
              <span><i class="ri-expand-vertical-line"></i>  
               H : </span> 
              <input
              onChange={(e) =>
                handleUpdateElementStyle({ height: Number(e.target.value) })
              }       
              type="number"
              value={parseInt(el.Style.height)}
              className='w-[40px] border-b outline-none'
              />
              <span><i class="ri-expand-horizontal-line"></i> 
              W : </span> 
              <input 
              onChange={(e)=> handleUpdateElementStyle({width: Number(e.target.value)} )}
              type="number" 
              value={parseInt(el?.Style?.width)} 
              className='w-[40px] border-b outline-none'
              />
            </div>
              
            <span className='font-semibold'>Position</span>
            <div className='elementStyleBox flex gap-1 text-sm'>
              <span><i class="ri-expand-vertical-line"></i>  
               X : </span> 
              <input
              onChange={(e) =>
                handleUpdateElementStyle({ left: Number(e.target.value) })
              }       
              type="number"
              value={parseInt(el.Style.left)}
              className='w-[40px] border-b outline-none'
              />
              <span><i class="ri-expand-horizontal-line"></i> 
              Y : </span> 
              <input 
              onChange={(e)=> handleUpdateElementStyle({top: Number(e.target.value)} )}
              type="number" 
              value={parseInt(el?.Style?.top)} 
              className='w-[40px] border-b outline-none'
              />
            </div>

            <span className='font-semibold'>Border style</span>
            <div className=' flex flex-col text-sm border border-gray-400 rounded py-1 px-2 gap-2'>
              <select name="border" id="" className='bg-gray-200 py-1 rounded outline-none'>
                <option value="">Border All</option>
                <option value="" >Left</option>
                <option value="solid">Right</option>
                <option value="dotted">Top</option>
                <option value="dashed">Bottom</option>
                
              </select>
              <select name="border" id="" className='bg-gray-200 py-1 rounded outline-none'>
                {/* <option value="" hidden>Border Style</option> */}
                <option value="solid">Solid</option>
                <option value="dotted">Dotted</option>
                <option value="dashed">Dashed</option>
                
              </select>

              {el.type !== "Text" && el.type !== "Toggle" && el.type !== "Radio" && el.type !== "SubmitButton" && 
              (<button onClick={()=> handlecolorPlette() } className='bg-gray-200 text-start px-1 py-1 rounded outline-none cursor-pointer hover:bg-gray-300'>Border color <i class="ri-palette-line"></i></button>)}
              </div>
              <div className={`${isBorderColorPlate? "block" : "hidden"}`}>
                <SketchPicker 
                color={selectedElement.border} 
                onChangeComplete={(col) => handleSetBorder(col)} />
              </div>

            <span className='font-semibold'>{selectedElement.type=== 'Text'? "Text" : "Values"}</span>
            {el.type === "Input" ? (
            <div className='flex flex-col gap-2 text-sm border px-2 py-1 rounded border-gray-400'>
              <span> 
               Label </span> 
              <input
              onChange={(e) =>
                handleUpdateElementProps({ label:e.target.value })
              }       
              type="text"
              value={el?.label}
              className=' border-b outline-none bg-gray-200 py-1'
              />
              <span> 
              PlaceHolder </span> 
              <input 
              onChange={(e)=> handleUpdateElementProps({placeholder: e.target.value} )}
              type="text" 
              value={el?.placeholder} 
              className=' border-b outline-none bg-gray-200 py-1'
              />
            </div>

            ): el.type === "Radio" ?(
              <div className='flex flex-col gap-2'>
                
                <input 
                type="text"
                value={el.groupName}
                onChange={(e)=> handleUpdateElementProps({groupName: e.target.value} )} 
                placeholder='e.g. gender, age ...'
                className='inputStyle'/>

                <input 
                type="text"
                value={el.value}
                onChange={(e)=> handleUpdateElementProps({value: e.target.value} )} 
                placeholder='male, female, 30 ...'
                className='inputStyle'/>

              </div>
            ):(
              <div>
                <input 
                type="text" 
                className='inputStyle' 
                value={el.value} 
                onChange={(e) => {
                  const value = e.target.value;

                  // Update Canvas Elements
                  setCanvasElements((prev) =>
                    prev.map((elem) =>
                      elem.id === selectedElement.id
                        ? { ...elem, value }
                        : elem
                    )
                  );

                  // Update selected element
                  setselectedElement((prev) =>
                    prev.id === selectedElement.id
                      ? { ...prev, value }
                      : prev
                  );
                }} 
                />
              </div>
            )}
             
           {selectedElement.type === "Text" && (
               <div className='elementStyleBox'>
                <label className='font-semibold text-black text-lg'>Font size</label>
                 <input 
                 type="number" 
                 onChange={(e)=> handleUpdateElementStyle({fontSize: Number(e.target.value)})} max={100} min={5} value={parseInt(el.Style.fontSize)}
                 className='inputStyle ml-4 ' />
               </div>
             )}

           {selectedElement.type === "Text" && (
               <div className='mt-5'>
                <label className='font-semibold text-black text-md'>Text color</label>
                  <SketchPicker 
                  color={selectedElement.color} 
                  onChangeComplete={(col)=>handleSetColor(col)}
                  styles={{width: "100px"}}    
                  />
               </div>
             )}

            {el.type === "DropDown" && ( <div>this is the div</div> )}  
             
             {/* <div>
              <SketchPicker 
              color={selectedElement.color} 
              onChangeComplete={(col)=>handleSetColor(col)}
              styles={{width: "100px"}}    
              />
             </div> */}
          
          
          
          </div>



          ):null

          

        ))}
        
        </section>
       

        

      </div>
      </nav>

      {/* <------------------------- Canvas Field ----------------> */}
      <div className="w-full h-screen pl-50 overflow-hidden flex flex-col gap-5 items-center justify-center">

        <div className=' w-full h-full pt-18 bg-white '> 
          <form ref={Canvas} onClick={(e)=> handlDeselectElement(e)} className='w-full h-full relative px-4'>
            {CanvasElements.map(el => (
              
              <div
                key={el.id}
                onMouseDown={(e) => startDrag(e, el)}
                onClick={() => selectElement(el)}
                style={{
                  position: el.Style?.position,
                  top: el.Style.top,
                  left: el.Style.left,
                  width: el.Style.width,
                  height: el.Style.height,
                  backgroundColor: el.Style.backgroundColor,
                  border: selectedElement.id === el.id ? "2px solid blue" : "",
                  borderRadius: selectedElement.id === el.id ? "4px" : "",
                }}
                className={`relative canvas-element flex cursor-pointer ${el.type === "Radio"? "items-center gap-2 ": "flex-col items-start"}  justify-center p-2`}
              >

                {/* Element label */}
                {el.type !== "Radio" && el.type !== 'Text' && (<label className='mb-1'>{el.label}</label>)}

                {/* Element Types */}
                {el.type === "Input" &&(
                  <input
                    type="text"
                    placeholder={el.placeholder}
                    className='border px-2 py-1 w-full h-full'
                    style={{
                      border:el.border?? el.border
                    }}
                  />
                )}

                {el.type === "Text" && (
                el.isEditing ? (
                  <input
                    type="text"
                    autoFocus
                    value={el.value}
                    onBlur={() => toggleEdit(el.id, false)}
                    onChange={(e) =>
                      handleUpdateElementProps({ value: e.target.value })
                    }
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                 el.link.length? ( 
                  <a 
                  href={el.link} 
                  target="_blank" 
                  className='underline text-blue-600'
                  >
                  
                    <p
                    style={{
                      fontWeight: el.Style.bold ? "bold" : "normal",
                      textDecoration: el.Style.underline ? "underline" : "none",
                      fontStyle: el.Style.italic ? "italic" : "normal",
                      fontSize: el.Style.fontSize,
                      color: el.Style.color
                    }}

                    onDoubleClick={() => toggleEdit(el.id, true)}
                    className="cursor-text w-full"
                  >
                    {el.value || "click on link"}
                  </p>
                    
                  </a>
                 ):( <p
                    style={{
                      fontWeight: el.Style.bold ? "bold" : "normal",
                      textDecoration: el.Style.underline ? "underline" : "none",
                      fontStyle: el.Style.italic ? "italic" : "normal",
                      fontSize: el.Style.fontSize,
                      color: el.Style.color
                    }}

                    onDoubleClick={() => toggleEdit(el.id, true)}
                    className="cursor-text w-full"
                  >
                    {el.value || "Double click to edit"}
                  </p>)
                )
              )}


                {el.type === "DropDown" && (
                  <select className='border px-2 py-1 w-full'>
                    <option hidden>Select an option</option>
                    {el.value.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                )}

                {el.type === "Toggle" && <input type="checkbox" checked={el.value} className='w-full h-full' />}
                {el.type === "Radio" && <input type="radio" name={el.groupName} value={el.value} checked={el.checked} onChange={() => handleRadioSelect(el)} />}
                {el.type === "DatePicker" &&(
                  <input type="date" value={el.value} className='border px-2 py-1 w-full h-full'/>
                )}
                {el.type === "FileInput" &&(
                  <input type="file" className='border px-2 py-1 w-full h-full'/>
                )}
                {el.type === "Submit" &&(
                  <button type="submit" className='bg-blue-600 text-white px-4 py-2 w-full h-full rounded'>
                    {el.value}
                  </button>
                )}

                {el.type === "Radio" && (<label className='mb-1'>{el.value}</label>)}


              


                {/* ⭐ RESIZE HANDLES — MUST BE INSIDE THE SAME DIV */}
                {selectedElement.id === el.id && (
                  <>
                    {/* Right handle */}
                    <div

                      className="absolute right-0 top-1/2 w-2 h-4 bg-blue-500 cursor-ew-resize resize-handle"
                      onMouseDown={(e) => startResize(e, el.id, "right")}
                    />

                    {/* Bottom handle */}
                    <div
                      className="absolute bottom-0 left-1/2 w-4 h-2 bg-blue-500 cursor-ns-resize resize-handle"
                      onMouseDown={(e) => startResize(e, el.id, "bottom")}
                    />

                    {/* Bottom-right corner */}
                    <div
                      className="absolute bottom-0 right-0 w-3 h-3 bg-blue-700 cursor-nwse-resize resize-handle"
                      onMouseDown={(e) => startResize(e, el.id, "corner")}
                    />
                  </>
                )}

              </div>

            ))}
          </form>

        </div>
        
      </div>  

        {/* left side panel */}
        <div
          className='bg-white w-50 h-full absolute flex flex-col gap-2 px-4 py-5 left-0 top-0 shadow shadow-gray-600'
        >
          <div className='flex flex-col w-full py-2 '>
            <div className='text-cyan-500 font-bold drop-shadow-cyan-500 drop-shadow-sm '>Zen - Canvas</div>
            <div className='border-b flex justify-between text-gray-500 font-bold mt-3 bg-white'><span>Client</span> <i class="ri-pencil-line"></i></div>
            <div className=' flex justify-between text-gray-600 font-semibold mt-3 bg-white'><span>Elements</span></div>
          </div>
        <button onClick={()=>addelementtoCanvas("Input")} className='button'><i class="ri-input-cursor-move"></i> Input </button>
        <button onClick={()=>addelementtoCanvas("Radio")} className='button'><i class="ri-radio-button-line"></i> Radio</button>
        <button onClick={()=>addelementtoCanvas("DropDown")} className='button'>Drop Down <i className="ri-arrow-drop-down-line"></i></button>
        <button onClick={()=>addelementtoCanvas("Toggle")} className='button'>Toggle <i class="ri-toggle-fill"></i></button>
        <button onClick={()=>addelementtoCanvas("Text")} className='button'>Add Text</button>
        <button onClick={()=>addelementtoCanvas("FileInput")} className='button'>File <i class="ri-upload-2-line"></i></button>
        <button onClick={()=>addelementtoCanvas("DatePicker")} className='button'>Date <i class="ri-calendar-line"></i></button>
        <button onClick={()=>addelementtoCanvas("Submit")} className='button'>Submit Button</button>
        
        
        
        </div>


       

    </div>
  )
}

export default FormCanvas
