import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";
import { StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { BRAND_MODULE } from "../../modules/brand";

updateProductsWorkflow.hooks.productsUpdated(
  async ({ products, additional_data }, { container, context }) => {
    if (!additional_data?.brand_id) {
      return new StepResponse([], []);
    }
    const link = container.resolve("link");
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { data: prevProducts } = await query.graph({
      entity: Modules.PRODUCT,
      fields: ["id", "brand.*"],
      filters: {
        id: {
          $in: products.map((product) => product.id),
        },
      },
    });
    const links = products.map((product) => ({
      [Modules.PRODUCT]: { product_id: product.id },
      [BRAND_MODULE]: { brand_id: additional_data.brand_id },
    }));

    // First, dismiss any existing link between the product and a brand
    for (const product of prevProducts) {
      // You may need to know the previous brand_id; if not, you can try dismissing by product only
      await link.dismiss({
        [Modules.PRODUCT]: { product_id: product.id },
        [BRAND_MODULE]: { brand_id: product.brand?.id },
      });
    }

    // Then, create the new link
    for (const product of products) {
      await link.create({
        [Modules.PRODUCT]: { product_id: product.id },
        [BRAND_MODULE]: { brand_id: additional_data.brand_id },
      });
    }
    return new StepResponse(links, links);
  }
);
