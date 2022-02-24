const Airtable = require('airtable')
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID)

const table = base('coffee-stores')

//minifiedRecords function is created to take from big objest only the nesseseary fields, so it will be a minimize object instead
const getMinifiedRecord = (record) => {
   return {
    //    fiels is taken from json object of airtable which contain all key names of the search table, like id, name, address, neighborhood etc
        recordId: record.id, 
        ...record.fields,
         
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
