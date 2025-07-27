// pages/api/tools.js (for /api/tools)
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_ID)
      .select({ maxRecords: 100, view: 'Grid view' })
      .all();

    // Clean up the records to a friendlier format
    const tools = records.map(record => ({
      id: record.id,
      ...record.fields,
    }));

    res.status(200).json({ tools });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
