import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { BRAND_MODULE } from "../../../../modules/brand";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query");
  const handler = req.params.handler;
  const { data: brands } = await query.graph(
    {
      entity: "brand",
      fields: ["id", "name", "image", "products.*"],
      filters: {
        id: handler,
      },
    },
    {
      throwIfKeyNotFound: true,
    }
  );
  res.json({
    brand: brands[0],
  });
};
