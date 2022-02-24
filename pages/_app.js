import '../styles/globals.css'
import {createContext, useReducer} from 'react'
import StoreProvider from '../store/store-context'



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
