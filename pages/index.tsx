import { FunctionComponent } from 'react'
import styles from '../styles/Home.module.css'
import FinanceOptions from '../components/FinanceOptions'
import ImageHelper from '../helper/Image'

const Home: FunctionComponent = () => {
  return (
    <>
      <main className={styles.main}>
        <div className="banner">
          <ImageHelper url="/images/3503-homepage-web.webp" alt="Home page" />
        </div>
        <FinanceOptions />
      </main>
    </>
  )
}

export default Home
