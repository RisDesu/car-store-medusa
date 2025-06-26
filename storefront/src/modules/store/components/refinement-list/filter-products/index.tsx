"use client"

import { HttpTypes } from "@medusajs/types"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type FilterProductSchema = {
  category?: string
  type?: string
}
export type FilterProductsProps = {
  "data-testid"?: string
  data: FilterProductSchema
  setQueryParams: (key: keyof FilterProductSchema, value: string) => void
  categories?: HttpTypes.StoreProductCategory[]
  types?: HttpTypes.AdminProductType[]
}

const FilterProducts = ({
  "data-testid": dataTestId,
  data,
  setQueryParams,
  categories,
  types,
}: FilterProductsProps) => {
  const handleChange = (key: keyof FilterProductSchema, value: string) => {
    setQueryParams(key, value)
  }

  return (
    <>
      {categories && (
        <FilterRadioGroup
          title="Categories"
          items={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          value={data.category}
          handleChange={(value) => handleChange("category", value)}
          data-testid={dataTestId}
        />
      )}
      {types && (
        <FilterRadioGroup
          title="Types"
          items={types.map((type) => ({ value: type.id, label: type.value }))}
          value={data.type}
          handleChange={(value) => handleChange("type", value)}
          data-testid={dataTestId}
        />
      )}
    </>
  )
}

export default FilterProducts
