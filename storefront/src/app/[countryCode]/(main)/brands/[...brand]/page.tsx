import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getBrandByHandle, listBrands } from "@lib/data/brands"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import BrandTemplate from "@modules/brands/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { listProductTypes } from "@lib/data/types"

// Brand page props
// params.brand: [brandHandle]
// params.countryCode: string
// searchParams: sortBy, page, type

type Props = {
  params: Promise<{ brand: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    type?: string
  }>
}

export async function generateStaticParams() {
  const brands = await listBrands()

  if (!brands) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const brandHandles = brands.map((brand: any) => brand.id)

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      brandHandles.map((handle: any) => ({
        countryCode,
        brand: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const brands = await listBrands()
    const brand = brands.find((b: any) => b.id === params.brand[0])
    if (!brand) throw new Error("Brand not found")
    const title = brand.name + " | Medusa Store"
    const description = `${title} brand.`
    return {
      title: `${title} | Medusa Store`,
      description,
      alternates: {
        canonical: `${params.brand.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function BrandPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page, type } = searchParams

  const brand = await getBrandByHandle(params.brand[0])
  if (!brand) {
    notFound()
  }

  return (
    <BrandTemplate
      brand={brand}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      data={{ type }}
    />
  )
}
