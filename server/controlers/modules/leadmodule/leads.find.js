import Lead from '../../../db/models/leads.schema.js';

async function leadFind(req, res){
  try {
    const lead = await Lead.findById(req.params.id).populate([
      { path: "assignedTo", select: "name email" },
      { path: "notes.author", select: "name email" }
    ]);

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export default leadFind;