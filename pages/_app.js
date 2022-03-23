import '../styles/globals.css'
import '../styles/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from '../components/shared/MainLayout';
import {useRouter} from 'next/router'

function MyApp({ Component, pageProps }) {
  
  const router = useRouter();

  return (
    <>
      {router.asPath!='/' &&
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout> 
      }
      { router.asPath=='/' && <Component {...pageProps} /> }
    </>
    )
}

export default MyApp
