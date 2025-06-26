import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: types, metadata: { count, take, skip } = {} } =
    await query.graph({
      entity: "product_type",
      ...req.queryConfig,
    });
  res.json({
    types,
    count,
    limit: take,
    offset: skip,
  });
};
