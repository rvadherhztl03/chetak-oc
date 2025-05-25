import Head from 'next/head'
import { FunctionComponent, useState } from 'react'
import { Poppins } from '@next/font/google'
import TestRideForm from './TestRideForm'
import Header from './Header'
import Footer from './Footer'

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

      <div className={`${poppins?.className} min-h-screen flex flex-col`}>
        <Header onTestRideClick={handleTestRideClick} />
        <main className="">{children}</main>
        <TestRideForm isOpen={isTestRideFormOpen} onClose={handleCloseTestRideForm} />
        <footer className="mt-auto">
          <Footer />
        </footer>
      </div>
    </>
  )
}

export default Layout
