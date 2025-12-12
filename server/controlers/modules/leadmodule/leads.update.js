 import Lead from '../../../db/models/leads.schema.js';

 async function leadsUpdate(req, res) {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export default leadsUpdate;