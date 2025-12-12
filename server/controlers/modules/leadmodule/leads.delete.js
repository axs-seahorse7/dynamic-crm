import Lead from '../../../db/models/leads.schema.js';

async function leadsDelete(req, res) {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ message: "Lead deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export default leadsDelete;