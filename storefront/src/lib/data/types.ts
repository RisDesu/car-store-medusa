"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const listProductTypes = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("types")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ types: HttpTypes.StoreProductType[] }>("/store/types", {
      query: {
        limit,
        ...query,
      },
      next,
      cache: "force-cache",
    })
    .then(({ types }) => types)
}
