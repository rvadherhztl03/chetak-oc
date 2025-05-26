import { FunctionComponent, useState } from 'react'
import useOcProductDetail from '../../hooks/useOcProductDetail'
import formatPrice from '../../utils/formatPrice'
import ImageHelper from '../../../helper/Image'
import TestRideForm from '../../../components/TestRideForm'
import Link from 'next/link'
import ProductFeature from '../../../components/ProductFeature'
import { ChetakProduct } from '../../../components/Header'
import FinanceOptions from '../../../components/FinanceOptions'

interface OcProductDetailProps {
  productId: string
  lineItemId?: string
  onLineItemAdded?: () => void
  onLineItemUpdated?: () => void
}

const OcProductDetail: FunctionComponent<OcProductDetailProps> = ({ productId }) => {
  const { product } = useOcProductDetail(productId)
  const [isTestRideFormOpen, setIsTestRideFormOpen] = useState(false)

  return product ? (
    <div>
      <ProductHero product={product} onTestRideClick={() => setIsTestRideFormOpen(true)} />
      <TestRideForm isOpen={isTestRideFormOpen} onClose={() => setIsTestRideFormOpen(false)} />
      <FinanceOptions />
      {/* Render ProductFeature component */}
      <ProductFeature product={product as ChetakProduct} />
    </div>
  ) : null
}

interface ProductHeroProps {
  product: ChetakProduct
  onTestRideClick: () => void
  headLine?: string
}

export const ProductHero: React.FC<ProductHeroProps> = ({ product, onTestRideClick, headLine }) => {
  return (
    <div className="relative w-full h-[60vh]">
      {product?.xp?.AdditionalImages && (
        <ImageHelper
          url={product?.xp?.AdditionalImages?.BackgroundImage}
          className="object-cover w-full h-full object-cover"
          pictureClasses="h-full w-full"
        />
      )}
      {/* Overlay container for text and buttons */}
      <div className="absolute bottom-10 left-[5%] text-white pr-5">
        <h1 className="text-4xl font-medium mb-4">{headLine || 'The Best Chetak Yet'}</h1>
        <div className="bg-white p-8 rounded-[32px] rounded-tl-none text-gray-800">
          <p className="text-lg mb-2">The new chetak {product?.Name}, starting from</p>
          <div className="flex items-baseline justify-center text-2xl font-semibold mb-4">
            <span>{formatPrice(product?.PriceSchedule?.PriceBreaks[0]?.Price)}/-</span>
            <span className="ml-2 text-sm font-normal">
              or {(Number(product?.PriceSchedule?.PriceBreaks[0]?.Price) / 48)?.toFixed(2)}/m*
            </span>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <button
              className="border w-full border-gray-300 font-semibold px-6 py-2 rounded-full h-12"
              onClick={onTestRideClick}
            >
              Test Ride
            </button>
            <Link
              href={'/booking'}
              className="bg-gradient-to-b w-full font-semibold from-[#95e9f1] to-[#47bcc8] text-[#322b54] px-6 py-2 rounded-full h-12 flex justify-center  items-center"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OcProductDetail
