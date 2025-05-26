import { FunctionComponent, useState } from 'react'
import useOcProductList from '../../hooks/useOcProductList'
import { OcProductListOptions } from '../../redux/ocProductList'
import { ChevronRight } from 'lucide-react'
import { ChetakProduct } from '../../../components/Header'
import ImageHelper from '../../../helper/Image'
import formatPrice from '../../utils/formatPrice'
import Link from 'next/link'
import { ProductHero } from '../OcProductDetail'
import TestRideForm from '../../../components/TestRideForm'

export interface OcProductListProps {
  options?: OcProductListOptions
  renderItem?: (product: ChetakProduct) => JSX.Element
}

const OcProductList: FunctionComponent<OcProductListProps> = ({ options }) => {
  const products = useOcProductList(options)
  const [isTestRideFormOpen, setIsTestRideFormOpen] = useState(false)

  return (
    <>
      {products && (
        <div>
          <ProductHero
            product={products?.[0] as ChetakProduct}
            onTestRideClick={() => setIsTestRideFormOpen(true)}
            headLine="Lifeproof build. Futureproof tech."
          />
          <div className=" bg-white py-12 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-center text-3xl">
                See All <span className="text-[#2a939d]">Models</span>
              </h1>
              {/* Product Grid - 2 columns on desktop, 1 on mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-12 mx-auto items-center justify-center">
                {products.map((product, index) => {
                  const isLastItem = index === products.length - 1
                  const isOddTotal = products.length % 2 !== 0
                  const shouldCenter = isLastItem && isOddTotal

                  return (
                    <div
                      key={product.ID}
                      className={`${shouldCenter ? 'lg:col-span-2 lg:flex lg:justify-center' : ''}`}
                    >
                      <ProductCard product={product as ChetakProduct} shouldCenter={shouldCenter} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <TestRideForm isOpen={isTestRideFormOpen} onClose={() => setIsTestRideFormOpen(false)} />
        </div>
      )}
    </>
  )
}

const ProductCard: React.FC<{ product: ChetakProduct; shouldCenter: boolean }> = ({
  product,
  shouldCenter,
}) => {
  const price = product.PriceSchedule.PriceBreaks[0]?.Price || 0
  const monthlyEmi = Math.round(price / 36) // Assuming 36 month EMI

  return (
    <div className={`rounded-3xl p-8 text-center ${shouldCenter && 'lg:w-1/2'}`}>
      {/* Product Image */}
      <div className="mb-8 flex justify-center items-center ">
        <ImageHelper
          url={product.xp.Images[1]?.Url}
          alt={`Chetak ${product.Name}`}
          className="max-w-full max-h-full object-contain filter drop-shadow-lg"
        />
      </div>

      {/* Starting from text */}
      <div className="text-gray-600 text-lg mb-2">Starting from</div>

      {/* Price */}
      <div></div>
      <div className="mb-2">
        <span className="text-3xl font-medium text-gray-900 ml-1">{formatPrice(price)}/-*</span>
      </div>

      {/* EMI text */}
      <div className="text-gray-600 text-base mb-8">
        or ₹{monthlyEmi.toLocaleString('en-IN')}/month**
      </div>

      {/* Know more button */}
      <Link
        href={`/Chetak_Series_35/${product?.ID}`}
        className="w-full  bg-transparent border border-gray-300 text-gray-700 py-4 px-8 rounded-full font-medium hover:border-gray-400 hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
      >
        Know more
        <ChevronRight size={20} />
      </Link>
    </div>
  )
}

export default OcProductList
