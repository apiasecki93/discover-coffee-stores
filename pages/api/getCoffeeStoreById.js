import { table, getMinifiedRecords, findRecordByFilter } from '../../lib/airtable'


const getCoffeeStoresById = async (req, res) => {
    console.log('req',req)
    const {id} = req.query

    try {
        if (id) {
            console.log(id, 'getId api line9')
            const records = await findRecordByFilter(id)


            if (records.length !== 0) {
                res.json(records);
            } else {
                res.json({message: `id coudn't be found at api/getCoffeeStoreById in try block 
                that mean that can't find store with this IP:${id} in airtable of coffee stores`})
            }

        } else {
            res.status(400)
            res.json({message: 'id is missing'})
        }

    } catch(error) {
        res.status(500);
        res.json({message: "Somethin went wrong api/getCoffeeStoreById"})
    }

}

export default getCoffeeStoresById;