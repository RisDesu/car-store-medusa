import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { listCategories } from "@lib/data/categories"
import { listBrands } from "@lib/data/brands"
import { listProductTypes } from "@lib/data/types"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    brand?: string
    type?: string
    category?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const [brands, categories, types] = await Promise.all([
    listBrands({
      fields: "id,name,image",
    }),
    listCategories(),
    listProductTypes(),
  ])
  const { sortBy, page, brand, type, category } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      data={{ type, category }}
      categories={categories}
      types={types}
      brands={brands}
      countryCode={params.countryCode}
    />
  )
}
