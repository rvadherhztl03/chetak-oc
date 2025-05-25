// pages/products/[productId]/booking.js
import { useOcSelector } from '../ordercloud/redux/ocStore'
import { ChetakProduct } from '../components/Header'

export default function ProductBookingPage() {
  const { product } = useOcSelector((s) => {
    const ids = s.ocProductCache.ids || []
    const entities = s.ocProductCache.entities || {}
    // Map IDs to product entities and filter out any undefined values
    const productList: ChetakProduct[] = ids
      .map((id) => entities[id] as ChetakProduct | undefined)
      .filter((product): product is ChetakProduct => product !== undefined)
    return {
      product: productList,
    }
  })

  // Mock data - replace with your actual data

  if (!product) return null

  return <div className="mx-auto p-4"></div>
}
