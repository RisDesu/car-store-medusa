import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { BRAND_MODULE } from "../modules/brand";
import slugyfy from "slugify";
import BrandModuleService from "../modules/brand/service";

export type CreateBrandStepInput = {
  name: string;
  handler?: string;
  image?: string;
};

export const createBrandStep = createStep(
  "create-brand-step",
  async (input: CreateBrandStepInput, { container }) => {
    const brandModuleService: BrandModuleService =
      container.resolve(BRAND_MODULE);

    const brand = await brandModuleService.createBrands({
      ...input,
      handle:
        input.handler && input.handler.length > 0
          ? slugyfy(input.handler, { lower: true })
          : slugyfy(input.name, { lower: true }),
    });

    return new StepResponse(brand, brand.id);
  },
  async (id: string, { container }) => {
    const brandModuleService: BrandModuleService =
      container.resolve(BRAND_MODULE);

    await brandModuleService.deleteBrands(id);
  }
);

type CreateBrandWorkflowInput = {
  name: string;
  handler?: string;
  image?: string;
};

export const createBrandWorkflow = createWorkflow(
  "create-brand",
  (input: CreateBrandWorkflowInput) => {
    const brand = createBrandStep(input);

    return new WorkflowResponse(brand);
  }
);
