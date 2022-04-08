import '../styles/globals.css'
import '../styles/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from '../components/shared/MainLayout';
import {useRouter} from 'next/router'
import { store } from '../redux/store';
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps }) {
  
  const router = useRouter();

  return (
    <>
      {(router.pathname!='/'&& router.pathname!='/userForm') &&
      <Provider store={store}>
        <MainLayout>
        <Component {...pageProps} />
        </MainLayout> 
      </Provider>
      }
      { router.asPath=='/' && <Component {...pageProps} /> }
      { router.pathname=='/userForm' && <Component {...pageProps} /> }
    </>
    )
}

export default MyApp
