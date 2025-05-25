import React, { useState } from 'react'
import ImageHelper from '../helper/Image'
import { useOcSelector } from '../ordercloud/redux/ocStore'
import { ChetakProduct } from './Header'

// Define data for navigation links

const aboutUsLinks = [
  { text: 'Our Presence', href: 'https://www.chetak.com/our-presence' },
  { text: 'Blogs', href: 'https://www.chetak.com/blogs' },
  { text: 'About Bajaj', href: 'https://bajaj-ordercloud.vercel.app/' },
  { text: 'Investors', href: 'https://www.bajajauto.com/investors/investor-services' },
  { text: 'Terms & Conditions', href: 'https://www.chetak.com/terms-and-conditions' },
  { text: 'Privacy Policy', href: 'https://www.chetak.com/privacy-policy' },
  { text: 'Careers', href: 'https://www.bajajauto.com/careers/why-us' },
]

const ownershipLinks = [
  { text: 'Book Now', href: '/booking' },
  { text: 'Finance Offers', href: 'https://availfinance.chetak.com/' },
  { text: 'Test Ride', href: 'https://www.chetak.com/test-ride' },
  { text: 'Buying a Chetak', href: 'https://www.chetak.com/buying-a-chetak' },
  { text: 'Institutional Purchase', href: 'https://www.chetak.com/institutionalsales' },
  { text: 'Price in my city', href: 'https://www.chetak.com/electric-scooter-price-in-pune' },
]

const quickLinks = [
  { text: 'Support', href: 'https://www.chetak.com/support' },
  { text: 'Login/Signup', href: 'https://online.chetak.com/login' },
  { text: 'FAQs', href: 'https://www.chetak.com/faqs' },
]

const Footer = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const { OcProductList } = useOcSelector((s) => {
    const ids = s.ocProductCache.ids || []
    const entities = s.ocProductCache.entities || {}
    // Map IDs to product entities and filter out any undefined values
    const productList: ChetakProduct[] = ids
      .map((id) => entities[id] as ChetakProduct | undefined)
      .filter((product): product is ChetakProduct => product !== undefined)
    return {
      OcProductList: productList,
    }
  })

  const modelsLinks = OcProductList?.map((x) => {
    return { text: `Chetak ${x?.Name}`, href: `/Chetak_Series_35/${x?.ID}` }
  })

  const handleMenuClick = (menuTitle: string) => {
    setOpenMenu(openMenu === menuTitle ? null : menuTitle)
  }

  const AccordionItem = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-700">
      <button
        className="flex justify-between items-center w-full py-4 text-left font-semibold text-white focus:outline-none"
        onClick={() => handleMenuClick(title)}
      >
        {title}
        <span
          className={`transform transition-transform duration-300 ${
            openMenu === title ? 'rotate-180' : 'rotate-0'
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-1000 ease-in-out max-h-0 ${
          openMenu === title ? 'max-h-[1000px] ' : ' '
        }`}
      >
        <div className="pb-4 text-gray-300">{children}</div>
      </div>
    </div>
  )

  // Reusable component for rendering nav links
  const NavLinksList = ({ links }: { links: { text: string; href: string }[] }) => (
    <ul className="space-y-2 text-gray-300 text-md">
      {links.map((link) => (
        <li key={link.text}>
          <a href={link.href} className="hover:underline">
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <section className="bg-[#322b54] text-white py-8 px-4 mt-auto w-full">
      <div className="container mx-auto">
        {/* Desktop View */}
        <div className="hidden md:flex justify-between mb-8">
          <div className="flex flex-col gap-10">
            {/* Logo */}
            <ImageHelper
              url="https://www.chetak.com/series-35/-/media/9714a43b927b4784a532ce89b4795591.ashx"
              alt="Chetak Logo"
              className="max-w-[285px]"
            />
            {/* Contact Info */}
            <div className="flex flex-col gap-4 mt-4 text-sm text-gray-300">
              <p className="flex items-center">
                <span className="mr-2">📞</span> +91- 770 908 4000 (9 am to 8 pm)
              </p>
              <p className="flex items-center mt-2">
                <span className="mr-2">📧</span> customersupport@chetak.com
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-[80px]">
            <div>
              <h3 className="font-semibold mb-4">MODELS</h3>
              <NavLinksList links={modelsLinks} />
            </div>
            <div>
              <h3 className="font-semibold mb-4">ABOUT US</h3>
              <NavLinksList links={aboutUsLinks} />
            </div>
            <div>
              <h3 className="font-semibold mb-4">OWNERSHIP</h3>
              <NavLinksList links={ownershipLinks} />
            </div>
            <div>
              <h3 className="font-semibold mb-4">QUICK LINKS</h3>
              <NavLinksList links={quickLinks} />
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="flex flex-col md:hidden">
          <div className="flex flex-col items-center mb-8 ">
            {/* Logo */}
            <ImageHelper
              url="https://www.chetak.com/series-35/-/media/9714a43b927b4784a532ce89b4795591.ashx?h=22&w=170"
              alt="Chetak Logo"
              className="max-w-[285px]"
            />
            {/* Contact Info */}
            <div className="mt-4 text-sm text-gray-300 text-center">
              <p className="flex items-center justify-center">
                <span className="mr-2">📞</span> +91- 770 908 4000 (9 am to 8 pm)
              </p>
              <p className="flex items-center justify-center mt-2">
                <span className="mr-2">📧</span> customersupport@chetak.com
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <AccordionItem title="MODELS">
              <NavLinksList links={modelsLinks} />
            </AccordionItem>

            <AccordionItem title="ABOUT US">
              <NavLinksList links={aboutUsLinks} />
            </AccordionItem>

            <AccordionItem title="OWNERSHIP">
              <NavLinksList links={ownershipLinks} />
            </AccordionItem>

            <AccordionItem title="QUICK LINKS">
              <NavLinksList links={quickLinks} />
            </AccordionItem>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400 mt-8 pt-8 lg:border-t border-gray-700">
          2025 ©Copyright. All Rights Reserved.
        </div>
      </div>
    </section>
  )
}

export default Footer
