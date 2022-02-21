// initialize the unsplash API
import { createApi } from 'unsplash-js'
const unsplashApi = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
})

// initialize the foursquare API
const getUrlForCoffeeStores = async (latLong,  query, limit) => {
    const header = { headers: { Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_TOKEN } }
    const response = await fetch(`https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query} store&v=202202015&limit=${limit}`, header)
    //console.log(response)
    const dataAboutCoffeStoresFromAPI = await response.json()
     //console.log(dataAboutCoffeStoresFromAPI)
    return dataAboutCoffeStoresFromAPI
}

const getListOfCoffeeStorePhotos = async () => {
  // instance of unslash createApi (from above)
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: 40,
    color: 'green',
    // orientation: 'portrait',
  });
  //console.log(photos)
  const unSplashResults = photos.response?.results || [];
  //console.log(photos.response)
  return unSplashResults.map((result) => result.urls["small"])
  
}

export const fetchCoffeeStores = async (latLong = process.env.FOURSQUARE_LatLong, limit = 6) => {
    const photos = await getListOfCoffeeStorePhotos()
    let dataAboutCoffeStoresFromAPI = await getUrlForCoffeeStores(latLong, 'coffee store', limit)
    //console.log(dataAboutCoffeStoresFromAPI)
    //console.log(photos)
    
    return dataAboutCoffeStoresFromAPI.results?.map((venue, idx) => {
      return {
         ...venue,
        //id: venue.id,
        id: venue.fsq_id,
        address: venue.location.address || "",
        name: venue.name,
        neighborhood:
          venue.location.neighborhood || venue.location.crossStreet || "",
         imgUrl: photos[idx],
      };
    }) || [] ;
  }

