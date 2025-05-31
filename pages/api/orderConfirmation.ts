import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type ResponseData = {
  success: boolean
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const body = req.body
  const orderId: string = body?.RouteParams?.orderID
  const octoken: string = body?.AnonUserToken
  const result: boolean = false

  //await axios.post('https://webhook.site/39c63458-f6c4-43ef-8ed7-fd71e556f341', req.body)

  if (orderId && octoken && process.env.NEXT_PUBLIC_ET_CLIENTSECRET) {
    console.log(
      `${orderId}|${octoken?.slice(-5)}|${
        process.env?.NEXT_PUBLIC_OC_BASE_API_URL
      }|${process.env?.NEXT_PUBLIC_ET_CLIENTSECRET?.slice(-5)}`
    )

    const worksheet = await GetWorksheet(orderId, octoken)
    if (worksheet) {
      const sfmctoken = await GetSfmcToken()
      if (sfmctoken) {
        const emailsent = await SendBookingConfirmationEmail(worksheet, sfmctoken)
        console.log(emailsent)
      } else {
        console.log('failed to get sfmctoken')
      }
    } else {
      console.log(`Worksheet not found ${orderId}`)
    }
  } else {
    console.log('orderId or octoken or NEXT_PUBLIC_ET_CLIENTSECRET Missing!')
  }
  res.status(200).json({ success: result })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function GetWorksheet(orderId: string, octoken: string) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_OC_BASE_API_URL}/v1/orders/All/${orderId}/worksheet`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${octoken}`,
      },
    }
  )
  return response?.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function GetSfmcToken() {
  const response = await axios.post(
    'https://mcyl0bsfb6nnjg5v3n6gbh9v6gc0.auth.marketingcloudapis.com/v2/token',
    {
      grant_type: 'client_credentials',
      client_id: 'lf5r1l4pmw47mabwh3qmk6gq',
      client_secret: process.env.NEXT_PUBLIC_ET_CLIENTSECRET,
      account_id: '100016735',
    }
  )
  return response?.data?.access_token
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function SendBookingConfirmationEmail(worksheet: any, sfmctoken: string) {
  const vehicle = worksheet.LineItems[0]
  const name = vehicle.xp.name.split(' ')
  const response = await axios.post(
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
  return response?.data
}
