import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import OcCheckout from '../ordercloud/components/OcCheckout'
import { useOcSelector } from '../ordercloud/redux/ocStore'

const CheckoutPage: FunctionComponent = () => {
  const { push } = useRouter()
  const { initialized } = useOcSelector((s) => s.ocCurrentOrder)

  // useEffect(() => {
  //   if (!initialized || !order || (order && !order.LineItemCount)) {
  //     push('/cart')
  //   }
  // }, [order, initialized, push])

  return initialized ? (
    <div className="flex justify-around items-center customNirmal">
      <OcCheckout onSubmitted={(orderId: string) => push(`/confirmation/${orderId}`)} />
      {/* <div>
        <OcLineItemList />
        <OcCheckoutSummary />
      </div> */}
    </div>
  ) : null
}

export default CheckoutPage
