import Head from 'next/head'
import { FunctionComponent, useState } from 'react'
import { Poppins } from '@next/font/google'
import TestRideForm from './TestRideForm'
import Header from './Header'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '500', '600', '700', '800', '900'],
})

const Layout: FunctionComponent = ({ children }) => {
  const [isTestRideFormOpen, setIsTestRideFormOpen] = useState(false)

  const handleTestRideClick = () => {
    setIsTestRideFormOpen(true)
  }

  const handleCloseTestRideForm = () => {
    setIsTestRideFormOpen(false)
  }

  return (
    <>
      <Head>
        <title>{'Chetak'}</title>
        <link rel="icon" href="https://cdn.bajajauto.com/rev-images/urbanite/favicon.ico" />
      </Head>

      <div className={poppins?.className}>
        <Header onTestRideClick={handleTestRideClick} />
        <main>{children}</main>
        <TestRideForm isOpen={isTestRideFormOpen} onClose={handleCloseTestRideForm} />
      </div>
    </>
  )
}

export default Layout
