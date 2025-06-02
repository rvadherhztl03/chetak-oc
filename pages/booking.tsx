// pages/products/[productId]/booking.js
import { useOcDispatch, useOcSelector } from '../ordercloud/redux/ocStore'
import { ChetakProduct } from '../components/Header'
import { ChevronDown, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import ImageHelper from '../helper/Image'
import formatPrice from '../ordercloud/utils/formatPrice'
import useOcCart from '../ordercloud/redux/useOcCart'
import { submitOrder } from '../ordercloud/redux/ocCurrentOrder'
import { useRouter } from 'next/router'
import { Me } from 'ordercloud-javascript-sdk'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

// Validation schemas
const step1Schema = Yup.object().shape({
  model: Yup.string().required('Please select a model'),
  location: Yup.string().required('Location is required'),
  color: Yup.string().required('Please select a color'),
})

const step2Schema = Yup.object().shape({
  dealership: Yup.string().required('Please select a dealership'),
  name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  contact: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .required('Contact number is required'),
})

export default function ProductBookingPage() {
  const { addToCart } = useOcCart()
  const [dealerships, setDealerships] = useState<string[]>([''])
  const { product } = useOcSelector((s) => {
    const ids = s.ocProductCache.ids || []
    const entities = s.ocProductCache.entities || {}
    const productList: ChetakProduct[] = ids
      .map((id) => entities[id] as ChetakProduct | undefined)
      .filter((product): product is ChetakProduct => product !== undefined)
    return {
      product: productList,
    }
  })

  useEffect(() => {
    const getDealers = async () => {
      const res = await Me.ListBuyerSellers()
      setDealerships(res?.Items?.map((x) => x?.Name))
    }
    if (product?.[0]?.ID) getDealers()
  }, [product?.[0]?.ID])

  const [selectedProduct, setSelectedProduct] = useState(product[0])
  const [currentStep, setCurrentStep] = useState(1)
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const [isDealerDropdownOpen, setIsDealerDropdownOpen] = useState(false)
  const router = useRouter()
  const dispatch = useOcDispatch()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialValues = {
    model: product[0]?.Name || '',
    location: '',
    color: (product?.[0] && Object?.keys(product?.[0]?.xp?.Colour[0])[0]) || '',
    bookingAmount: 2000,
    dealership: dealerships?.[0] || 'Select dealer',
    name: '',
    email: '',
    contact: '',
  }

  const handleModelSelect = (product, setFieldValue) => {
    setSelectedProduct(product)
    setFieldValue('model', product.Name)
    setFieldValue('color', Object.keys(product.xp.Colour[0])[0])
    setIsModelDropdownOpen(false)
  }

  const handleNext = (values, { setErrors }) => {
    step1Schema
      .validate(values, { abortEarly: false })
      .then(() => {
        setCurrentStep(2)
      })
      .catch((err) => {
        const errors = {}
        err.inner.forEach((error) => {
          errors[error.path] = error.message
        })
        setErrors(errors)
      })
  }

  const handleSubmit = async (values) => {
    localStorage.setItem('userEmail', values.email)
    step2Schema
      .validate(values, { abortEarly: false })
      .then(async () => {
        setIsSubmitting(true)
        const xp = {
          ...Object.fromEntries(
            Object.entries(values).map(([key, value]) => [
              key,
              typeof value === 'string' ? value.toLowerCase() : value,
            ])
          ),
        }
        await addToCart({ productId: selectedProduct?.ID, quantity: 1, xp })
        const res = await dispatch(submitOrder(() => {}))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push(`/confirmation/${(res.payload as any).order.ID}`)
        setIsSubmitting(false)
      })
      .catch((err) => {
        console.error('@@Order submission error', err)
      })
  }

  useEffect(() => {
    if (!selectedProduct?.ID) {
      setSelectedProduct(product[0])
    }
  }, [product])

  if (product?.length < 1) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="mx-auto">
        <div className="bg-transparent rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Product Image */}
            <div className="bg-gradient-to-br p-8 flex items-center justify-center">
              <div className="text-center">
                <ImageHelper url={selectedProduct?.xp?.Images?.[1]?.Url} />
              </div>
            </div>

            {/* Right Side - Booking Form */}
            <div className="p-8 lg:p-12">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <span className="ml-2 text-cyan-600 font-medium">Model</span>
                </div>
                <div
                  className={`flex-1 h-px ${
                    currentStep === 2 ? 'bg-cyan-600' : 'bg-gray-200 mx-4'
                  }`}
                ></div>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 ${
                      currentStep === 2 ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-500'
                    }  rounded-full flex items-center justify-center text-sm font-medium`}
                  >
                    2
                  </div>
                  <span className={`ml-2 ${currentStep === 2 ? 'text-cyan-600' : 'text-gray-200'}`}>
                    Details
                  </span>
                </div>
              </div>

              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, errors, touched, setFieldValue, setErrors }) => (
                  <Form>
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        {/* Model Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            MODEL
                          </label>
                          <div className="text-2xl font-bold text-gray-900 mb-2">
                            Your selected Chetak
                          </div>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                              className="w-full p-4 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-between hover:border-cyan-300 transition-colors"
                            >
                              <span className="text-2xl font-bold text-cyan-500">
                                {values.model}
                              </span>
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            </button>

                            {isModelDropdownOpen && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                {product?.map((product) => (
                                  <button
                                    key={product.ID}
                                    type="button"
                                    onClick={() => handleModelSelect(product, setFieldValue)}
                                    className="w-full p-4 text-left hover:bg-gray-50 flex justify-between items-center"
                                  >
                                    <span className="font-semibold">{product.Name}</span>
                                    <span className="text-sm text-gray-500">
                                      {formatPrice(product.PriceSchedule?.PriceBreaks?.[0]?.Price)}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {errors.model && touched.model && (
                            <div className="text-red-500 text-sm mt-1">{errors.model}</div>
                          )}
                        </div>

                        {/* Location Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            YOUR LOCATION
                          </label>
                          <div className="relative">
                            <Field
                              type="text"
                              name="location"
                              placeholder="Enter Pin code, State or City"
                              className="w-full p-4 border-2 border-gray-200 rounded-lg pr-12 focus:border-cyan-500 focus:outline-none transition-colors"
                            />
                            <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                          {errors.location && (
                            <div className="text-red-500 text-sm mt-1">{errors.location}</div>
                          )}
                        </div>

                        {/* Price Display */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">
                              Price Starting from (On-Road Price)
                            </span>
                            <button type="button" className="text-cyan-600 text-sm font-medium">
                              + View Breakup
                            </button>
                          </div>
                          <div className="text-3xl font-bold text-gray-900">
                            {formatPrice(selectedProduct?.PriceSchedule?.PriceBreaks?.[0]?.Price)}
                            /-*
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="text-cyan-600 underline">Karnataka</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Limited time additional offer of ₹7 243/- on 3501 and ₹7 000/- on 3503
                            in Bangalore ₹12 000/- on 3501 and ₹7 000/- on 3503 in Chennai. Visit
                            your nearest dealership today!
                          </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            COLOUR
                          </label>
                          <div className="text-lg font-semibold text-gray-900 mb-4">
                            {values.color}
                          </div>

                          <div className="flex space-x-3">
                            {selectedProduct?.xp?.Colour.map((colorObj, index) => {
                              const colorName = Object.keys(colorObj)[0]
                              const colorCode = Object.values(colorObj)[0]

                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => setFieldValue('color', colorName)}
                                  className={`w-12 h-12 rounded-full border-4 transition-all ${
                                    values.color === colorName
                                      ? 'border-cyan-500 scale-110'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                  style={{ backgroundColor: colorCode }}
                                />
                              )
                            })}
                          </div>
                          {errors.color && touched.color && (
                            <div className="text-red-500 text-sm mt-1">{errors.color}</div>
                          )}
                        </div>

                        {/* Booking Amount */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Booking Amount</span>
                            <span className="text-lg font-bold text-cyan-600">₹ 2,000/-*</span>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="button"
                          onClick={() => handleNext(values, { setErrors })}
                          disabled={isSubmitting}
                          className="w-full bg-gray-300 text-gray-600 py-4 rounded-lg font-semibold text-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                        >
                          {isSubmitting ? 'Processing...' : 'Fill Details'}
                        </button>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6">
                        {/* Dealership Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-2">
                            DEALERSHIPS
                          </label>
                          <div className="text-2xl font-bold text-gray-900 mb-6">
                            Which dealer is nearest to you?
                          </div>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setIsDealerDropdownOpen(!isDealerDropdownOpen)}
                              className="w-full p-4 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-between hover:border-cyan-300 transition-colors text-left"
                            >
                              <span className="text-lg font-medium text-gray-900">
                                {values.dealership}
                              </span>
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            </button>

                            {isDealerDropdownOpen && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                {dealerships.map((dealer, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                      setFieldValue('dealership', dealer)
                                      setIsDealerDropdownOpen(false)
                                    }}
                                    className="w-full p-4 text-left hover:bg-gray-50"
                                  >
                                    <span className="font-medium">{dealer}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {errors.dealership && touched.dealership && (
                            <div className="text-red-500 text-sm mt-1">{errors.dealership}</div>
                          )}

                          <div className="text-sm text-gray-600 mt-4">
                            <span className="text-cyan-600 underline">Gujarat</span>
                          </div>
                        </div>

                        {/* Personal Details */}
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-2">
                            YOUR DETAILS
                          </label>
                          <div className="text-2xl font-bold text-gray-900 mb-6">
                            Tell us a bit about yourself.
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Field
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                              />
                              {errors.name && touched.name && (
                                <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                              )}
                            </div>

                            <div>
                              <Field
                                type="email"
                                name="email"
                                placeholder="Email ID"
                                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                              />
                              {errors.email && touched.email && (
                                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                              )}
                            </div>

                            <div>
                              <Field
                                type="tel"
                                name="contact"
                                placeholder="Contact No"
                                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                              />
                              {errors.contact && touched.contact && (
                                <div className="text-red-500 text-sm mt-1">{errors.contact}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Booking Amount */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Booking Amount</span>
                            <span className="text-lg font-bold text-cyan-600">₹ 2,000/-*</span>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-cyan-400 text-white py-4 rounded-lg font-semibold text-lg hover:bg-cyan-500 transition-colors disabled:opacity-50"
                        >
                          {isSubmitting ? 'Processing...' : 'Book Now'}
                        </button>
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
