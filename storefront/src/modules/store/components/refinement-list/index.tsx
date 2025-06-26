"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import { HttpTypes } from "@medusajs/types"
import FilterProducts, { FilterProductsProps } from "./filter-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
  children?: React.ReactNode
} & Pick<FilterProductsProps, "categories" | "data" | "types">

const RefinementList = ({
  sortBy,
  "data-testid": dataTestId,
  categories,
  types,
  data,
  children,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
      <FilterProducts
        data-testid={dataTestId}
        data={data}
        setQueryParams={setQueryParams}
        categories={categories}
        types={types}
      />
      {children}
    </div>
  )
}

export default RefinementList
