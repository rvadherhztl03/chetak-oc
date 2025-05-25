import ImageHelper from '../helper/Image'
import { ChetakProduct } from './Header'

type ProductFeatureProps = {
  product: ChetakProduct
}

const ProductFeature: React.FC<ProductFeatureProps> = ({ product }) => {
  const features = product?.xp || {}
  return (
    <div className="w-full bg-[#322b54]">
      <div className="w-full flex flex-col justify-between items-center pt-[72px] text-white gap-4">
        <h2>TECPAC FEATURES</h2>
        <h3 className="text-[32px]"> Level up with Tecpac</h3>
        <p>Pricing starts at ₹4000. Data Pack from ₹1300 onwards.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {/* Digital Docs */}
        {features.Display && (
          <div className="bg-[#665a9e] row-span-2 h-fit rounded-3xl rounded-ee-none p-6 text-white">
            <h2 className="text-xl font-medium mb-4">Digital Docs</h2>
            {/* Placeholder for image or icon */}

            <ImageHelper url={product?.xp?.AdditionalImages?.Display} />
          </div>
        )}

        {/* Hill Hold */}
        {features.HillHold && (
          <div className="bg-[#665a9e] row-span-2 h-fit rounded-3xl rounded-bl-none p-6 text-white">
            <h2 className="text-xl font-medium mb-4">Hill Hold</h2>
            {/* Placeholder for image or icon */}
            <ImageHelper url={product?.xp?.AdditionalImages?.HillHold} />
          </div>
        )}

        {/* Guide Me Home Light */}

        <div className="bg-[#665a9e]  row-span-2 rounded-lg p-6 text-white">
          <h2 className="text-xl font-medium mb-4">Guide Me Home Light</h2>

          <ImageHelper url={product?.xp?.AdditionalImages?.Light} />
        </div>

        {/* Anti-theft alert */}
        {/* {features.NotificationAlert && (
          <div className="bg-[#665a9e] rounded-lg p-6 text-white">
            <h2 className="text-xl font-medium mb-4">Anti-theft alert</h2>
            <ImageHelper url={product?.xp?.AdditionalImages} />
          </div>
        )} */}

        {/* Music Control */}
        {features.MusicControl && (
          <div className="bg-[#665a9e] rounded-3xl rounded-ee-none p-6 text-white">
            <h2 className="text-xl font-medium mb-4">Music Control</h2>

            <ImageHelper url={product?.xp?.AdditionalImages?.MusicControl} />
          </div>
        )}

        {/* Over Speed Alert */}
        {features.OverSpeedAlert && (
          <div className="bg-[#665a9e] h-fit  rounded-3xl rounded-bl-none p-6 text-white">
            <h2 className="text-xl font-medium mb-4">Over Speed Alert</h2>
            <ImageHelper url={product?.xp?.AdditionalImages?.OverSpeedAlert} />
          </div>
        )}

        {/* Map Navigation */}
        {features.GeoFencing && (
          <div className="bg-[#665a9e] rounded-3xl rounded-tr-none h-fit  p-6 text-white">
            <h2 className="text-xl font-medium mb-4">Map Navigation</h2>
            <ImageHelper url={product?.xp?.AdditionalImages?.GeoFacing} />
          </div>
        )}

        {/* Remote Immobilization */}
        {features.RemoteImmobilization && (
          <div className="bg-[#665a9e] rounded-3xl rounded-tl h-fit p-6 text-white">
            <h2 className="text-xl font-medium mb-4">Remote Immobilization</h2>
            <ImageHelper url={product?.xp?.AdditionalImages?.RemoteImmobilization} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductFeature
