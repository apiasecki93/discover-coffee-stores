const Airtable = require('airtable')
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID)

const table = base('coffee-stores')

const getMinifiedRecord = (record) => {
   return {
    //    fiels is taken from json object of airtable which contain all key names of the search table, like id, name, address, neighborhood etc
         ...record.fields
    }
}

const getMinifiedRecords = (records) => {
    return records.map((record) => getMinifiedRecord(record)) // it will return records or empty array
}

const findRecordByFilter = async (id) => {
    const findCoffeeStoreRecords = await table
    .select({
        filterByFormula: `id="${id}"`,
    }).firstPage()
     return getMinifiedRecords(findCoffeeStoreRecords)
    
}

export {table, getMinifiedRecords, findRecordByFilter}
