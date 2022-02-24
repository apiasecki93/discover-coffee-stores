import { table, findRecordByFilter, getMinifiedRecords } from "../../lib/airtable"

const favouriteCoffeeStoreById = async (req, res) => {

    if (req.method === 'PUT') {
        try {
            const { id } = req.body

            if (id) {
                const records = await findRecordByFilter(id)

                if (records.length !== 0) {

                    const record = records[0];
                    const calculateVoting = parseInt(record.voting) + 1 //parseInt is allowing us to convert string into a number

                    //update voting  in airtable base on id
                    const updatedRecords = await table.update([
                        {
                            id: record.recordId, // this is uniqe id for the en row from airtable its look e.g like this: "recj4Il54I4nehUu0"
                            fields: {
                                voting: calculateVoting 
                            },
                        },
                    ]);

                    if (updatedRecords) {
                        const minifiedRecords = getMinifiedRecords(updatedRecords)
                        res.json(minifiedRecords)
                    }
                } else {
                    res.json({message: "coffeeStore id doesn't exist " + id})
                }
            } else {
                res.status(404)
                res.json({message: "id is missing in favouriteCoffeeStoreById"})
            }

        } catch(error) {   
            res.status(500);
            res.json({message: "Error upvoting our coffee store, is the method is PUT? favouriteCoffeeStoreById line 10", error})
        }
    }
}

export default favouriteCoffeeStoreById