// lib/getAirtableResources.js
export async function getAirtableResources() {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;
  const url = `https://api.airtable.com/v0/${baseId}/${tableId}?maxRecords=200`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) throw new Error('Failed to fetch Airtable data');
  const data = await res.json();
  return data.records.map(rec => ({ id: rec.id, ...rec.fields }));
}

