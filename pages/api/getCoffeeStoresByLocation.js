import {fetchCoffeeStores} from '../../lib/coffee-stores'

const getCoffeeStoresByLocation = async (req, res) => {
    
    //configure latLong and limit
    try {
        const {latLong, limit } = req.query;

        const response = await fetchCoffeeStores(latLong, limit)

        res.status(200);
        res.json(response);
    } catch (err) {
        //console.log(`this is the error at api/getCoffeeStores line 12`, err)
        res.status(500);
        res.json({message: "Oh no! Something went wrong", err});
    }
    

        //return
}

export default getCoffeeStoresByLocation