import '../styles/globals.css'
import {store} from "@redux/store"
import { Provider } from 'react-redux'
import Header from "../components/Header";
import { Poppins} from 'next/font/google'
const inter = Poppins({
  weight: ['100','300','500', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
})
 
function MyApp({ Component, pageProps }) {
  return(
  <Provider store={store}>
    <div className={inter.className}>
    <Header />
    <Component {...pageProps} />
    </div>
  </Provider>)
}

export default MyApp;
