import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <div className="py-12">
        <div className="px-12">
          <Heading>Featured Products</Heading>
        </div>
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
      <div className="min-h-screen">
        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="w-full">
                <h2 className="text-4xl md:text-5xl font-bold mb-3">
                  Why Choose AutoElite?
                </h2>
                <p className="text-lg md:text-xl text-gray-600">
                  Premium quality accessories for the modern driver
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="w-full">
                <div className="h-full rounded-lg border-0 shadow-sm">
                  <div className="p-6 text-center">
                    <div className="bg-ui-button-inverted rounded-full inline-flex items-center justify-center mb-3 w-14 h-14">
                      <span className="text-2xl">🚗</span>
                    </div>
                    <h5 className="text-xl font-semibold">Premium Quality</h5>
                    <p className="text-gray-600">
                      Hand-picked accessories from top manufacturers worldwide,
                      ensuring durability and style.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="h-full rounded-lg border-0 shadow-sm">
                  <div className="p-6 text-center">
                    <div className="bg-ui-button-inverted rounded-full inline-flex items-center justify-center mb-3 w-14 h-14">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h5 className="text-xl font-semibold">Fast Installation</h5>
                    <p className="text-gray-600">
                      Easy-to-install products with detailed guides and
                      professional installation services available.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="h-full rounded-lg border-0 shadow-sm">
                  <div className="p-6 text-center">
                    <div className="bg-ui-button-inverted rounded-full inline-flex items-center justify-center mb-3 w-14 h-14">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <h5 className="text-xl font-semibold">Lifetime Warranty</h5>
                    <p className="text-gray-600">
                      Comprehensive warranty coverage on all products with 24/7
                      customer support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-3">
                What Our Customers Say
              </h2>
              <p className="text-lg text-gray-300">
                Real reviews from satisfied customers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full">
                <div className="mb-4">
                  <span className="text-ui-button-inverted">★★★★★</span>
                </div>
                <p className="text-gray-300 mb-4 flex-grow">
                  "Amazing quality and fast shipping! The LED headlights
                  completely transformed my car's look."
                </p>
                <div className="flex items-center mt-auto">
                  <Image
                    src="https://untitledui.com/images/avatars/transparent/orlando-diggs"
                    width={40}
                    height={40}
                    className="rounded-full mr-4 w-[40px] h-[40px]"
                    alt="Customer"
                  />
                  <div>
                    <h6 className="font-semibold">Sarah Johnson</h6>
                    <small className="text-gray-400">BMW Owner</small>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full">
                <div className="mb-4">
                  <span className="text-ui-button-inverted">★★★★★</span>
                </div>
                <p className="text-gray-300 mb-4 flex-grow">
                  "Professional installation service and top-notch products.
                  Highly recommend AutoElite!"
                </p>
                <div className="flex items-center mt-auto">
                  <Image
                    src="https://untitledui.com/images/avatars/zahir-mays"
                    width={40}
                    height={40}
                    className="rounded-full mr-4 w-[40px] h-[40px]"
                    alt="Customer"
                  />
                  <div>
                    <h6 className="font-semibold">Mike Chen</h6>
                    <small className="text-gray-400">Audi Owner</small>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full">
                <div className="mb-4">
                  <span className="text-ui-button-inverted">★★★★★</span>
                </div>
                <p className="text-gray-300 mb-4 flex-grow">
                  "Best car accessories store! Great prices and excellent
                  customer service support."
                </p>
                <div className="flex items-center mt-auto">
                  <Image
                    width={40}
                    height={40}
                    src="https://untitledui.com/images/avatars/phoenix-baker"
                    className="rounded-full mr-4 w-[40px] h-[40px]"
                    alt="Customer"
                  />
                  <div>
                    <h6 className="font-semibold">Emily Rodriguez</h6>
                    <small className="text-gray-400">Tesla Owner</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-ui-button-inverted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-3">
                Ready to Upgrade Your Ride?
              </h2>
              <p className="text-lg text-black mb-6">
                Join thousands of satisfied customers and transform your vehicle
                today.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  size="large"
                  className="font-bold"
                  asChild
                  variant="secondary"
                >
                  <LocalizedClientLink href="/store">
                    Shop now
                  </LocalizedClientLink>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
