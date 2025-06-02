import Link from 'next/link'
import ImageHelper from '../helper/Image'
import { FunctionComponent, useState, useEffect, useRef } from 'react'
import { ChevronDown, Menu, User, X } from 'lucide-react'
import { useOcSelector } from '../ordercloud/redux/ocStore'

interface HeaderProps {
  onTestRideClick: () => void
}

interface PriceBreak {
  Quantity?: number
  Price?: number
  SalePrice?: number | null
  SubscriptionPrice?: number | null
  BundlePrice?: number | null
}

interface PriceSchedule {
  OwnerID?: string
  ID?: string
  Name?: string
  ApplyTax?: boolean
  ApplyShipping?: boolean
  MinQuantity?: number
  MaxQuantity?: number | null
  UseCumulativeQuantity?: boolean
  RestrictedQuantity?: boolean
  PriceBreaks?: PriceBreak[]
  Currency?: string | null
  SaleStart?: string | null
  SaleEnd?: string | null
  IsOnSale?: boolean
  xp?: null
}

interface Inventory {
  Enabled: boolean
  NotificationPoint: number | null
  VariantLevelTracking: boolean
  OrderCanExceed: boolean
  QuantityAvailable: number | null
  LastUpdated: string | null
}

interface ProductXP {
  Range?: string
  TopSpeed?: string
  Charger?: string
  BodyType?: string
  IP67RatedWaterResistance?: boolean
  ChargingTime?: string
  Brakes?: string
  Display?: string
  BatteryCapacity?: string
  Colour?: { [key: string]: string }[]
  Reverse?: boolean
  SelfCancellingBlinkers?: boolean | string
  AutoHazardLight?: boolean
  CallAcceptReject?: boolean
  HelmetBox?: string
  FrontStorage?: string
  StandardWarranty?: string
  AdditionalRideModes?: string[]
  MusicControl?: boolean
  HillHold?: boolean
  SequentialRearBlinkers?: boolean
  GuideMeHomeLights?: boolean
  DisplayThemeChange?: boolean
  AppConnectivity?: string
  Navigation?: string | boolean
  RemoteImmobilization?: boolean
  OverSpeedAlert?: boolean
  AccidentDetection?: boolean
  NotificationAlert?: boolean
  TripDataAnalytics?: boolean
  DocumentStorage?: boolean
  GeoFencing?: boolean
  Images?: { Url: string }[]
  AdditionalImages?: {
    MusicControl?: string
    RemoteImmobilization?: string
    BackgroundImage?: string
    GeoFacing?: string
    HillHold?: string
    Display?: string
    OverSpeedAlert?: string
    Light?: string
  }
}

export interface ChetakProduct {
  PriceSchedule?: PriceSchedule
  ID: string
  ParentID: string | null
  IsParent: boolean
  IsBundle: boolean
  Name: string
  Description: string | null
  QuantityMultiplier: number
  ShipWeight: number | null
  ShipHeight: number | null
  ShipWidth: number | null
  ShipLength: number | null
  Active: boolean
  SpecCount: number
  VariantCount: number
  ShipFromAddressID: string | null
  Inventory: Inventory
  DefaultSupplierID: string | null
  AllSuppliersCanSell: boolean
  Returnable: boolean
  DateCreated?: string
  xp?: ProductXP
}

const Header: FunctionComponent<HeaderProps> = ({ onTestRideClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false)
  const exploreRef = useRef<HTMLLIElement>(null)
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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Add click outside handler for explore dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setIsExploreDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleExploreDropdown = () => {
    setIsExploreDropdownOpen(!isExploreDropdownOpen)
  }

  return (
    <div className="relative" id="header">
      <header
        className={` py-3 rounded-b-lg absolute top-0 w-full z-50 bg-transparent backdrop-blur-2xl relative`}
      >
        <div className="header__wrapper flex items-center justify-between   px-4">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <div>
              <ImageHelper
                url="https://cdn.bajajauto.com/-/media/images/chetakv2/chetak-logo.gif"
                alt="Chetak"
                pictureClasses="relative block top-[-20px] h-[70px] w-[200px] overflow-hidden"
              />
            </div>
          </Link>

          {/* Desktop Buttons and Mobile Hamburger */}
          <div className="flex items-center gap-4">
            {/* Desktop Buttons */}
            <ul className="hidden lg:flex gap-4">
              <li className="" ref={exploreRef}>
                <div
                  className="flex items-center gap-2 py-2 px-8 border border-[#fff] text-[#fff] rounded-3xl hover:bg-[#fff] hover:text-[#322b54] hover:delay-10 cursor-pointer"
                  onClick={toggleExploreDropdown}
                >
                  <div className="flex text-[#055160] font-semibold items-center gap-1">
                    Explore{' '}
                    <ChevronDown
                      size={20}
                      className={`${isExploreDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>
                {isExploreDropdownOpen && (
                  <div
                    id="explore-dropdown"
                    className="absolute px-12 top-full w-fit left-auto right-0 bg-white shadow-lg rounded-b-lg z-40 py-4 w-fit"
                  >
                    <div className="px-4 flex justify-end">
                      {/* Group products by a conceptual series (based on ID prefix) */}
                      {Array.isArray(OcProductList) &&
                        Object.entries(
                          OcProductList.reduce(
                            (acc: Record<string, ChetakProduct[]>, product: ChetakProduct) => {
                              const seriesPrefix =
                                product.ID?.split('_')[1]?.substring(0, 2) || 'Other'
                              if (!acc[seriesPrefix]) {
                                acc[seriesPrefix] = []
                              }
                              acc[seriesPrefix].push(product)
                              return acc
                            },
                            {}
                          )
                        ).map(([series, products]) => (
                          <div key={series} className="flex items-center gap-12 p-4">
                            <Link
                              href={'/Chetak_Series_35'}
                              className="text-lg flex flex-col items-center  mb-2"
                              onClick={() => {
                                setIsExploreDropdownOpen(false)
                              }}
                            >
                              <span className="text-[#322b54]">Series </span>
                              <span className="text-[#0dcaf0] text-3xl italic font-bold">
                                {series}
                              </span>
                            </Link>
                            <div className="flex gap-2">
                              {products.map((product) => (
                                <Link
                                  href={`/Chetak_Series_35/${product?.ID}`}
                                  key={product.ID}
                                  className="flex flex-col items-center gap-2 relative group"
                                  onClick={() => {
                                    setIsExploreDropdownOpen(false)
                                  }}
                                >
                                  {/* Placeholder for image - replace with actual image component/logic */}
                                  <div className="">
                                    <ImageHelper
                                      url={product?.xp?.Images?.[0]?.Url}
                                      className="w-[200px] h-auto "
                                      pictureClasses="block w-[160px]"
                                    />
                                  </div>
                                  <div className="relative">
                                    <p className="font-semibold text-[#0dcaf0]">{product.Name}</p>
                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0dcaf0] transition-all duration-300 ease-in-out group-hover:w-full"></div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </li>
              <li
                className={`py-2 px-8 border border-[#111] font-semibold  rounded-3xl hover:bg-[#fff] hover:text-[#322b54] hover:delay-10`}
                onClick={onTestRideClick}
              >
                Test Ride
              </li>
              <Link
                href={'/booking'}
                className="font-semibold py-2 px-8 rounded-3xl text-[#322b54] bg-gradient-to-b from-[#95e9f1] to-[#47bcc8] cursor-pointer"
              >
                Book Now
              </Link>
              <Link
                href={'/myOrders'}
                className="font-semibold flex gap-2 py-2 px-8 rounded-3xl text-[#322b54] bg-gradient-to-b from-[#95e9f1] to-[#47bcc8] cursor-pointer"
              >
                My Orders <User size={24} />
              </Link>
            </ul>

            {/* Mobile Menu Button */}

            <button
              onClick={toggleMenu}
              className="lg:hidden text-2xl  "
              aria-label="Toggle menu"
              key={isMenuOpen ? 'close' : 'open'}
            >
              {!isMenuOpen ? <Menu /> : <X />}
            </button>
          </div>
        </div>
      </header>

      {/* Explore Dropdown */}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-gray-100 z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } lg:hidden`}
      >
        <div className="relative h-full">
          <div className="flex flex-col h-full space-y-12 pt-32">
            <div className="w-full flex flex-col gap-4 items-center w-full px-4">
              <div
                id="explore-dropdown"
                className=" w-full bg-white shadow-lg rounded-b-lg z-40 py-4"
              >
                <div className="px-4 flex ">
                  {/* Group products by a conceptual series (based on ID prefix) */}
                  {Array.isArray(OcProductList) &&
                    Object.entries(
                      OcProductList.reduce(
                        (acc: Record<string, ChetakProduct[]>, product: ChetakProduct) => {
                          const seriesPrefix = product.ID?.split('_')[1]?.substring(0, 2) || 'Other'
                          if (!acc[seriesPrefix]) {
                            acc[seriesPrefix] = []
                          }
                          acc[seriesPrefix].push(product)
                          return acc
                        },
                        {}
                      )
                    ).map(([series, products]) => (
                      <div key={series} className="flex flex-col gap-6 p-4">
                        <Link
                          href={'/Chetak_Series_35'}
                          className="text-lg flex items-center gap-2 mb-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-[#322b54]">Series </span>
                          <span className="text-[#0dcaf0] text-3xl italic font-bold">{series}</span>
                        </Link>
                        <div className="flex gap-5">
                          {products.map((product) => (
                            <Link
                              href={`/Chetak_Series_35/${product?.ID}`}
                              key={product.ID}
                              className="flex flex-col items-center gap-2 relative group"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {/* Placeholder for image - replace with actual image component/logic */}

                              <div className="relative">
                                <p className="font-semibold text-[#0dcaf0]">{product.Name}</p>
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0dcaf0] transition-all duration-300 ease-in-out group-hover:w-full"></div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <button
                type="button"
                className="w-full py-3 px-8 rounded-3xl font-semibold text-[#322b54] bg-gradient-to-b from-[#95e9f1] to-[#47bcc8] transition"
                onClick={() => {
                  onTestRideClick()
                  toggleMenu()
                }}
              >
                Test Ride
              </button>
              <Link
                href={'/booking'}
                onClick={() => setIsMenuOpen(false)}
                className="font-semibold w-full flex justify-center py-3 px-8 rounded-3xl text-[#322b54] bg-gradient-to-b from-[#95e9f1] to-[#47bcc8] cursor-pointer"
              >
                Book Now
              </Link>
              <Link
                href={'/myOrders'}
                onClick={() => {
                  setIsMenuOpen(false)
                }}
                className="font-semibold w-full flex gap-4 justify-center py-3 px-8 rounded-3xl text-[#322b54] bg-gradient-to-b from-[#95e9f1] to-[#47bcc8] cursor-pointer"
              >
                My Orders <User size={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
