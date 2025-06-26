import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { BRAND_MODULE } from "../modules/brand";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);
  const brandModuleService = container.resolve(BRAND_MODULE);

  // European Union countries
  const euCountries = ["gb", "de", "dk", "se", "fr", "es", "it"];
  // South East Asia countries
  const seCountries = ["vn", "sg", "my", "th", "ph", "id", "tl"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "eur",
          },
          {
            currency_code: "usd",
          },
          {
            currency_code: "jpy",
          },
          {
            currency_code: "vnd",
            is_default: true,
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries: euCountries,
          payment_providers: ["pp_system_default"],
        },
        {
          name: "South East Asia",
          currency_code: "vnd",
          countries: seCountries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: euCountries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "European Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
        {
          name: "South East Asia Warehouse",
          address: {
            city: "Ho Chi Minh City",
            country_code: "VN",
            address_1: "",
          },
        },
      ],
    },
  });
  const euStockLocation = stockLocationResult[0];
  const seStockLocation = stockLocationResult[1];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: euStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const [euFulfillmentSet, seFulfillmentSet] =
    await fulfillmentModuleService.createFulfillmentSets([
      {
        name: "European Warehouse delivery",
        type: "shipping",
        service_zones: [
          {
            name: "Europe",
            geo_zones: [
              {
                country_code: "gb",
                type: "country",
              },
              {
                country_code: "de",
                type: "country",
              },
              {
                country_code: "dk",
                type: "country",
              },
              {
                country_code: "se",
                type: "country",
              },
              {
                country_code: "fr",
                type: "country",
              },
              {
                country_code: "es",
                type: "country",
              },
              {
                country_code: "it",
                type: "country",
              },
            ],
          },
        ],
      },
      {
        name: "South East Asia Warehouse delivery",
        type: "shipping",
        service_zones: [
          {
            name: "South East Asia",
            geo_zones: [
              {
                country_code: "vn",
                type: "country",
              },
              {
                country_code: "sg",
                type: "country",
              },
              {
                country_code: "my",
                type: "country",
              },
              {
                country_code: "th",
                type: "country",
              },
              {
                country_code: "ph",
                type: "country",
              },
              {
                country_code: "id",
                type: "country",
              },
              {
                country_code: "tl",
                type: "country",
              },
            ],
          },
        ],
      },
    ]);

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: euStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: euFulfillmentSet.id,
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: seStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: seFulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: euFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: euFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: euStockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: seStockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Maintenance & Care",
          is_active: true,
        },
        {
          name: "Parts & Components",
          is_active: true,
        },
        {
          name: "Interior Accessories",
          is_active: true,
        },
        {
          name: "Exterior Accessories",
          is_active: true,
        },
      ],
    },
  });

  const brands = [
    {
      name: "Tesla",
      handle: "tesla",
      image: "https://cdn.worldvectorlogo.com/logos/tesla-motors.svg",
    },
    {
      name: "Ford",
      handle: "ford",
      image: "https://cdn.worldvectorlogo.com/logos/ford-1.svg",
    },
    {
      name: "BMW",
      handle: "bmw",
      image: "https://cdn.worldvectorlogo.com/logos/bmw-2.svg",
    },
    {
      name: "Mercedes-Benz",
      handle: "mercedes-benz",
      image: "https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg",
    },
    {
      name: "Toyota",
      handle: "toyota",
      image: "https://cdn.worldvectorlogo.com/logos/toyota-7.svg",
    },
    {
      name: "Honda",
      handle: "honda",
      image: "https://cdn.worldvectorlogo.com/logos/honda-motorcycles-1.svg",
    },
    {
      name: "Nissan",
      handle: "nissan",
      image: "https://cdn.worldvectorlogo.com/logos/nissan-1.svg",
    },
  ];

  await brandModuleService.createBrands(brands);

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Car Engine Oil",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Maintenance & Care")!.id,
          ],
          description:
            "Premium synthetic engine oil for cars. Suitable for all modern engines.",
          handle: "car-engine-oil",
          weight: 5000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://m.media-amazon.com/images/I/51rELvM-zRL._AC_SR300,300_.jpg",
            },
            {
              url: "https://m.media-amazon.com/images/I/41aPb1G+WsL._AC_SR300,300_.jpg",
            },
          ],
          options: [{ title: "Volume", values: ["1L", "4L"] }],
          variants: [
            {
              title: "1L",
              sku: "OIL-1L",
              options: { Volume: "1L" },
              prices: [
                { amount: 250000, currency_code: "vnd" },
                { amount: 10, currency_code: "eur" },
                { amount: 12, currency_code: "usd" },
              ],
            },
            {
              title: "4L",
              sku: "OIL-4L",
              options: { Volume: "4L" },
              prices: [
                { amount: 900000, currency_code: "vnd" },
                { amount: 35, currency_code: "eur" },
                { amount: 40, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Car Battery",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Parts & Components")!.id,
          ],
          description: "High performance car battery with long life.",
          handle: "car-battery",
          weight: 15000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://m.media-amazon.com/images/I/61QIWKC6S6L._AC_SL1500_.jpg",
            },
            {
              url: "https://m.media-amazon.com/images/I/61CmMusdNoL._AC_SL1500_.jpg",
            },
            {
              url: "https://m.media-amazon.com/images/I/81DgaHcNgZL._AC_SL1500_.jpg",
            },
            {
              url: "https://m.media-amazon.com/images/I/71Yc7Go1QLL._AC_SL1500_.jpg",
            },
          ],
          options: [{ title: "Type", values: ["Standard", "AGM"] }],
          variants: [
            {
              title: "Standard",
              sku: "BATTERY-STANDARD",
              options: { Type: "Standard" },
              prices: [
                { amount: 1200000, currency_code: "vnd" },
                { amount: 45, currency_code: "eur" },
                { amount: 50, currency_code: "usd" },
              ],
            },
            {
              title: "AGM",
              sku: "BATTERY-AGM",
              options: { Type: "AGM" },
              prices: [
                { amount: 1800000, currency_code: "vnd" },
                { amount: 70, currency_code: "eur" },
                { amount: 80, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Car Floor Mats",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Interior Accessories")!
              .id,
          ],
          description: "Durable and easy-to-clean car floor mats.",
          handle: "car-floor-mats",
          weight: 2000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://m.media-amazon.com/images/I/61TTBxuCEuL._SS400_.jpg",
            },
            {
              url: "https://m.media-amazon.com/images/I/61R+wKydtTL._SS400_.jpg",
            },
          ],
          options: [{ title: "Color", values: ["Black", "Beige"] }],
          variants: [
            {
              title: "Black",
              sku: "MATS-BLACK",
              options: { Color: "Black" },
              prices: [
                { amount: 400000, currency_code: "vnd" },
                { amount: 15, currency_code: "eur" },
                { amount: 18, currency_code: "usd" },
              ],
            },
            {
              title: "Beige",
              sku: "MATS-BEIGE",
              options: { Color: "Beige" },
              prices: [
                { amount: 400000, currency_code: "vnd" },
                { amount: 15, currency_code: "eur" },
                { amount: 18, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Car Wiper Blades",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Exterior Accessories")!
              .id,
          ],
          description: "All-season car wiper blades for clear visibility.",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://m.media-amazon.com/images/I/71cTysOgcaL._AC_SL1500_.jpg",
            },
            {
              url: "https://m.media-amazon.com/images/I/71enRzMTX2L._AC_SL1500_.jpg",
            },
            {
              url: "https://m.media-amazon.com/images/I/7152bDbI8lL._AC_SL1500_.jpg",
            },
            {
              url: "https://m.media-amazon.com/images/I/71yA-BvZKlL._AC_SL1500_.jpg",
            },
          ],
          options: [{ title: "Size", values: ["16in", "20in", "24in"] }],
          variants: [
            {
              title: "16in",
              sku: "WIPER-16IN",
              options: { Size: "16in" },
              prices: [
                { amount: 120000, currency_code: "vnd" },
                { amount: 5, currency_code: "eur" },
                { amount: 6, currency_code: "usd" },
              ],
            },
            {
              title: "20in",
              sku: "WIPER-20IN",
              options: { Size: "20in" },
              prices: [
                { amount: 150000, currency_code: "vnd" },
                { amount: 6, currency_code: "eur" },
                { amount: 7, currency_code: "usd" },
              ],
            },
            {
              title: "24in",
              sku: "WIPER-24IN",
              options: { Size: "24in" },
              prices: [
                { amount: 180000, currency_code: "vnd" },
                { amount: 7, currency_code: "eur" },
                { amount: 8, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const seInventoryLevel = {
      location_id: euStockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    const seInventoryItem = {
      location_id: seStockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };

    inventoryLevels.push(seInventoryLevel, seInventoryItem);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
