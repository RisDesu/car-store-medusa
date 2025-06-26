import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"

export default function BrandTemplate({
  brand,
  sortBy,
  page,
  countryCode,
  data,
}: {
  brand: any
  sortBy?: SortOptions
  page?: string
  countryCode: string
  data?: any
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!brand || !countryCode) notFound()

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="brand-container"
    >
      <RefinementList
        sortBy={sort}
        data-testid="sort-by-container"
        data={data}
      />
      <div className="w-full">
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          <h1 data-testid="brand-page-title">{brand.name}</h1>
        </div>
        {brand.description && (
          <div className="mb-8 text-base-regular">
            <p>{brand.description}</p>
          </div>
        )}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={brand.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            productsIds={brand.products?.map((p: any) => p.id) ?? []}
          />
        </Suspense>
      </div>
    </div>
  )
}
