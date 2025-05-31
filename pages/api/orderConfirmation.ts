import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type ResponseData = {
  success: boolean
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const body = req.body
  const orderId: string = body?.RouteParams?.orderID
  const octoken: string = body?.AnonUserToken
  let result: boolean = false
  if (orderId && octoken && process.env.NEXT_ET_CLIENTSECRET) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let worksheet: any = undefined
    axios
      .get(`${process.env.NEXT_PUBLIC_OC_BASE_API_URL}/v1/orders/All/${orderId}/worksheet`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${octoken}`,
        },
      })
      .then((response) => {
        if (response?.status == 200 && response.data) {
          worksheet = response.data
          if (worksheet) {
            axios
              .post('https://mcyl0bsfb6nnjg5v3n6gbh9v6gc0.auth.marketingcloudapis.com/v2/token', {
                grant_type: 'client_credentials',
                client_id: 'lf5r1l4pmw47mabwh3qmk6gq',
                client_secret: process.env.NEXT_ET_CLIENTSECRET,
                account_id: '100016735',
              })
              //.then((response) => console.log(response))
              .then((response) => {
                if (response?.status == 200) {
                  SendBookingConfirmationEmail(worksheet, response?.data?.access_token)
                  result = true
                }
              })
              .then((error) => console.log(error))
          } else {
            console.log(`Worksheet null ${orderId}`)
          }
        }
      })
  } else {
    console.log('Payload has missing order data')
  }
  res.status(200).json({ success: result })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function SendBookingConfirmationEmail(worksheet: any, sfmctoken: string) {
  if (sfmctoken) {
    console.log(`SendBookingConfirmationEmail`)
    const vehicle = worksheet.LineItems[0]
    const name = vehicle.xp.name.split(' ')
    axios
      .post(
        'https://mcyl0bsfb6nnjg5v3n6gbh9v6gc0.rest.marketingcloudapis.com/interaction/v1/events',
        {
          ContactKey: 'dkumar@horizontal.com',
          EventDefinitionKey: 'APIEvent-cf204840-2ced-ab8a-a103-4a4bb3f27119',
          Data: {
            email: vehicle.xp.email,
            firstname: name[0],
            lastname: name.length > 1 ? name[1] : '',
            bookingid: worksheet.Order.ID,
            bookingamount: vehicle.xp.bookingAmount ?? '2000.00',
            vehicletype: 'Chetak',
            vehiclevariant: vehicle.xp.model ?? '3501',
            bookingdate: new Date().toDateString(),
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sfmctoken}`,
          },
        }
      )
      .then((response) => {
        if (response?.status == 201) {
          console.log(response.data)
        }
      })
      .then((error) => console.log(error))
  } else {
    console.log('Token Missing in token response')
  }
}
