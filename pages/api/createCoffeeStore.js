import { table, getMinifiedRecords, findRecordByFilter } from '../../lib/airtable'

const createCoffeeStore = async (req, res) => {
    //console.log(req.method) by default it is always GET
    // if statment with  post method, then check if ID in ariTbale table exists if not then create a new record
    //console.log(typeof(req.body)) !! if you are using postman for testing, you have to set data to post ad JSON object as raw value
  

    if (req.method === 'POST') {

        const { id, name, address, neighborhood, voting, imgUrl } =  req.body
        //console.log only the type of req.body

        //console.log('req', typeOf(req.body))
        //find a record if id exists
        try {
            //console.log(id, 'iddddddd')
            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    res.json(records);
                } else {
                    // create record if unable to find it only when  name aviable
                    if (name) {
                    const createdRecords = await table.create([
                        {
                            fields: {
                                id,
                                name,
                                address,
                                neighborhood,
                                voting,
                                imgUrl,
                            },
                        },
                    ])

                    const records =  getMinifiedRecords(createdRecords) // passed paramter is an array of airtable records to post data 
                    res.json({message: "created record", records})
                    } else {
                        res.status(400)
                        res.json({message: "id or name not available"})
                    }
                }
            } else {
                res.status(400);
                res.json({ message: "Id is missing"})
            }
        } catch (error) {
            //console.log('error creating or finding store in catch block of createCoffeeStore API', {error})
            res.status(500)
            res.json({message: "error creating or finding store in catch block of createCoffeeStore API"}, {error})
        }
    }
    
}

export default createCoffeeStore