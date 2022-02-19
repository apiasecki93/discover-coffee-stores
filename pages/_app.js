import '../styles/globals.css'
import {createContext, useReducer} from 'react'


export const StoreContext = createContext()

// createing action for reducer
export const ACTION_TYPES = {
  SET_LAT_LONG: 'SET_LAT_LONG',
  SET_COFFEE_STORES: 'SET_COFFEE_STORES'
}
// creating logic for reducer 
const storeReducer = (state, action) => {
  switch(action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return { ...state, latLong: action.payload.latLong} 
    }
    case ACTION_TYPES.SET_COFFEE_STORES: { 
      return { ...state, coffeeStores: action.payload.coffeeStores} // we are returning the payload
    }
    default:  
      throw new Error(`Unhandled action type: ${action.type} in _app.js`) 
    
  }
}



const StoreProvider = ({children}) => {
  const initialState = { 
    latLong: '',
    coffeeStores: [],
  }
  // dispatch is just type of action from reducer, in this case can be be 1 of 2 actions : ACTION_TYPES.SET_LAT_LONG or
  // ACTION_TYPES.SET_COFFEE_STORES and base on switch case selection logic related to will be handled by reducer 
  const [state, dispatch] = useReducer(storeReducer, initialState)

  return (
    // In our StoreCOntext we want to provide a value and this will be- 
    //-initializate state itself for our application, any time context get initializate the first time it need some sort of-
    // -initiale state ( you dont have to, but you can provide as the default value so that your application can access it easly
    <StoreContext.Provider value={{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <>
    {/* Component is essentialy going to be ttough all the different pages, so if any pages
    get call then _app.js  is going to return the store Provider that beigin created at initialState as 'coffeStores' */}
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </>
  )
}

export default MyApp
