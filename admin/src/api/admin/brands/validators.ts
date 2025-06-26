import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";

export const PostAdminCreateBrand = z.object({
  name: z.string(),
  handler: z.string().optional(),
  image: z.string().optional(),
});

export const PutAdminUpdateBrand = z.object({
  id: z.string(),
  name: z.string().optional(),
  handler: z.string().optional(),
  image: z.string().optional(),
});

export const GetBrandsSchema = createFindParams().extend({ filters: z.any() });
