import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"
import { FilterProductsProps } from "../components/refinement-list/filter-products"
import Divider from "@modules/common/components/divider"
import { title } from "process"
import { Avatar, Text } from "@medusajs/ui"
import Link from "next/link"

type StoreTemplateProps = {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  brands?: { id: string; name: string; image?: string }[]
} & Pick<FilterProductsProps, "categories" | "data" | "types">

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  categories,
  data,
  types,
  brands,
}: StoreTemplateProps) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList
        categories={categories}
        data={data}
        sortBy={sort}
        types={types}
      >
        <Divider className="w-1/2" />
        <div className="flex gap-x-3 flex-col gap-y-3">
          <Text className="txt-compact-small-plus text-ui-fg-muted">Brand</Text>
          <ul className="flex flex-col gap-y-2">
            {brands?.map((brand) => (
              <li key={brand.id}>
                <Link
                  href={`/brands/${brand.id}`}
                  className="flex gap-1 items-center"
                >
                  <Avatar
                    src={brand.image}
                    fallback={brand.name}
                    size="small"
                  />
                  <Text className="!txt-compact-small !transform-none text-ui-fg-subtle hover:cursor-pointer">
                    {brand.name}
                  </Text>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </RefinementList>
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">All products</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            category={data.category}
            categoryId={data.category}
            type={data.type}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
