require('dotenv').config();
const Airtable = require('./node_modules/airtable');

// Test Airtable connection
async function testAirtableConnection() {
    try {
        console.log('Testing Airtable connection...');
        
        // Configure Airtable
        Airtable.configure({
            apiKey: process.env.AIRTABLE_PERSONAL_TOKEN
        });
        
        const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
        const table = base(process.env.AIRTABLE_TABLE_ID);
        
        console.log('Configuration successful. Attempting to fetch records...');
        
        // Try to fetch records
        const records = await table.select({
            maxRecords: 3,
            view: 'Grid view' // Common default view name
        }).firstPage();
        
        console.log(`Successfully fetched ${records.length} records`);
        if (records.length > 0) {
            console.log('Sample record fields:', Object.keys(records[0].fields));
        }
        
        return records;
    } catch (error) {
        console.error('Airtable connection test failed:', error);
        throw error;
    }
}

testAirtableConnection()
    .then(records => {
        console.log('Test completed successfully');
        process.exit(0);
    })
    .catch(error => {
        console.error('Test failed:', error.message);
        process.exit(1);
    });