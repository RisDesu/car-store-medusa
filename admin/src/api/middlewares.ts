import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import {
  GetBrandsSchema,
  PostAdminCreateBrand,
} from "./admin/brands/validators";
import { z } from "zod";
import { GetProductTypesSchema } from "./store/types/validator";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/brands",
      method: "POST",
      middlewares: [validateAndTransformBody(PostAdminCreateBrand)],
    },
    {
      matcher: "/admin/products",
      method: ["POST"],
      additionalDataValidator: {
        brand_id: z.string().optional(),
      },
    },
    {
      matcher: "/admin/brands",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetBrandsSchema, {
          defaults: ["id", "name", "products.*"],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/store/types",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetProductTypesSchema, {
          defaults: ["id", "value", "label", "metadata"],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/store/brands",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetBrandsSchema, {
          defaults: ["id", "name", "handler", "products.*"],

          isList: true,
        }),
      ],
    },
    {
      matcher: "/store/brands/[handler]",
      methods: ["GET"],
      middlewares: [],
    },
  ],
});
