import { FunctionComponent, useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

interface TestRideFormProps {
  isOpen: boolean
  onClose: () => void
}

const TestRideForm: FunctionComponent<TestRideFormProps> = ({ isOpen, onClose }) => {
  const formRef = useRef<HTMLDivElement>(null)

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    preferredModel: Yup.string().required('Preferred Model is required'),
    preferredDealership: Yup.string().required('Preferred Dealership is required'),
    area: Yup.string().required('Area is required'),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      preferredModel: '',
      preferredDealership: '',
      area: '',
      whatsappUpdates: false,
    },
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission
      console.log('Form submitted:', values)
      onClose() // Close the form after submission (for now)
    },
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <div
      ref={formRef}
      className={`fixed inset-y-0 left-0 w-full md:w-1/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 h-full overflow-y-auto">
        <button className="absolute top-4 right-4 text-gray-600" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6">Book Test Ride</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              WHAT SHOULD WE CALL YOU?
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter Name"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <label htmlFor="preferredModel" className="block text-sm font-medium text-gray-700">
              YOUR PREFERRED MODEL?
            </label>
            {/* This could be a dropdown/select input in a real application */}
            <input
              type="text"
              id="preferredModel"
              name="preferredModel"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.preferredModel}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Chetak 2903, Chetak 3501, etc."
            />
            {formik.touched.preferredModel && formik.errors.preferredModel ? (
              <div className="text-red-500 text-sm">{formik.errors.preferredModel}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="preferredDealership"
              className="block text-sm font-medium text-gray-700"
            >
              YOUR PREFERRED DEALERSHIP
            </label>
            {/* This could be a dropdown/select input in a real application */}
            <input
              type="text"
              id="preferredDealership"
              name="preferredDealership"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.preferredDealership}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Select Dealer"
            />
            {formik.touched.preferredDealership && formik.errors.preferredDealership ? (
              <div className="text-red-500 text-sm">{formik.errors.preferredDealership}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">
              AREA
            </label>
            <input
              type="text"
              id="area"
              name="area"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.area}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter Area 'e.g. Andheri'"
            />
            {formik.touched.area && formik.errors.area ? (
              <div className="text-red-500 text-sm">{formik.errors.area}</div>
            ) : null}
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="whatsappUpdates"
              name="whatsappUpdates"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              checked={formik.values.whatsappUpdates}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="whatsappUpdates" className="ml-2 block text-sm text-gray-900">
              Get Updates On WhatsApp
            </label>
          </div>

          <div className="text-sm text-gray-600 mb-6">
            By clicking on Get OTP, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">
              T&C
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            , and to have a valid driving license.
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Get OTP
          </button>
        </form>
      </div>
    </div>
  )
}

export default TestRideForm
