export const validateFormPayload = (req, res, next) => {
  const { sections } = req.body;
  console.log(req.body);

  if (!Array.isArray(sections) || sections.length === 0) {
    return res.status(400).json({ message: "At least one section is required" });
  }

  for (const section of sections) {
    // SECTION VALIDATION
    if (!section.title || typeof section.title !== "string") {
      return res.status(400).json({ message: "Section title is required" });
    }

    if (
      typeof section.width !== "number" ||
      section.width < 30 
    ) {
      return res
        .status(400)
        .json({ message: "Section width must be at least 30" });
    }

    if (!Array.isArray(section.fields)) {
      return res
        .status(400)
        .json({ message: "Section fields must be an array" });
    }

    for (const field of section.fields) {
      // FIELD VALIDATION
      if (!field.question || typeof field.question !== "string") {
        return res
          .status(400)
          .json({ message: "Field question is required" });
      }

      if (!field.type || typeof field.type !== "string") {
        return res
          .status(400)
          .json({ message: "Field type is required" });
      }

      if (
        !["full", "half", "third", "quarter", "manual"].includes(field.gridWidth)
      ) {
        return res
          .status(400)
          .json({ message: "Invalid gridWidth value" });
      }

      if (field.gridWidth === "manual") {
        if (
          typeof field.fieldWidthPx !== "number" ||
          field.fieldWidthPx < 100
        ) {
          return res.status(400).json({
            message: "fieldWidthPx must be a number ≥ 100 when gridWidth is manual"
          });
        }
      } else {
        field.fieldWidthPx = null;
      }

      if (field.options && !Array.isArray(field.options)) {
        return res
          .status(400)
          .json({ message: "Field options must be an array" });
      }
    }
  }

  next(); 
};
