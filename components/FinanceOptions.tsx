import Link from 'next/link'
import React from 'react'

const FinanceOptions = () => {
  return (
    <section className="finance-options py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm uppercase tracking-wider text-gray-600 mb-2">PLAN YOUR BUY</p>
        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
          Get smart finance and EMI options for your electric scooter
        </h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
          Now it is more economical to own an electric scooter while reducing the financial burden
          of upfront payment.
        </p>

        <Link
          href="https://availfinance.chetak.com/"
          target="_blank"
          className="calculate-emi-button inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300 mb-12"
        >
          Calculate Your EMI
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="info-item flex flex-col items-center">
            {/* Icon Placeholder */}
            <div className="icon-placeholder w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
            <p className="text-sm uppercase text-gray-600">TENURE UP TO</p>
            <p className="text-xl font-semibold text-purple-900">60 months</p>
          </div>

          <div className="info-item flex flex-col items-center">
            {/* Icon Placeholder */}
            <div className="icon-placeholder w-12 h-12 bg-green-200 rounded-full mb-4"></div>
            <p className="text-sm uppercase text-gray-600">RATE OF INTEREST AT</p>
            <p className="text-xl font-semibold text-purple-900">6.99%</p>
          </div>

          <div className="info-item flex flex-col items-center">
            {/* Icon Placeholder */}
            <div className="icon-placeholder w-12 h-12 bg-yellow-200 rounded-full mb-4"></div>
            <p className="text-sm uppercase text-gray-600">DOWNPAYMENT</p>
            <p className="text-xl font-semibold text-purple-900">Starts @ ₹0</p>
          </div>

          <div className="info-item flex flex-col items-center">
            {/* Icon Placeholder */}
            <div className="icon-placeholder w-12 h-12 bg-red-200 rounded-full mb-4"></div>
            <p className="text-sm uppercase text-gray-600">PROCESSING FEE</p>
            <p className="text-xl font-semibold text-purple-900">Zero</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinanceOptions
