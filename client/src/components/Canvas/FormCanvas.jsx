import { useEffect, useState, useRef } from "react";
import { SketchPicker } from "react-color";

const FormCanvas = () => {
  let resizeInfo = null;
  let dragInfo = null;
  const [isTooBoxOpen, setisTooBoxOpen] = useState(true);
  const [isLinkState, setisLinkState] = useState(false);
  const [isBorderColorPlate, setisBorderColorPlate] = useState(false);
  const [isPageHeight, setisPageHeight] = useState(false);
  const [PageHeight, setPageHeight] = useState();
  const [InitaialPageHeight, setInitaialPageHeight] = useState();
  const [SelectorOption, setSelectorOption] = useState([{id:"", label:""}])
  const [isListBoxOpen, setisListBoxOpen] = useState(false)
  const [isManualOrMenu, setisManualOrMenu] = useState("menu")

  const handleManualOrMenuChange = (e) => {
    setisManualOrMenu(e);
  };

  const handleListBoxToogle = () => setisListBoxOpen(prev => !prev)
  
  const handleAddOptions = () =>{
    setSelectorOption(prev => [...prev, {id:Date.now(), label:"" }] )
    console.log(SelectorOption)
  }
  
  const handleUpdateOption = (id, value) => {
  setSelectorOption(prev =>
    prev.map(opt =>
      opt.id === id ? { ...opt, label: value } : opt
    )
  );
};

const handleDeleteList = () => {

}

const handleSaveOption = () => {
  const filteredOptions = SelectorOption.filter(opt => opt.label.trim() !== "");

  handleUpdateElementProps({
    value: filteredOptions
  });

  setisListBoxOpen(false)
};

  const handleSetColor = (color) => {
    // setColor(color.hex)
    setselectedElement((prev) => ({ ...prev, color: color.hex }));
    handleUpdateElementStyle({ color: color.hex });
  };

  const handlecolorPlette = () => setisBorderColorPlate((prev) => !prev);

  const handleSetBorder = (color) => {
    setselectedElement((prev) => ({
      ...prev,
      border: `1px solid ${color.hex}`,
    }));

    // update in your elements list
    handleUpdateElementStyle({
      border: `1px solid ${color.hex}`,
    });
  };

  const [selectedElement, setselectedElement] = useState();
  const [Selected, setSelected] = useState(false);
  const [CanvasElements, setCanvasElements] = useState([]);
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
  });

  const toggleEdit = (id, editMode) => {
    setCanvasElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, isEditing: editMode } : el))
    );

    // Also sync selectedElement
    if (selectedElement.id === id) {
      setselectedElement((prev) => ({ ...prev, isEditing: editMode }));
    }
  };

  const Canvas = useRef(null);
  const handleToggleToolBox = () => setisTooBoxOpen((prev) => !prev);

  useEffect(() => {
    setisTooBoxOpen(true);
  }, [selectedElement?.id]);

  const FormElements = [
    {
      type: "Input",
      label: "Input",
      placeholder: "Enter text",
      value: "",
      icon: "",
    },

    {
      type: "Text",
      label: "Text",
      value: "",
      placeholder: "",
      icon: "",
      isEditing: false,
      link: "",
    },

    {
      type: "DropDown",
      label: "Dropdown",
      icon: "",
      value: [], // array of options
    },

    {
      type: "Switch",
      label: "Switch",
      icon: "",
      value: false,
    },

    {
      type: "Radio",
      label: "Radio",
      value: "",
      groupName: "",
      checked: false,
    },

    {
      type: "DatePicker",
      label: "Date",
      icon: "",
      value: "",
    },

    {
      type: "FileInput",
      label: "File",
      icon: "",
      value: null,
    },

    {
      type: "Submit",
      label: "Submit",
      icon: "",
      value: "Submit",
    },
  ];

  const defaultStyle = {
    position: "absolute",
    top: "50px",
    left: "50px",
    width: "120px",
    height: "40px",
    backgroundColor: "",
    border: "1px solid #000",
    borderRadius: "4px",
    color: "#000",
    fontSize: "16px",
  };

  const addelementtoCanvas = (type) => {
    const template = FormElements.find((el) => el.type === type);
    if (!template) return;

    const newElement = {
      ...template,
      id: `${type}-${Date.now()}`,
      Style: { ...defaultStyle }, // inject clean style here
    };

    // Auto-position (optional)
    newElement.Style.top = CanvasElements.length
      ? `${
          parseInt(CanvasElements[CanvasElements.length - 1].Style.top) + 100
        }px`
      : "50px";

    newElement.Style.left = "100px";

    setCanvasElements((prev) => [...prev, newElement]);
    setselectedElement(newElement);
  };

  const selectElement = (el) => {
    const matchedElement = CanvasElements.find((elem) => elem.id === el.id);
    if (!matchedElement) return;
    setselectedElement(matchedElement);
    setSelected(true);

    // Canvas.current?.focus();
  };

  const handleDeleteElement = (e) => {
    if (!selectedElement || !selectedElement.id) return;

    if (e.key === "Delete") {
      setCanvasElements((prev) =>
        prev.filter((el) => el.id !== selectedElement.id)
      );

      // select last element automatically
      setselectedElement((prev) => {
        const remaining = CanvasElements.filter(
          (el) => el.id !== selectedElement.id
        );
        return remaining[remaining.length - 1] || null;
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleDeleteElement);
    return () => {
      window.removeEventListener("keydown", handleDeleteElement);
    };
  }, [selectedElement, CanvasElements]);

  const handleUpdateElementStyle = (e) => {
    setCanvasElements((prev) =>
      prev.map((el) => {
        if (el.id !== selectedElement.id) return el;

        return {
          ...el,
          Style: {
            ...el.Style,
            ...Object.fromEntries(
              Object.entries(e).map(([key, val]) => [
                key,
                typeof val === "number" ? `${val}px` : val,
              ])
            ),
          },
        };
      })
    );
  };

  const handleUpdateElementProps = (propsObj) => {
    setCanvasElements((prev) =>
      prev.map((el) => {
        if (el.id !== selectedElement.id) return el;

        return {
          ...el,
          ...propsObj, // merge label, placeholder, etc.
        };
      })
    );

    // Keep selectedElement in sync
    setselectedElement((prev) => ({
      ...prev,
      ...propsObj,
    }));
  };

  const handleRadioSelect = (el) => {
    setCanvasElements((prev) =>
      prev.map((item) => {
        // Same group? update
        if (item.type === "Radio" && item.groupName === el.groupName) {
          return {
            ...item,
            checked: item.id === el.id, // only clicked one = true
          };
        }
        return item;
      })
    );

    // Also update selectedElement for UI panel
    setselectedElement((prev) =>
      prev.id === el.id ? { ...prev, checked: true } : prev
    );
  };

  const startResize = (e, id, direction) => {
    e.stopPropagation();
    e.preventDefault();

    const element = CanvasElements.find((el) => el.id === id);
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
    setCanvasElements((prev) =>
      prev.map((el) =>
        el.id === resizeInfo?.id
          ? {
              ...el,
              Style: {
                ...el.Style,
                width: `${newWidth}px`,
                height: `${newHeight}px`,
              },
            }
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
        item.id === dragInfo?.id
          ? {
              ...item,
              Style: {
                ...item.Style,
                left: `${newLeft}px`,
                top: `${newTop}px`,
              },
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
    setCanvasElements((prev) =>
      prev.map((el) => {
        if (el.id !== selectedElement.id) return el;

        const safeStyle = {
          bold: false,
          underline: false,
          italic: false,
          ...el.Style, // merge existing keys (even if empty)
        };

        const updated = {
          ...el,
          Style: {
            ...safeStyle,
            [styleKey]: !safeStyle[styleKey],
            fontWeight:
              styleKey === "bold"
                ? !safeStyle.bold
                  ? "bold"
                  : "normal"
                : safeStyle.fontWeight,
            textDecoration:
              styleKey === "underline"
                ? !safeStyle.underline
                  ? "underline"
                  : "none"
                : safeStyle.textDecoration,
            fontStyle:
              styleKey === "italic"
                ? !safeStyle.italic
                  ? "italic"
                  : "normal"
                : safeStyle.fontStyle,
          },
        };

        return updated;
      })
    );

    // Sync selectedElement
    setselectedElement((prev) => {
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
          fontWeight:
            styleKey === "bold"
              ? !safeStyle.bold
                ? "bold"
                : "normal"
              : safeStyle.fontWeight,
          textDecoration:
            styleKey === "underline"
              ? !safeStyle.underline
                ? "underline"
                : "none"
              : safeStyle.textDecoration,
          fontStyle:
            styleKey === "italic"
              ? !safeStyle.italic
                ? "italic"
                : "normal"
              : safeStyle.fontStyle,
        },
      };
    });
  };

  const handleTogglePageHeight = () => {
    const canvas = Canvas.current;
    const current = canvas.offsetHeight; // REAL height
    console.log("Current: ", current);
    setPageHeight(current);
    setInitaialPageHeight(current);
    setisPageHeight((prev) => !prev);
  };

  const handleAddPage = (val) => {
    const canvas = Canvas.current;
    const current = canvas.offsetHeight;
    setPageHeight(val);
    // number only
  };

  useEffect(() => {
    const canvas = Canvas.current;
    if (canvas) {
      canvas.style.height = PageHeight + "px"; // apply here
    }
  }, [PageHeight]);

  useEffect(() => {
    console.log("Selected Element:", selectedElement);
    const element = CanvasElements.filter(
      (elem) => elem.id === selectedElement.id
    );
    console.log("Canvas-element : ", element);
  }, [selectedElement]);

  return (
    <div className="">
      <nav className="w-full h-12 justify-center px-5 items-center flex fixed gap-5 top-3 z-10  ">
        <div className="bg-white border border-cyan-600 rounded-lg h-full shadow px-4 py-1 flex gap-5 items-center">
          <button onClick={() => handleToggleTextStyle("")} className="button">
            <i class="ri-font-size"></i>
          </button>
          <button
            onClick={() => handleToggleTextStyle("bold")}
            className={`${
              selectedElement?.Style?.bold ? "selectedButton" : "button"
            }`}
          >
            <i class="ri-bold"></i>
          </button>
          <button
            onClick={() => handleToggleTextStyle("italic")}
            className={`${
              selectedElement?.Style?.italic ? "selectedButton" : "button"
            }`}
          >
            <i class="ri-italic"></i>
          </button>
          <button
            onClick={() => handleToggleTextStyle("underline")}
            className={`${
              selectedElement?.Style?.underline ? "selectedButton" : "button"
            }`}
          >
            <i class="ri-underline"></i>
          </button>
          {selectedElement?.type === "Text" && (
            <button
              onClick={() => setisLinkState((prev) => !prev)}
              className="button relative"
            >
              <i class="ri-link"></i>{" "}
            </button>
          )}
          <button
            title="Increase Page Height"
            onClick={() => handleTogglePageHeight()}
            className="button"
          >
            <i class="ri-page-separator"></i>
          </button>
          <button
            title="Decrease Page Height"
            onClick={() => handleAddPage()}
            className="button"
          >
            <i class="ri-flip-vertical-line"></i>
          </button>

          {isPageHeight && (
            <div className=" shadow shadow-gray-500 absolute top-10 rounded flex flex-col gap-4 translate-[50%]  pb-10 w-60 bg-white ">
              <div className="w-full flex justify-end px-3 py-2">
                <button
                  onClick={() => setisPageHeight(false)}
                  className="w-6 h-6 rounded-full bg-amber-400 flex justify-center items-center cursor-pointer hover:bg-amber-600 text-white"
                >
                 
                  <i class="ri-close-line"></i>
                </button>
              </div>
              <div className="px-4 flex flex-col gap-4 ">
                <label className="text-gray-700">Page Height</label>
                <input
                  type="number"
                  value={PageHeight}
                  onChange={(e) => handleAddPage(e.target.value)}
                  placeholder="400px"
                  className="inputStyle"
                />
                <div className="w-full gap-2 flex">
                  <button
                    onClick={() => setPageHeight(parseInt(PageHeight) + 100)}
                    className="button w-full"
                  >
                    + 100{" "}
                  </button>
                  <button
                    onClick={() => setPageHeight(parseInt(PageHeight) - 100)}
                    className="button w-full"
                  >
                    {" "}
                    - 100{" "}
                  </button>
                </div>
                <button
                  onClick={() => setPageHeight(InitaialPageHeight)}
                  className="button"
                >
                  Default Height
                </button>
              </div>
            </div>
          )}

          {isLinkState && (
            <div className="absolute top-14 right-80 button flex">
              <input
                type="text"
                value={selectedElement.link || ""}
                placeholder="http://"
                className="outline-none"
                onChange={(e) => {
                  const url = e.target.value;

                  // Update Canvas Elements
                  setCanvasElements((prev) =>
                    prev.map((elem) =>
                      elem.id === selectedElement.id
                        ? { ...elem, link: url } // <-- NOW CORRECT
                        : elem
                    )
                  );

                  // Update selectedElement
                  setselectedElement((prev) =>
                    prev.id === selectedElement.id
                      ? { ...prev, link: url } // <-- NOW CORRECT
                      : prev
                  );
                }}
              />

              <button
                onClick={() => setisLinkState(false)}
                className="cursor-pointer"
              >
                <i className="ri-check-line"></i>
              </button>
            </div>
          )}
        </div>
        <div
          className={`bg-white rounded-lg w-62 ${
            isTooBoxOpen ? "h-screen pb-15" : "h-12"
          } overflow-y-scroll  shadow border border-gray-400 absolute right-5 top-0  flex flex-col gap-5 `}
          style={{ scrollbarWidth: "none" }}
        >
          <div
            onClick={() => handleToggleToolBox()}
            className="bg-gray-300  sticky top-0 left-0 w-full flex items-center justify-between px-5 py-1 text-cyan-600 border-b border-b-cyan-600"
          >
            Tools
            <i class="ri-arrow-down-s-line"></i>
          </div>
          <section className="px-2">
            {Array.isArray(CanvasElements) &&
              CanvasElements.length > 0 &&
              CanvasElements.map((el) =>

                selectedElement.id === el?.id ? (
                  <div key={el.id} className="flex flex-col gap-2">
                    <span className="font-semibold">Resize</span>
                    <div className="elementStyleBox flex gap-1 text-sm">
                      <span>
                        <i class="ri-expand-vertical-line"></i>H :{" "}
                      </span>
                      <input
                        onChange={(e) =>
                          handleUpdateElementStyle({
                            height: Number(e.target.value),
                          })
                        }
                        type="number"
                        value={parseInt(el.Style.height)}
                        className="w-[40px] border-b outline-none"
                      />
                      <span>
                        <i class="ri-expand-horizontal-line"></i>W :{" "}
                      </span>
                      <input
                        onChange={(e) =>
                          handleUpdateElementStyle({
                            width: Number(e.target.value),
                          })
                        }
                        type="number"
                        value={parseInt(el?.Style?.width)}
                        className="w-[40px] border-b outline-none"
                      />
                    </div>

                    <span className="font-semibold">Position</span>
                    <div className="elementStyleBox flex gap-1 text-sm">
                      <span>
                        <i class="ri-expand-vertical-line"></i>X :{" "}
                      </span>
                      <input
                        onChange={(e) =>
                          handleUpdateElementStyle({
                            left: Number(e.target.value),
                          })
                        }
                        type="number"
                        value={parseInt(el.Style.left)}
                        className="w-[40px] border-b outline-none"
                      />
                      <span>
                        <i class="ri-expand-horizontal-line"></i>Y :{" "}
                      </span>
                      <input
                        onChange={(e) =>
                          handleUpdateElementStyle({
                            top: Number(e.target.value),
                          })
                        }
                        type="number"
                        value={parseInt(el?.Style?.top)}
                        className="w-[40px] border-b outline-none"
                      />
                    </div>
                    {selectedElement.type !== "Text" && (
                      <span className="font-semibold">Border style</span>
                    )}
                    {selectedElement.type !== "Text" && (
                      <div className=" flex flex-col text-sm border border-gray-400 rounded py-1 px-2 gap-2">
                        <select
                          name="border"
                          id=""
                          className="bg-gray-200 py-1 rounded outline-none"
                        >
                          <option value="">Border All</option>
                          <option value="">Left</option>
                          <option value="solid">Right</option>
                          <option value="dotted">Top</option>
                          <option value="dashed">Bottom</option>
                        </select>
                        <select
                          name="border"
                          id=""
                          className="bg-gray-200 py-1 rounded outline-none"
                        >
                          {/* <option value="" hidden>Border Style</option> */}
                          <option value="solid">Solid</option>
                          <option value="dotted">Dotted</option>
                          <option value="dashed">Dashed</option>
                        </select>

                        {el.type !== "Text" &&
                          el.type !== "Toggle" &&
                          el.type !== "Radio" &&
                          el.type !== "SubmitButton" && (
                            <button
                              onClick={() => handlecolorPlette()}
                              className="bg-gray-200 text-start px-1 py-1 rounded outline-none cursor-pointer hover:bg-gray-300"
                            >
                              Border color <i class="ri-palette-line"></i>
                            </button>
                          )}
                      </div>
                    )}
                    <div
                      className={`${
                        isBorderColorPlate && selectedElement.type !== "Text"
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      <SketchPicker
                        color={selectedElement.border}
                        onChangeComplete={(col) => handleSetBorder(col)}
                      />
                    </div>

                    <span className="font-semibold">
                      {selectedElement.type === "Text" ? "Text" : "Values"}
                    </span>
                    {el.type === "Input" && (
                      <div className="flex flex-col gap-2 text-sm border px-2 py-1 rounded border-gray-400">
                        <span>Label </span>
                        <input
                          onChange={(e) =>
                            handleUpdateElementProps({ label: e.target.value })
                          }
                          type="text"
                          value={el?.label}
                          className=" border-b outline-none bg-gray-200 py-1"
                        />
                        <span>PlaceHolder </span>
                        <input
                          onChange={(e) =>
                            handleUpdateElementProps({
                              placeholder: e.target.value,
                            })
                          }
                          type="text"
                          value={el?.placeholder}
                          className=" border-b outline-none bg-gray-200 py-1"
                        />
                      </div>
                    )  }

                    {el.type === "Radio" && (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={el.groupName}
                          onChange={(e) =>
                            handleUpdateElementProps({
                              groupName: e.target.value,
                            })
                          }
                          placeholder="e.g. gender, age ..."
                          className="inputStyle"
                        />

                        <input
                          type="text"
                          value={el.value}
                          onChange={(e) =>
                            handleUpdateElementProps({ value: e.target.value })
                          }
                          placeholder="male, female, 30 ..."
                          className="inputStyle"
                        />
                      </div>
                    ) } 

                    { selectedElement.type === "Text" && (
                      <div>
                        <input
                          type="text"
                          className="inputStyle"
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
                      <div className="elementStyleBox">
                        <label className="font-semibold text-black text-lg">
                          Font size
                        </label>
                        <input
                          type="number"
                          onChange={(e) =>
                            handleUpdateElementStyle({
                              fontSize: Number(e.target.value),
                            })
                          }
                          max={100}
                          min={5}
                          value={parseInt(el.Style.fontSize)}
                          className="inputStyle ml-4 "
                        />
                      </div>
                    )}

                    {selectedElement.type === "Text" && (
                      <div className="mt-5">
                        <label className="font-semibold text-black text-md">
                          Text color
                        </label>
                        <SketchPicker
                          color={selectedElement.color}
                          onChangeComplete={(col) => handleSetColor(col)}
                          styles={{ width: "100px" }}
                        />
                      </div>
                    )}

                    {el.type === "DropDown" && 
                    <>
                    <div className="flex flex-col">
                      <label htmlFor="">label</label>
                      <input 
                      type="text" 
                      value={el?.label}
                      placeholder="Edit Label"
                      onChange={(e)=> handleUpdateElementProps({label: e.target.value})}
                      className="inputStyle rounded" 
                      />
                    </div>
                    <div className="flex text-sm">
                          <button onClick={()=> handleManualOrMenuChange("manual")} className={`${isManualOrMenu === "manual" ? " border-r px-4 py-1 w-full bg-amber-400" : "border-r px-4 py-1 w-full" }`}>Manual</button>
                          <button onClick={()=> handleManualOrMenuChange("menu")} className={`${isManualOrMenu === "menu" ? " px-4 py-1 w-full bg-amber-400" : "px-4 py-1 w-full" }`}>From Menu</button>
                     </div>
                    </>
                     }

                    {el.type === "DropDown" && <div>
                      <div 
                        onClick={()=> handleListBoxToogle()} 
                        className="flex justify-between hover:bg-gray-200 cursor-pointer"
                      >
                        <label htmlFor="">List </label> 
                        <button >
                          {isListBoxOpen? (<i class="ri-arrow-up-s-line"></i>) : ( <i class="ri-arrow-down-s-line"></i>)} 
                        </button>
                      </div>
                      {
                        Array.isArray(SelectorOption) && SelectorOption.length && isListBoxOpen &&
                        SelectorOption.map((opt) =>(
                         <>
                         <div 
                         key={opt.id}
                         className=" flex items-center gap-2 w-full "
                         >
                           <input 
                            type="text" 
                            value={opt.label}
                            placeholder="Enter value" 
                            onChange={(e) => handleUpdateOption(opt.id, e.target.value)} 
                            className="bg-gray-200 py-1 px-1 placeholder:font-thin placeholder:text-sm border border-gray-400 mt-1 rounded "
                          />
                          <button onClick={()=> handleDeleteList()} className="bg-gray-200 rounded-full h-8 w-8 cursor-pointer hover:bg-blue-300 "><i class="ri-delete-bin-6-line"></i></button>
                         </div>
                         
                         </>
                        ))
                      }
                      {isListBoxOpen && 
                      <>
                      <button onClick={()=> handleSaveOption()} className="button mt-2">Save</button>
                      <button onClick={()=> handleAddOptions()} className="button mt-2 ml-2"><i class="ri-add-line"></i></button>
                      </>
                      }
                    </div>}
                    






                  </div>
                ) : null
              )}
          </section>
        </div>
      </nav>

      {/* <------------------------- Canvas Field ----------------> */}
      <div className="w-full h-screen pl-50 overflow-y-scroll overflow-x-hidden flex flex-col gap-5 items-center justify-center">
        <div className=" w-full h-full pt-18 bg-gray-200 ">
          <form
            ref={Canvas}
            onClick={(e) => handlDeselectElement(e)}
            className="w-full h-[100vh] bg-white relative px-4"
          >
            {CanvasElements.map((el) => (
              <div
                key={el.id}
                onMouseDown={(e) => startDrag(e, el)}
                onClick={(e) => {
                  selectElement(el);
                }}
                style={{
                  position: el?.Style?.position,
                  top: el?.Style?.top,
                  left: el?.Style?.left,
                  width: `${parseInt(el?.Style?.width)+4}px`,
                  height: `${parseInt(el?.Style?.height)+10}px`,
                  backgroundColor: el?.Style?.backgroundColor,
                  border: selectedElement?.id === el?.id ? "2px solid blue" : "",
                  borderRadius: selectedElement?.id === el?.id ? "4px" : "",
                }}
                className={`relative canvas-element flex cursor-pointer ${
                  el?.type === "Radio"
                    ? "items-center gap-2 "
                    : "flex-col items-start"
                }  justify-center p-2`}
              >
                {/* Element label */}
                {el?.type !== "Radio" && el?.type !== "Text" && (
                  <label className="mb-1">{el.label}</label>
                )}

                {/* Element Types */}
                {el?.type === "Input" && (
                  <input
                    type="text"
                    placeholder={el.placeholder}
                    className="border px-2 py-1 h-full w-full"
                    style={{
                      border: el.Style.border ?? el.Style.border,
                      borderBottom: el.Style.border,
                    }}
                  />
                )}

                {el.type === "Text" &&
                  (el.isEditing ? (
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
                  ) : el.link.length ? (
                    <a
                      href={el.link}
                      target="_blank"
                      className="underline text-blue-600"
                    >
                      <p
                        style={{
                          fontWeight: el.Style.bold ? "bold" : "normal",
                          textDecoration: el.Style.underline
                            ? "underline"
                            : "none",
                          fontStyle: el.Style.italic ? "italic" : "normal",
                          fontSize: el.Style.fontSize,
                          color: el.Style.color,
                        }}
                        onDoubleClick={() => toggleEdit(el.id, true)}
                        className="cursor-text w-full"
                      >
                        {el.value || "click on link"}
                      </p>
                    </a>
                  ) : (
                    <p
                      style={{
                        fontWeight: el.Style.bold ? "bold" : "normal",
                        textDecoration: el.Style.underline
                          ? "underline"
                          : "none",
                        fontStyle: el.Style.italic ? "italic" : "normal",
                        fontSize: el.Style.fontSize,
                        color: el.Style.color,
                      }}
                      onDoubleClick={() => toggleEdit(el.id, true)}
                      className="cursor-text w-full"
                    >
                      {el.value || "Double click to edit"}
                    </p>
                  ))}

                {el.type === "DropDown" && (
                  <select
                    className="border px-2 py-1 w-full"
                    style={{
                      border: el.Style.border ?? el.Style.border,
                      // borderBottom:el.Style.border
                    }}
                  >
                    <option hidden>Select an option</option>
                    {el?.value?.map((option, index) => (
                      <option key={index} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {el.type === "Toggle" && (
                  <input
                    type="checkbox"
                    checked={el.value}
                    className="w-full h-full"
                  />
                )}
                {el.type === "Radio" && (
                  <input
                    type="radio"
                    name={el.groupName}
                    value={el.value}
                    checked={el.checked}
                    onChange={() => handleRadioSelect(el)}
                  />
                )}
                {el.type === "DatePicker" && (
                  <input
                    type="date"
                    value={el.value}
                    className="border px-2 py-1 w-full h-full"
                    style={{
                      border: el.Style.border ?? el.Style.border,
                      borderBottom: el.Style.border,
                    }}
                  />
                )}
                {el.type === "FileInput" && (
                  <input
                    type="file"
                    className="border px-2 py-1 w-full h-full"
                    style={{
                      border: el.Style.border ?? el.Style.border,
                      borderRadius: el.Style.borderRadius,
                    }}
                  />
                )}
                {el.type === "Submit" && (
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 w-full h-full rounded"
                  >
                    {el.value}
                  </button>
                )}

                {el.type === "Radio" && (
                  <label className="mb-1">{el.value}</label>
                )}

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
      <div className="bg-white w-50 h-full absolute flex flex-col gap-2 px-4 py-5 left-0 top-0 shadow shadow-gray-600">
        <div className="flex flex-col w-full py-2 ">
          <div className="text-cyan-500 font-bold drop-shadow-cyan-500 drop-shadow-sm ">
            Zen - Canvas
          <div className="text-gray-500  "><i class="ri-cloud-line"></i></div>
          </div>
          <div className="border-b flex justify-between text-gray-500 font-bold mt-3 bg-white">
            <span>Client</span> <i class="ri-pencil-line"></i>
          </div>
          <div className=" flex justify-between text-gray-600 font-semibold mt-3 bg-white">
            <span> <i class="ri-drag-move-line"></i> Elements  </span>
          </div>
        </div>


        <div className="flex flex-col gap-3">
        <button onClick={() => addelementtoCanvas("Input")} className="buttonStyle">
          Input <i class="ri-input-cursor-move"></i> 
        </button>
        <button onClick={() => addelementtoCanvas("Radio")} className=" buttonStyle">
          Radio <i class="ri-radio-button-line"></i> 
        </button>
        <button
          onClick={() => addelementtoCanvas("DropDown")}
          className="buttonStyle"
        >
          Drop Down <i className="ri-arrow-drop-down-line"></i>
        </button>
        <button onClick={() => addelementtoCanvas("Toggle")} className="buttonStyle">
          Toggle <i class="ri-toggle-fill"></i>
        </button>
        <button onClick={() => addelementtoCanvas("Text")} className="buttonStyle">
          Add Text <i class="ri-input-field"></i>
        </button>
        <button
          onClick={() => addelementtoCanvas("FileInput")}
          className="buttonStyle"
        >
          File <i class="ri-upload-2-line"></i>
        </button>
        <button
          onClick={() => addelementtoCanvas("DatePicker")}
          className="buttonStyle"
        >
          Date <i class="ri-calendar-line"></i>
        </button>
        <button onClick={() => addelementtoCanvas("Submit")} className="buttonStyle">
          Submit Button <i class="ri-space"></i>
        </button>
        </div>
      </div>
    </div>
  );
};

export default FormCanvas;
