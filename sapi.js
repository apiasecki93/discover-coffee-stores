
const getUrlForCoffeeStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&v=20220105&limit=${limit}`
  }
   
  export const fetchCoffeeStores = async () => {
    const url = getUrlForCoffeeStores(process.env.NEXT_PUBLIC_LOCATION, 'coffee stores', 8)
    const header = { headers: { Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY } }
    const response = await fetch(url, header)
    const data = await response.json()
   
   
   
    const transformedData =
      data?.results?.map((venue) => {
        return {
          id: venue.fsq_id,
          ...venue,
        }
      }) || []
   
    
   
    return transformedData
  }


