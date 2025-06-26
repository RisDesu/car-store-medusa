import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section id="home" className="bg-stone-900 text-ui-fg-on-color py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col-reverse lg:flex-row items-center min-h-[60vh] gap-12">
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <Heading className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transform Your{" "}
              <span className="text-ui-fg-on-inverted">Ride</span>
            </Heading>
            <p className="text-lg md:text-xl mb-6">
              Discover premium car accessories that enhance performance, style,
              and comfort. From sleek interior upgrades to powerful exterior
              modifications.
            </p>
            <div className="flex gap-4 flex-wrap mb-8">
              <Button asChild size="large" className="font-bold">
                <LocalizedClientLink href="/store">
                  Shop now
                </LocalizedClientLink>
              </Button>
            </div>
            <div className="flex mt-8 gap-8">
              <div className="flex flex-col items-center">
                <h3 className="text-ui-button-inverted-pressed  text-3xl font-bold">
                  500+
                </h3>
                <p className="text-sm">Products</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-ui-button-inverted-pressed text-3xl font-bold">
                  50K+
                </h3>
                <p className="text-sm">Happy Customers</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-ui-button-inverted-pressed text-3xl font-bold">
                  5★
                </h3>
                <p className="text-sm">Rating</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="/img/ld_01.jpg"
              alt="Premium Car with Accessories"
              className="rounded-lg shadow-2xl max-w-full h-[300xp]"
              height={300}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
