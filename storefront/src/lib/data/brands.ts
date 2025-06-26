"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"
import { Http2SecureServer } from "http2"

export const listBrands = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("types")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{
      brands: {
        id: string
        name: string
        image?: string
        products?: HttpTypes.StoreProduct[]
      }[]
    }>("/store/brands", {
      query: {
        limit,
        ...query,
      },
      next,
      cache: "force-cache",
    })
    .then(({ brands }) => brands)
}

export const getBrandByHandle = async (
  handle: string,
  filter?: Record<string, string>
) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<{ brand: any }>(`/store/brands/${handle}`, {
      query: { filters: filter },
      next,
      cache: "force-cache",
    })
    .then(({ brand }) => brand)
}
